import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useReducer, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  LoaderCircle,
  ScanEye,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Player } from "@prisma/client";
import Image from "next/image";
import { VisionResultCodes } from "@/lib/constants";
import { toast } from "sonner";
import {
  handleClose,
  handleAnalyzeBtnClick,
} from "../../_utils/rdc-vision-helpers";
import { VisionPlayer } from "@/app/actions/visionAction";

interface Props {
  handleCreateMatchFromVision: (
    visionPlayers: VisionPlayer[],
    visionWinners: VisionPlayer[],
  ) => void;
  sessionPlayers: Player[];
  gameName: string;
}

const initialState = {
  selectedFile: null as File | null,
  isLoading: false,
  visionStatus: null as VisionResultCodes | null,
  visionMsg: "",
  previewUrl: null as string | null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_FILE":
      return {
        ...state,
        selectedFile: action.file,
        previewUrl: action.previewUrl,
      };
    case "UPDATE_VISION":
      return {
        ...state,
        visionStatus: action.visionStatus,
        visionMsg: action.visionMsg,
        isLoading: action.loading ?? state.isLoading,
      };
    case "UPDATE_LOADING":
      return { ...state, isLoading: action.loading };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const RDCVisionModal = (props: Props) => {
  const { handleCreateMatchFromVision, sessionPlayers, gameName } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const { selectedFile, isLoading, visionStatus, visionMsg, previewUrl } =
    state;

  const visionButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;

    if (!items) return;
    for (const item of Array.from(items)) {
      const file = item.getAsFile();

      if (item.type.indexOf("image") !== -1 && file) {
        const url = URL.createObjectURL(file);
        dispatch({ type: "UPDATE_FILE", file: file, previewUrl: url });
        if (visionButton.current) visionButton.current.focus();

        break;
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    if (validateFile(event.target.files)) {
      const file = event.target.files?.[0];

      const url = URL.createObjectURL(file);
      dispatch({ type: "UPDATE_FILE", file: file, previewUrl: url });
    } else {
      dispatch({ type: "UPDATE_FILE", file: null, previewUrl: null });
      event.target.value = "";
    }
  };

  const validateFile = (file: FileList): boolean => {
    if (file.length > 1) {
      toast.error("Please select only one file", { richColors: true });
      return false;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file[0].type)) {
      toast.error("Please select a valid image file", { richColors: true });
      return false;
    }

    return true;
  };

  return (
    <Dialog onOpenChange={() => handleClose(previewUrl, dispatch)}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground my-2 rounded-sm p-4">
          <ScanEye />
          Import Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="flex min-h-[300px] w-full max-w-md flex-col items-center gap-4 transition-all duration-300 ease-in-out">
        <DialogDescription className="text-xs">
          {" "}
          Select a screenshot of the game stats to import the match data
        </DialogDescription>
        <DialogTitle className="text-2xl">
          Import Stats From Screenshot
        </DialogTitle>
        <h2 className="mb-4 text-base">Upload Screenshot for Game Stats</h2>
        <div
          className="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed"
          tabIndex={0}
          role="button"
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Pasted preview"
              width={300}
              height={200}
              className="object-contain"
            />
          ) : (
            <p>Paste an image (Ctrl+V/⌘+V)</p>
          )}
        </div>
        <p className="font-semibold underline underline-offset-2"> OR </p>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hover:bg-primary-foreground hover:cursor-pointer"
          tabIndex={1}
        />
        <Button
          ref={visionButton}
          className="w-full max-w-[200px] sm:w-auto"
          disabled={!selectedFile || sessionPlayers.length === 0}
          onClick={() =>
            handleAnalyzeBtnClick(
              state,
              dispatch,
              handleCreateMatchFromVision,
              sessionPlayers,
              gameName,
            )
          }
          type="button"
        >
          Extract Stats from Image
        </Button>
        {isLoading && (
          <div className="flex justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
        <span className="my-2 flex flex-col items-center">
          {visionStatus !== null && (
            <>
              <p className="text-lg">Vision Results:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {visionStatus === VisionResultCodes.Success ? (
                      <CircleCheck size={40} className="text-green-500" />
                    ) : visionStatus === VisionResultCodes.CheckRequest ? (
                      <CircleAlert size={40} className="text-yellow-500" />
                    ) : (
                      <CircleX size={40} className="text-red-500" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary-foreground text-primary max-w-72">
                    <p className="text-sm">
                      <strong>
                        {visionStatus === VisionResultCodes.Success
                          ? "Stats have been imported to a new match successfully. Make sure to double check still!"
                          : visionStatus === VisionResultCodes.CheckRequest
                            ? "Stats have been imported to a new match but the model had some trouble recognizing some fields. Please check to make sure it got it correct."
                            : "Stat import has failed due to an error please check the screenshot and try again."}
                      </strong>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
          {visionMsg && <p className="text-muted-foreground">{visionMsg}</p>}
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default RDCVisionModal;

export type State = typeof initialState;

export type Action =
  | { type: "UPDATE_FILE"; file: File | null; previewUrl: string | null }
  | {
      type: "UPDATE_VISION";
      visionStatus: VisionResultCodes | null;
      visionMsg: string;
      loading?: boolean;
    }
  | { type: "UPDATE_LOADING"; loading: boolean }
  | { type: "RESET" };
