import { VisionResultCodes } from "@/lib/constants";
import { toast } from "sonner";
import { Player } from "@prisma/client";
import { analyzeScreenShot } from "@/app/actions/visionAction";
import { Action, State } from "../_components/form/RDCVisionModal";

export const handleAnalyzeBtnClick = async (
  state: State,
  dispatch: (action: Action) => void,
  handleCreateMatchFromVision: (vr: any) => void,
  sessionPlayers: Player[],
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

    if (!base64FileContent) {
      toast.error("Unknown error has occurred, please try again.", {
        richColors: true,
      });
      return;
    }

    const visionResult = await analyzeScreenShot(
      base64FileContent,
      sessionPlayers,
      3,
    );

    switch (visionResult.status) {
      case VisionResultCodes.Success:
        handleCreateMatchFromVision(visionResult.data);
        dispatch({
          type: "UPDATE_VISION",
          visionStatus: VisionResultCodes.Success,
          visionMsg: visionResult.message,
        });
        toast.success("Success", { richColors: true });
        break;
      case VisionResultCodes.CheckRequest:
        handleCreateMatchFromVision(visionResult.data);
        dispatch({
          type: "UPDATE_VISION",
          visionStatus: VisionResultCodes.CheckRequest,
          visionMsg: visionResult.message,
        });
        toast.warning(visionResult.message, { richColors: true });
        break;
      case VisionResultCodes.Failed:
        dispatch({
          type: "UPDATE_VISION",
          visionStatus: VisionResultCodes.Failed,
          visionMsg: visionResult.message,
        });
        toast.error(visionResult.message, { richColors: true });
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
