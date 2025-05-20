import { NextResponse } from 'next/server';

interface KeywordsRequest {
  keywords: string[];
}

interface BackendResponse {
  code: number;
  ret: string;
  error_msg: string;
}

/**
 * API endpoint to process keywords for meme generation
 * 
 * @param request The incoming request with keywords data
 * @returns JSON response with processing results
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const oldBody: KeywordsRequest = await request.json();
    const body = {
      ...oldBody,
      user_id: process.env.DEFAULT_UID
    }
    
    // Validate the request body
    if (!body.user_id || !Array.isArray(body.keywords) || body.keywords.length === 0) {
      return NextResponse.json(
        { code: 400, ret: "", error_msg: 'Invalid request body. Required: user_id and non-empty keywords array' },
        { status: 400 }
      );
    }

    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { code: 500, ret: "", error_msg: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log(`Forwarding keywords request to backend: ${backendUrl}`);
    console.log(`Request data:`, JSON.stringify(body));
    
    // Forward the request to the actual backend
    const backendResponse = await fetch(`${backendUrl}/process_keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Parse the backend response
    const responseData: BackendResponse = await backendResponse.json();
    
    // Log the response for debugging
    console.log('Backend response:', responseData);
    
    // Check if the backend request was successful
    if (!backendResponse.ok) {
      console.error('Backend request failed:', responseData.error_msg);
      
      // Forward the error from the backend
      return NextResponse.json(
        responseData,
        { status: backendResponse.status }
      );
    }
    
    // Return the backend response directly to maintain schema consistency
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error processing keywords:', error);
    
    // Return an error response following the required schema
    return NextResponse.json(
      { code: 500, ret: "", error_msg: `Internal server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/**
 * GET method handler (optional)
 * 
 * Returns a 405 Method Not Allowed response for any GET requests
 */
export async function GET() {
  return NextResponse.json(
    { code: 405, ret: "", error_msg: 'Method not allowed. Use POST to process keywords.' },
    { status: 405 }
  );
} 