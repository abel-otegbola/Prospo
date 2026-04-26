'use client';
import { useEffect, useState } from "react";
import Slider from "../slider/slider";

const slides = [
  {
    title: "Generate & Capture Leads Effortlessly",
    text: "Build your client pipeline with smart lead generation tools designed for freelancers who want to grow their business.",
    img: "/slide-1.jpg",
  },
  {
    title: "Manage All Your Customers in One Place",
    text: "Keep client details, project history, and communication organized so you can focus on delivering great work.",
    img: "/slide-2.png",
  },
  {
    title: "Track Progress & Close More Deals",
    text: "Monitor your leads from first contact to conversion with simple, visual dashboards built for solo entrepreneurs.",
    img: "/slide-3.png",
  },
];

function AuthOverlay() {
  const [activeSlider, setActiveSlider] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlider((prev) => (prev === slides.length -1 ? 0 : prev + 1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeSlider]);

  return (
    <div className="h-[94%] my-auto rounded-[20px] sticky top-0 right-6 bg-[url('/auth-bg-3.webp')] bg-cover bg-top 2xl:w-[45.625%] xl:w-[45%] md:w-[45%] md:block hidden relative">

      {/* Content Overlay */}
      <div className="relative flex flex-col h-full justify-end gap-6 w-full bg-gray/[0.09] p-[8%]">

        <div className="bg-gradient-to-b p-[5%] bg-white/[0.1] backdrop-blur-sm rounded-lg text-white">
          <div className="relative h-[120px] min-[1920px]:h-[140px] overflow-hidden">
            <div
              className="flex relative h-full text-center"
            >
              <Slider slides={slides} activeSlider={activeSlider} />
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3">
            {slides.map((_, i) => (
              <button onClick={() => setActiveSlider(i)}
                key={i}
                className={`cursor-pointer duration-500 rounded-lg ${activeSlider === i ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-gray"}`}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthOverlay;
