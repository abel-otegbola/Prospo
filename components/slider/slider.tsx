
function Slider({slides, activeSlider}: {slides: {title: string, text: string}[], activeSlider: number}) {
  return (
    <div>
        {slides.map((slide, idx) => (
        <div
            key={idx}
            className="absolute left-0 right-0 flex-shrink-0 w-full flex flex-col gap-2 transition duration-[1000ms] ease-in-out"
            style={{ 
            width: "100%", 
            transform: activeSlider === idx ? "translateX(0%)" : activeSlider === 2 && idx === 0 ? "translateX(110%)" : activeSlider === 0 && idx === slides.length -1 ? "translateX(-110%)" : activeSlider > idx ? "translateX(-110%)" : `translateX(110%)`,
            opacity: activeSlider === idx ? 1 : 0,
            }}
        >
            <h2 className={`xl:text-[24px] leading-[44px] tracking-[-1%] text-[16px] font-semibold ${activeSlider === idx ? 'animate-blur-reveal' : ''}`}>
              {slide.title}
            </h2>
            <p className={`tracking-[-7%] ${activeSlider === idx ? 'animate-blur-reveal-delay' : ''}`}>
              {slide.text}
            </p>
        </div>
        ))}
    </div>
  )
}

export default Slider
