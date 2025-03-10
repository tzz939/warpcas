import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const host = process.env.NEXT_PUBLIC_HOST || 'https://pixelwarps.vercel.app';

export async function GET(req: NextRequest) {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pixel Canvas</title>
        <meta property="og:title" content="Pixel Canvas" />
        <meta property="og:description" content="Draw pixels in Warpcast" />
        <meta property="og:image" content="${host}/api/canvas-image" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${host}/api/canvas-image" />
        <meta property="fc:frame:button:1" content="Draw" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="${host}/api/frame" />
        <meta property="fc:frame:post_url" content="${host}/api/frame" />
        <meta property="fc:frame:state" content="initial" />
        <meta property="fc:frame:input:text" content="Enter coordinates (x,y)" />
        <meta name="fc:frame:embed" content="true" />
      </head>
      <body>
        <h1>Pixel Canvas</h1>
        <p>Draw pixels in Warpcast</p>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    },
  );
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log('Frame POST data:', data);
  
  const state = data.state || 'initial';
  const input = data.input || '';
  
  switch (state) {
    case 'initial':
      return NextResponse.json({
        success: true,
        state: 'drawing',
        message: 'Drawing mode activated! Enter coordinates (x,y)'
      });
    case 'drawing':
      const [x, y] = input.split(',').map(Number);
      if (isNaN(x) || isNaN(y)) {
        return NextResponse.json({
          success: true,
          state: 'drawing',
          message: 'Invalid coordinates. Please enter in format: x,y'
        });
      }
      return NextResponse.json({
        success: true,
        state: 'initial',
        message: `Pixel drawn at (${x},${y})!`
      });
    default:
      return NextResponse.json({
        success: true,
        state: 'initial',
        message: 'Welcome to Pixel Canvas!'
      });
  }
}