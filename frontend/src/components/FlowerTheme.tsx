import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

export function FlowerTheme() {
  const { settings } = useSettings();
  const [showFlowers, setShowFlowers] = useState(false);

  useEffect(() => {
    setShowFlowers(settings.colorScheme === 'blush');
  }, [settings.colorScheme]);

  if (!showFlowers) return null;

  return (
    <>
      {/* Floating Flower Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Left Petal */}
        <div className="absolute top-20 left-10 flower-float" style={{ animationDelay: '0s' }}>
          <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-60 transform rotate-45"></div>
        </div>
        
        {/* Top Right Petal */}
        <div className="absolute top-32 right-16 flower-float" style={{ animationDelay: '2s' }}>
          <div className="w-6 h-6 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-50 transform -rotate-12"></div>
        </div>
        
        {/* Middle Left Petal */}
        <div className="absolute top-1/2 left-8 flower-float" style={{ animationDelay: '4s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-70 transform rotate-30"></div>
        </div>
        
        {/* Middle Right Petal */}
        <div className="absolute top-1/3 right-20 flower-float" style={{ animationDelay: '1s' }}>
          <div className="w-7 h-7 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-60 transform -rotate-45"></div>
        </div>
        
        {/* Bottom Left Petal */}
        <div className="absolute bottom-32 left-16 flower-float" style={{ animationDelay: '3s' }}>
          <div className="w-9 h-9 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-50 transform rotate-15"></div>
        </div>
        
        {/* Bottom Right Petal */}
        <div className="absolute bottom-20 right-12 flower-float" style={{ animationDelay: '5s' }}>
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-70 transform -rotate-30"></div>
        </div>
      </div>

      {/* Flower Corner Decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-10">
        <div className="relative w-full h-full">
          {/* Flower 1 */}
          <div className="absolute top-4 left-4 flower-glow">
            <div className="relative">
              {/* Petals */}
              <div className="absolute w-6 h-6 bg-pink-300 rounded-full top-0 left-3 petal-sway"></div>
              <div className="absolute w-6 h-6 bg-pink-300 rounded-full top-3 left-0 petal-sway" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-6 h-6 bg-pink-300 rounded-full top-3 right-0 petal-sway" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-6 h-6 bg-pink-300 rounded-full bottom-0 left-3 petal-sway" style={{ animationDelay: '1.5s' }}></div>
              {/* Center */}
              <div className="absolute w-4 h-4 bg-yellow-300 rounded-full top-4 left-4"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none z-10">
        <div className="relative w-full h-full">
          {/* Flower 2 */}
          <div className="absolute top-4 right-4 flower-glow" style={{ animationDelay: '1s' }}>
            <div className="relative">
              {/* Petals */}
              <div className="absolute w-5 h-5 bg-rose-300 rounded-full top-0 left-2.5 petal-sway"></div>
              <div className="absolute w-5 h-5 bg-rose-300 rounded-full top-2.5 left-0 petal-sway" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-5 h-5 bg-rose-300 rounded-full top-2.5 right-0 petal-sway" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-5 h-5 bg-rose-300 rounded-full bottom-0 left-2.5 petal-sway" style={{ animationDelay: '1.5s' }}></div>
              {/* Center */}
              <div className="absolute w-3 h-3 bg-yellow-200 rounded-full top-3 left-2.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Flower Border Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-30"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-200 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent opacity-30"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-rose-200 to-transparent opacity-30"></div>
      </div>

      {/* Floating Cherry Blossoms */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300 opacity-40 flower-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Flower Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, hsl(340, 60%, 70%) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, hsl(320, 65%, 75%) 1px, transparent 1px),
            radial-gradient(circle at 40% 60%, hsl(360, 60%, 70%) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 200px 200px'
        }}></div>
      </div>
    </>
  );
} 