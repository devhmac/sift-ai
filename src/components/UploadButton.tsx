"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(n) => {
        if (!n) {
          setIsOpen(n);
        }
      }}
    >
      {/* asChild to not wrap our button component in another button */}
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button> Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>Test example</DialogContent>
    </Dialog>
  );
};
export default UploadButton;
