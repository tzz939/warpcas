'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixelSize, setPixelSize] = useState(10); // Smaller default pixel size for frame
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawPixel = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Snap to grid
    const pixelX = Math.floor(x / pixelSize) * pixelSize;
    const pixelY = Math.floor(y / pixelSize) * pixelSize;

    ctx.fillStyle = color;
    ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPixel(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <>
      <Head>
        {/* Frame Metadata */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://your-domain.com/api/canvas-image" />
        <meta property="fc:frame:button:1" content="Draw" />
        <meta property="fc:frame:button:2" content="Clear" />
        <meta property="fc:frame:button:3" content="Save" />
        <meta property="og:image" content="https://your-domain.com/api/canvas-image" />
      </Head>
      
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">PixelWarp Canvas</h1>
        
        <div className="mb-4 flex gap-4 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8"
          />
          <input
            type="range"
            min="5"
            max="20"
            value={pixelSize}
            onChange={(e) => setPixelSize(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm">Size: {pixelSize}px</span>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="border border-gray-300 cursor-crosshair"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </>
  );
}
