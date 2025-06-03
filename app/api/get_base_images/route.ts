import { NextResponse } from 'next/server';

// This function handles POST requests to fetch template images
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const uid = body.user_id;
    
    // Validate UID parameter
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID parameter is required' },
        { status: 400 }
      );
    }
    
    const backendUrl = process.env.BACKEND_URL;
    
    // Log the request for debugging
    console.log(`Fetching template images for user: ${uid}`);

    try {
      // Call the backend get_base_images API
      const response = await fetch(`${backendUrl}/get_base_images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid
        }),
      });
      
      // Parse the backend response
      const result = await response.json();
      
      console.log('Backend get_base_images response status:', response.status);
      console.log('Backend get_base_images response body:', result);
      
      if (!response.ok) {
        console.error('Backend get_base_images request failed:', result?.error_msg);
        return NextResponse.json(
          { success: false, error: result?.error_msg || 'Failed to fetch templates' },
          { status: response.status }
        );
      } else {
        const templateImages = result.ret;
        return NextResponse.json({ 
          success: true, 
          images: templateImages 
        });
      }
    } catch (error) {
      console.error('Error calling backend get_base_images API:', error);
      return NextResponse.json(
        { success: false, error: `Template API error: ${(error as Error).message}` },
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