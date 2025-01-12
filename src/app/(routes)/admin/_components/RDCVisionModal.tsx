import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { analyzeScreenshot } from "@/app/actions/visionAction";

const RDCVisionModal = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result;
        if (fileContent) {
          const base64FileContent = Buffer.from(
            fileContent as ArrayBuffer,
          ).toString("base64");

          console.log("Base64 File Content: ", base64FileContent);
          await analyzeScreenshot(base64FileContent);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  console.log("Selected File: ", selectedFile);

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button">Import Vision</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Import Vision</DialogTitle>
        <h2 className="mb-4 text-xl">Upload Screenshot for Game Stats</h2>
        <Input
          type="file"
          onChange={handleFileChange}
          className="hover:cursor-pointer hover:bg-primary-foreground"
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        <Button onClick={handleAnalyzeBtnClick}>
          {" "}
          Extract Stats from Image
        </Button>
        <div>Results:</div>
      </DialogContent>
    </Dialog>
  );
};

export default RDCVisionModal;
