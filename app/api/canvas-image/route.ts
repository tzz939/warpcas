import { NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

// In-memory storage for the canvas state (in a production app, you'd use a database)
let canvasState: ImageData | null = null;

export async function GET() {
  // Create a canvas with the same dimensions as our client-side canvas
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');

  // If we have a saved state, draw it
  if (canvasState) {
    ctx.putImageData(canvasState, 0, 0);
  } else {
    // Default white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 400);
  }

  // Convert canvas to buffer
  const buffer = canvas.toBuffer('image/png');

  // Return the image
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (data.action === 'clear') {
    canvasState = null;
    return NextResponse.json({ success: true });
  }
  
  if (data.action === 'save' && data.imageData) {
    canvasState = data.imageData;
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
} 