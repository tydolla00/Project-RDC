"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useViewTransition from "@/hooks/useViewTransition";
import Image from "next/image";
import { useState } from "react";

export const Members3D = () => {
  const members = [
    "https://static.wikia.nocookie.net/rdcworld1/images/f/f2/Mark-Phillips.jpg/revision/latest/thumbnail/width/360/height/450?cb=20191004005953",
    "https://static.wikia.nocookie.net/rdcworld1/images/f/f7/DtlKwRJW4AI3qrN_Aff.jpg/revision/latest?cb=20191004012842",
  ];
  const [currentUrl, setCurrentUrl] = useState(members[0]);
  const { startTransition } = useViewTransition();
  return (
    <>
      <Button
        onClick={() => {
          startTransition(
            setCurrentUrl(currentUrl === members[0] ? members[1] : members[0]),
          );
        }}
      >
        Click me
      </Button>
      <div
        className="mx-auto w-fit"
        style={{ perspective: "300px", transformStyle: "preserve-3d" }}
      >
        <Avatar
          onAnimationEnd={() => console.log("Animation Finished")}
          style={{
            transform: "translateZ(50px)",
            viewTransitionName: "rdcmember",
          }}
          className="mt-32 h-64 w-64"
          //   className="animate-sink-down -z-10 h-64 w-64 delay-1000"
        >
          <Image
            className=""
            alt="Test"
            src={currentUrl}
            height={256}
            width={256}
          />
        </Avatar>
      </div>
    </>
  );
};
