import { useEffect, useState } from "react";
import { ArrowRight, Table2 } from "lucide-react";
import { useNavigate } from "react-router";

function DynamicGrid() {
  const COLS = 20;
  const ROWS = 15;
  const NUM_GLOW = 6;
  const FADE_DURATION = 3000;

  const [cellSize, setCellSize] = useState({ width: 120, height: 40 });
  const [glowCells, setGlowCells] = useState([]);

  // Calculate cell size based on viewport height, maintain 3:1 ratio
  useEffect(() => {
    const updateCellSize = () => {
      const height = window.innerHeight;
      const h = height / ROWS;
      const w = h * 3; // 3:1 width:height
      setCellSize({ width: w, height: h });
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  const totalCells = COLS * ROWS;

  // Update glowing cells every FADE_DURATION
  useEffect(() => {
    const interval = setInterval(() => {
      const newGlow = new Set();
      while (newGlow.size < NUM_GLOW) {
        newGlow.add(Math.floor(Math.random() * totalCells));
      }
      setGlowCells([...newGlow]);
    }, FADE_DURATION);

    return () => clearInterval(interval);
  }, [totalCells]);

  return (
    <div className="absolute inset-0">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${cellSize.width}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize.height}px)`,
        }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          const isGlowing = glowCells.includes(i);

          return (
            <div
              key={i}
              className={`border border-gray-300/30 relative transition-all duration-1000 ${
                isGlowing
                  ? "bg-gray-200/10"
                  : "bg-transparent"
              }`}
              style={{
                opacity: isGlowing ? 0.3 : 0.1,
              }}
            >
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">

      <DynamicGrid />

      <div className="text-center px-6 max-w-4xl mx-auto relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          <Table2 className="w-12 h-12 text-white mr-4" />
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Tabular
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-300">
          Minimalistic Spreadsheet. Some Catchy Landing Page Subtitle.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-500">
          <button
            onClick={() => navigate("/demo")}
            className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/15 flex items-center"
          >
            Check it out
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="group bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Dashboard
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-12 animate-slide-up delay-700">
          <span className="bg-gray-800/50 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-700">
            Virtualized Sheet Rendering
          </span>
          <span className="bg-gray-800/50 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-700">
            Formula Evaluation
          </span>
          <span className="bg-gray-800/50 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-700">
            Database Persistance
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
