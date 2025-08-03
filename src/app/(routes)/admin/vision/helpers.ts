import { Action } from "../_components/form/RDCVisionModal";

/**
 * Cleans up resources and resets UI state after vision analysis
 *
 * @description
 * This function:
 * 1. Revokes the object URL for the preview image to prevent memory leaks
 * 2. Resets all UI state to initial values
 *
 * @param previewUrl - URL of the preview image to cleanup
 * @param dispatch - Function to update UI state
 */
export const handleClose = async (
  previewUrl: string | null,
  dispatch: (action: Action) => void,
) => {
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }
  dispatch({ type: "RESET" });
};
