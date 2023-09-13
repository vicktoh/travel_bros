import React, { FC, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { Crop } from "react-image-crop";
import { getCroppedImg } from "@/services/utils";
import { Button } from "../ui/button";

type ImageCropperProps = {
  onCrop: (blob: Blob) => void;
  onClose: () => void;
  src: string;
  aspect?: number;
};

export const ImageCropper: FC<ImageCropperProps> = ({
  onCrop,
  onClose,
  src,
  aspect,
}) => {
  const [crop, setCrop] = useState<Crop & { aspect?: number }>({
    unit: "%",
    width: 30,
    x: 0,
    y: 0,
    height: 30,
    aspect: aspect || 1 / 1,
  });
  const [imageBlob, setImageBlob] = useState<HTMLImageElement>();

  const cropImage = async () => {
    if (!imageBlob) return;
    const croppedImageBlob = await getCroppedImg(imageBlob, crop) as Blob;
    onCrop(croppedImageBlob);
    onClose();
  };
  return (
    <div className="w-[400px]">
      <div className="flex flex-col items-center">
        <ReactCrop aspect={1} onChange={(crop) => setCrop(crop)} crop={crop}>
          <img src={src} onLoad={(e) => setImageBlob(e.currentTarget)} />
        </ReactCrop>
      </div>
      

      <div className="flex row justify-between items-center mt-5">
        <Button
          onClick={() => onClose()}
          variant="outline"
          size="sm"
          type='button'
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="text-white"
          onClick={cropImage}
          type="button"
        >
          Crop
        </Button>
      </div>
    </div>
  );
};
