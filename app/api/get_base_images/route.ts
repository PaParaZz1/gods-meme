import { NextResponse } from 'next/server';

// This function handles GET requests to fetch template images
export async function GET(request: Request) {
  try {
    const uid = process.env.DEFAULT_UID;
    const backendUrl = process.env.BACKEND_URL;
    
    // Log the request for debugging
    console.log(`Fetching template images for user: ${uid || 'anonymous'}`);

    try {
      // Call the tags API on the backend
      const response = await fetch(`${backendUrl}/get_base_images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid
        }),
      });
      
      // Parse the tags response
      const result = await response.json();
      
      console.log('Backend tags response status:', response.status);
      console.log('Backend tags response body:', result);
      
      if (!response.ok) {
        console.error('Backend tags request failed:', result!.error_msg);
        return NextResponse.json(result, { status: response.status });
      } else {
        const templateImages = result.ret
        return NextResponse.json({ 
          success: true, 
          images: templateImages 
        });
      }
    } catch (error) {
      console.error('Error processing tags:', error);
      return NextResponse.json(
        { code: 500, ret: "", error_msg: `Tags API error: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching template images:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template images' },
      { status: 500 }
    );
  }
} 