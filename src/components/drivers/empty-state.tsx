import { Player } from "@lottiefiles/react-lottie-player";
import React, { FC } from "react";
type LoadingProps = {
  title?: string;
  description?: string;
};
export const Empty: FC<LoadingProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col  w-[100%] h-[360px] justify-center items-center">
      <Player
        autoplay
        loop
        src="https://lottie.host/62e82b79-0af8-4cd2-84e5-f82410d09c03/J0zYeqZrnY.json"
        style={{ height: "300px", width: "242" }}
      ></Player>
      <p className="text-base font-bold text-primary my-3">{title}</p>
      {description && <p className="text-xs">{description}</p> }
    </div>
  );
};