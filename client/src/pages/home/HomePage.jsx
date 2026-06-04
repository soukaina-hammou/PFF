import Navbar from "../../components/Navbar";
import { Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-sage min-h-screen">
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-dark/10 to-dark/20" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 py-16 w-full max-w-7xl mx-auto">
          <div className="flex-shrink-0">
            <img
              src="https://assets.codepen.io/7773162/instax-camera.png"
              alt="Instax Camera"
              className="w-64 sm:w-80 lg:w-96 drop-shadow-2xl"
            />
          </div>

          <div className="text-center lg:text-left max-w-lg">
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter text-dark leading-none">
              CAPTURE
            </h1>
            <p className="mt-6 text-dark/60 text-sm sm:text-base max-w-sm mx-auto lg:mx-0 leading-relaxed">
              A STYLISH JOURNEY TOWARD A VERDANT TOMORROW. CRAFTED WITH CARE AND ECO-CONSCIOUS.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="bg-dark/10 backdrop-blur-sm inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-dark">
                "WHO WOULDN'T WANT THESE?" <Heart className="w-4 h-4 text-red-400" />
              </div>
              <div className="bg-dark/10 backdrop-blur-sm inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-dark">
                "THEY LOOK AMAZING!"
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-4 lg:right-20 top-1/2 -translate-y-1/2 text-right space-y-2 hidden lg:block">
          <p className="text-5xl font-bold text-dark/80">MOMENTS</p>
          <p className="text-5xl font-bold text-dark/60">NATURE</p>
          <p className="text-5xl font-bold text-dark/40">EVERYTHING</p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="bg-dark/10 backdrop-blur-sm p-2 rounded-lg inline-block">
            <div className="bg-white/90 p-2 rounded">
              <p className="text-dark text-center text-xs font-bold px-4">TIMELESS & STYLISH PHOTOGRAPHY</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
