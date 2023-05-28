import { Player } from "@lottiefiles/react-lottie-player";
import React, { FC } from "react";
type LoadingProps = {
  title?: string;
};
export const Loading: FC<LoadingProps> = ({ title }) => {
  return (
    <div className="flex flex-col  w-[100%] h-[100%] justify-center items-center">
      <Player
        autoplay
        loop
        src="https://assets7.lottiefiles.com/private_files/lf30_uw1ao4fr.json"
        style={{ height: "300px", width: "242" }}
      ></Player>
      <p className="text-base font-bold text-primary my-3">{title}</p>
    </div>
  );
};
