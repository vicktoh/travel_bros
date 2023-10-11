import { contactFormSchema } from "@/components/drivers/contact-form";

import { personalInfoFormSchema } from "@/components/drivers/profile-registration-form";
import { vehicleFormSchema } from "@/components/drivers/vehicle-form";
import { licenseFormSchema } from "@/components/drivers/vehicle-registration-modal";
import { db } from "@/firebase";
import { Driver, RegistrationInfo } from "@/types/Driver";
import { collection, doc } from "firebase/firestore";
import { Crop } from "react-image-crop";

export const formatNumber = (number: number, currency?: 'NGN' | 'USD') => {
   if (Number.isNaN(number)) {number=0;}
    
    return number.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        ...(currency ? { currency, style: 'currency' } : null),
    });
}

export const getInitials = (displayName: string) => {
    const firstName = displayName.split(' ')[0]
    const lastName = displayName.split(' ')[1];
    return `${firstName[0]}${lastName ? lastName[0].toUpperCase(): ''}`
 }

 export const getCroppedImg = (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
  
    ctx &&
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1,
      );
    });
  };

  export const isRegistrationComplete = (driver: Partial<Driver>) => {
    const personalInfoStatus = personalInfoFormSchema.safeParse(driver);
    const contactInfoStatus = contactFormSchema.safeParse({contact: driver?.contact, nextOfKinContact: driver?.nextOfKinContact});
  
    const isComplete = (
      personalInfoStatus.success &&
      contactInfoStatus.success
    )
    return  {
      personalInfo: personalInfoStatus.success,
      contactInfo: contactInfoStatus.success,
      isComplete,
    };



  }

  export const newRegistration = () => {
    return doc(collection(db, "registration"))
    
  }