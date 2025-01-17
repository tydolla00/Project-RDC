import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { analyzeScreenShot } from "@/app/actions/visionAction";
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

interface Props {
  handleCreateMatchFromVision: (visionResults: any) => void;
  sessionPlayers: Player[];
}

const RDCVisionModal = (props: Props) => {
  const { handleCreateMatchFromVision, sessionPlayers } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visionStatus, setVisionStatus] = useState<
    "Success" | "CheckReq" | "Failed" | null
  >(null);
  const [visionMsg, setVisionMsg] = useState<string>("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (!event.target.files) {
      return;
    }
    if (validateFile(event.target.files)) {
      setSelectedFile(event.target.files?.[0]);
    } else {
      setSelectedFile(null);
      event.target.value = "";
    }
  };

  const validateFile = (file: FileList): boolean => {
    if (file.length > 1) {
      alert("Please select only one file");
      return false;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file[0].type)) {
      alert("Please select a valid image file");
      return false;
    }

    return true;
  };

  const handleClose = () => {
    setSelectedFile(null);
    setVisionStatus(null);
  };

  const handleAnalyzeBtnClick = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (!selectedFile) return;

      const reader = new FileReader();

      const readFile = () =>
        new Promise((resolve, reject) => {
          reader.onload = async (e) => resolve(e.target?.result);
          reader.onerror = (error) => reject(error);
          reader.readAsArrayBuffer(selectedFile);
        });

      const fileContent = await readFile();
      if (!fileContent) {
        console.error("Error reading file content");
        setIsLoading(false);
      }

      const base64FileContent = Buffer.from(
        fileContent as ArrayBuffer,
      ).toString("base64");

      const visionResult = await analyzeScreenShot(base64FileContent);

      if (visionResult.status === "Success") {
        handleCreateMatchFromVision(visionResult.data);
        setVisionStatus("Success");
        setIsLoading(false);
      } else if (visionResult.status === "CheckReq") {
        handleCreateMatchFromVision(visionResult.data);
        setVisionStatus("CheckReq");
        setVisionMsg(visionResult.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in handleAnalyzeBtnClick: ", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="my-2 rounded-sm bg-primary p-4 text-primary-foreground">
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
        <Input
          type="file"
          onChange={handleFileChange}
          className="hover:cursor-pointer hover:bg-primary-foreground"
        />
        {/** TODO: tooltip for no players */}
        <Button
          className="w-full max-w-[200px] sm:w-auto"
          disabled={!selectedFile || sessionPlayers.length === 0}
          onClick={handleAnalyzeBtnClick}
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
          {visionStatus !== null && <p className="text-lg">Vision Results:</p>}
          {visionStatus === "Success" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CircleCheck size={40} className="my-1 text-green-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-72 bg-primary-foreground text-primary">
                  <p className="text-sm">
                    <strong>
                      Stats have been imported to a new match successfully. Make
                      sure to double check still!
                    </strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {visionStatus === "CheckReq" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CircleAlert size={40} className="my-1 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-72 bg-primary-foreground text-primary">
                  <p className="text-sm">
                    <strong>
                      Stats have been imported to a new match but the model had
                      some trouble recognizing some fields. Please check to make
                      sure it got it correct.
                    </strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {visionStatus === "Failed" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CircleX size={40} className="my-1 text-red-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-72 bg-primary-foreground text-primary">
                  <p className="text-sm">
                    <strong>
                      Stat import has failed due to an error please check the
                      screenshot and try again.
                    </strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {visionMsg && <p className="text-muted-foreground">{visionMsg}</p>}
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default RDCVisionModal;
