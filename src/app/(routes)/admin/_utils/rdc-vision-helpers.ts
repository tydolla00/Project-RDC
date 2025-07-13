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
  if (!state.selectedFile) return;

  dispatch({
    type: "UPDATE_VISION",
    visionStatus: null,
    visionMsg: "Analyzing...",
    loading: true,
  });

  try {
    // Run independent async operations in parallel
    const [base64FileContent, gameId] = await Promise.all([
      getFileAsBase64(state.selectedFile),
      getGameIdFromName(gameName),
    ]);

    const analysisResults = await analyzeScreenShot(
      base64FileContent,
      sessionPlayers,
      gameId,
    );

    console.log("analysis Results: ", analysisResults);

    // Handle success and check-request cases first
    if (
      analysisResults.status === VisionResultCodes.Success ||
      analysisResults.status === VisionResultCodes.CheckRequest
    ) {
      handleCreateMatchFromVision(
        analysisResults.data.players,
        analysisResults.data.winner || [],
      );
    }

    // Update UI based on status
    dispatch({
      type: "UPDATE_VISION",
      visionStatus: analysisResults.status,
      visionMsg: analysisResults.message,
    });

    // Show toast notifications
    switch (analysisResults.status) {
      case VisionResultCodes.Success:
        toast.success("Success", { richColors: true });
        if (onSuccessClose) onSuccessClose(); // Close modal only on success
        break;
      case VisionResultCodes.CheckRequest:
        toast.warning(analysisResults.message, { richColors: true });
        break;
      case VisionResultCodes.Failed:
        toast.error(analysisResults.message, { richColors: true });
        break;
    }
  } catch (error) {
    console.error("Error in handleAnalyzeBtnClick: ", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    dispatch({
      type: "UPDATE_VISION",
      visionStatus: VisionResultCodes.Failed,
      visionMsg: errorMessage,
    });
    toast.error(errorMessage, { richColors: true });
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

const getFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is "data:image/png;base64,iVBORw0KGgo..."
      // We need to extract just the base64 part
      const base64 = (reader.result as string)?.split(",")[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error("Could not extract base64 string from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
