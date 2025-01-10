import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
}

const RDCVisionModal = (props: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { isOpen } = props;

  /**
   *  have a button that opens this component should be placed in Match Manager
   * this component should be a modal that opens when the button is clicked
   * should have an input
   */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  console.log("Selected File: ", selectedFile);

  const validateVisionResults = () => {
    console.log("");
  };

  if (!isOpen) return null;

  const onClose = () => {};

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Card className="relative rounded-lg p-6 shadow-lg">
          <button className="absolute right-2 top-2" onClick={onClose}>
            X
          </button>
          <h2 className="mb-4 text-xl">Upload Screenshot for Game</h2>
          <input type="file" onChange={handleFileChange} />
          {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        </Card>
      </div>
    </>,
    document.body,
  );
};

export default RDCVisionModal;
