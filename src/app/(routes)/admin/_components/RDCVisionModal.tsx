import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { analyzeScreenShotTest } from "@/app/actions/visionAction";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props {
  handleCreateMatchFromVision: (visionResults: any) => void;
}

const RDCVisionModal = (props: Props) => {
  const { handleCreateMatchFromVision } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: Remove file on close

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

  const handleAnalyzeBtnClick = (): void => {
    console.log("Analyze Button Clicked");
    setIsLoading(true);
    if (selectedFile) {
      console.log("Selected File: ", selectedFile);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result;
        if (fileContent) {
          console.log("File Content: ", fileContent);
          const base64FileContent = Buffer.from(
            fileContent as ArrayBuffer,
          ).toString("base64");

          console.log("Base64 File Content: ", base64FileContent);
          const visionResults = await analyzeScreenShotTest(base64FileContent);
          console.log("Vision Results in Modal: ", visionResults);
          handleCreateMatchFromVision(visionResults);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-sm bg-primary p-4 text-primary-foreground">
          Import Vision
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          {" "}
          Modal to import RDC stats to be parsed into form :)
        </DialogDescription>
        <DialogTitle>Import Vision</DialogTitle>
        <h2 className="mb-4 text-xl">Upload Screenshot for Game Stats</h2>
        <Input
          type="file"
          onChange={handleFileChange}
          className="hover:cursor-pointer hover:bg-primary-foreground"
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        <Button onClick={handleAnalyzeBtnClick} type="button">
          {" "}
          Extract Stats from Image
        </Button>
        {isLoading && <div>Loading...</div>}
        <div>Results:</div>
      </DialogContent>
    </Dialog>
  );
};

export default RDCVisionModal;
