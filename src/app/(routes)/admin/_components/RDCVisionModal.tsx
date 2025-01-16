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
import { CircleAlert, CircleCheck, CircleX, ScanEye } from "lucide-react";

interface Props {
  handleCreateMatchFromVision: (visionResults: any) => void;
}

const RDCVisionModal = (props: Props) => {
  const { handleCreateMatchFromVision } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visionStatus, setVisionStatus] = useState<
    "Success" | "CheckReq" | "Failed" | null
  >(null);

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
        <Button className="rounded-sm bg-primary p-4 text-primary-foreground">
          <ScanEye />
          Import Vision
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          {" "}
          Select a screenshot of the game stats to import the match data
        </DialogDescription>
        <DialogTitle>Import Vision</DialogTitle>
        <h2 className="mb-4 text-xl">Upload Screenshot for Game Stats</h2>
        <Input
          type="file"
          onChange={handleFileChange}
          className="hover:cursor-pointer hover:bg-primary-foreground"
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        <Button
          disabled={!selectedFile}
          onClick={handleAnalyzeBtnClick}
          type="button"
        >
          {" "}
          Extract Stats from Image
        </Button>
        {isLoading && <div className="flex justify-center"> Loading...</div>}
        <span className="flex flex-col items-center">
          {visionStatus !== null && <p className="text-lg">Vision Results:</p>}
          {visionStatus === "Success" && (
            <CircleCheck size={40} className="text-green-500" />
          )}
          {visionStatus === "CheckReq" && (
            <CircleAlert size={40} className="text-yellow-500" />
          )}
          {visionStatus === "Failed" && (
            <CircleX size={40} className="text-red-500" />
          )}
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default RDCVisionModal;
