import { useForm } from "react-hook-form";
import { FormValues } from "../../_utils/form-helpers";
import Image from "next/image";
import { motion } from "motion/react";
import { H3 } from "@/components/headings";
import { toast } from "sonner";

export const VideoInfo = ({
  form,
  step,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  step: number;
}) => {
  const thumbnail = form.watch("thumbnail");
  const sessionName = form.watch("sessionName");
  const date = form.watch("date");

  if (!thumbnail) {
    return null;
  }
  return (
    <motion.div initial={{ y: 10 }} animate={{ y: 0 }} className="relative">
      <H3>{sessionName}</H3>
      <div className="text-muted-foreground text-sm">{date.toDateString()}</div>
      <motion.div
        animate={{ y: 216 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0 }}
        className="bg-background absolute h-[216px] w-[384px]"
      />
      <Image
        src={thumbnail}
        height={216} // 16:9 aspect ratio
        width={384}
        alt="RDC Youtube Video Thumbnail"
        onError={(e) => {
          e.currentTarget.src = "/images/leland_rdc.png"; // TODO get default image
          e.currentTarget.alt = "Leland from RDC";
          toast.warning("Image failed to load, here's a picture of leland.", {
            richColors: true,
          });
        }}
      />
    </motion.div>
  );
};
