import { HeroForm } from "@/components/HeroForm";
import { ManageBookingForm } from "@/components/ManageBookingForm";
import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { Input } from "@/components/common/Input";
import { FEATURELIST } from "@/constants";

export default function Home() {
  return (
    // className=" min-h-screen flex-col items-center  bg-white max-w-screen"
    <main className=" min-h-screen flex-col items-center  bg-white max-w-screen">
      <div className="flex pt-12 md:pt-0 relative flex-col md:min-h-[538px] min-h-screen items-center justify-center bg-hero-image bg-cover bg-center bg-opacity-60 bg-gray-800 pb-5">
        <div className="bg-black bg-opacity-40 absolute left-0 right-0 top-0 bottom-0 "></div>
        <div className="flex flex-col max-w-[900px] items-center justify-center relative z-10 md:px-0 px-5">
          <div className="overflow-hidden">
            <p className="md:text-5xl text-3xl text-white font-bold text-center mt-8 md:mt-0 animate-slide-up">
              Experience safe, convenient and luxurious Travel{" "}
            </p>
          </div>
          <div className="overflow-hidden md:my-10 my-2">
            <p className="text-base text-slate-100 mx-auto  text-center md:w-full w-[80%] animate-slide-down">
              Select your destination and get ready for the best road experience
            </p>
          </div>
          <HeroForm />
        </div>
      </div>

      <div
        className="flex flex-col bg-white py-6 justify-center items-center min-h-[342px]"
        id="bookings"
      >
        <p className="text-2xl font-bold text-primary my-2 mb-9">
          Manage Your Booking
        </p>
        <p className="text-base text-slate-600 m-w[60%] text-center px-3">
          Already have a booking, enter you booking reference to update your
          booking
        </p>

        <ManageBookingForm />
      </div>
      <div className="flex flex-col bg-white py-6 justify-center items-center min-h-[500px] ">
        <p className="text-2xl font-bold text-primary mt-2 mb-8">
          Manage Your Booking
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          {FEATURELIST.map(({ title, icon, description }, key) => (
            <div
              key={`feature-list-${key}`}
              className="flex flex-col justify-center items-center px-9 group"
            >
              <div className="flex-col justify-center items-center px-2 py-2 rounded-lg group-hover:bg-primary-light">
                {icon}
              </div>
              <p className="text-lg text-primary font-bold my-3">{title}</p>
              <p className="text-sm text-slate-600 text-center">
                {" "}
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
