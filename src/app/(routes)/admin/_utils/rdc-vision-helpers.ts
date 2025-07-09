import { VisionResultCodes } from "@/lib/constants";
import { toast } from "sonner";
import { Player } from "@prisma/client";
import { analyzeScreenShot, VisionPlayer } from "@/app/actions/visionAction";
import { Action, State } from "../_components/form/RDCVisionModal";
import { getGameIdFromName } from "@/app/actions/adminAction";

export const handleAnalyzeBtnClick = async (
  state: State,
  dispatch: (action: Action) => void,
  handleCreateMatchFromVision: (
    visionPlayers: VisionPlayer[],
    visionWinner: VisionPlayer[],
  ) => void,
  sessionPlayers: Player[],
  gameName: string,
  onSuccessClose?: () => void,
): Promise<void> => {
  try {
    if (!state.selectedFile) return;

    dispatch({
      type: "UPDATE_VISION",
      visionStatus: null,
      visionMsg: "Analyzing...",
      loading: true,
    });

    const base64FileContent = await getFileAsBase64(state.selectedFile);

    // Get game ID with error handling
    let gameId: number;
    try {
      gameId = await getGameIdFromName(gameName);
      if (!gameId) {
        throw new Error(`Game "${gameName}" not found`);
      }
    } catch (error) {
      console.error("Failed to get game ID:", error);
      dispatch({
        type: "UPDATE_VISION",
        visionStatus: VisionResultCodes.Failed,
        visionMsg: `Unable to find game "${gameName}". Please verify the game name is correct.`,
        loading: false,
      });
      toast.error(`Game "${gameName}" not found`, { richColors: true });
      return;
    }

    if (!base64FileContent) {
      toast.error("Unknown error has occurred, please try again.", {
        richColors: true,
      });
      return;
    }

    const analysisResults = await analyzeScreenShot(
      base64FileContent,
      sessionPlayers,
      gameId, // TODO: This should be from the selected game
    );

    console.log("analysis Results: ", analysisResults);

    switch (analysisResults.status) {
      case VisionResultCodes.Success:
        handleCreateMatchFromVision(
          analysisResults.data.players,
          analysisResults.data.winner || [],
        );
        dispatch({
          type: "UPDATE_VISION",
          visionStatus: VisionResultCodes.Success,
          visionMsg: analysisResults.message,
        });
        toast.success("Success", { richColors: true });
        // Only close modal on success
        if (onSuccessClose) onSuccessClose();
        break;
      case VisionResultCodes.CheckRequest:
        handleCreateMatchFromVision(
          analysisResults.data.players,
          analysisResults.data.winner || [],
        );
        dispatch({
          type: "UPDATE_VISION",
          visionStatus: VisionResultCodes.CheckRequest,
          visionMsg: analysisResults.message,
        });
        toast.warning(analysisResults.message, { richColors: true });
        break;
      case VisionResultCodes.Failed:
        dispatch({
          type: "UPDATE_VISION",
          visionStatus: VisionResultCodes.Failed,
          visionMsg: analysisResults.message,
        });
        toast.error(analysisResults.message, { richColors: true });
        break;
      default:
        break;
    }

    handleClose(state.previewUrl, dispatch);
  } catch (error) {
    console.error("Error in handleAnalyzeBtnClick: ", error);
    dispatch({
      type: "UPDATE_VISION",
      visionStatus: VisionResultCodes.Failed,
      visionMsg: "An error occurred",
      loading: false,
    });
  } finally {
    dispatch({ type: "UPDATE_LOADING", loading: false });
  }
};

export const handleClose = (
  previewUrl: string | null,
  dispatch: (action: Action) => void,
) => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
  dispatch({ type: "RESET" });
};

const getFileAsBase64 = async (selectedFile: File) => {
  const reader = new FileReader();

  const readFile = () =>
    new Promise((resolve, reject) => {
      reader.onload = async (e) => resolve(e.target?.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(selectedFile!);
    });
  const fileContent = await readFile();

  if (!fileContent) {
    console.error("Error reading file content");
    return;
  }

  const base64FileContent = Buffer.from(fileContent as ArrayBuffer).toString(
    "base64",
  );

  return base64FileContent;
};
