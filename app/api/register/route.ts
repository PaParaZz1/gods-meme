import { NextResponse } from 'next/server';

// This function handles POST requests to register a new user
export async function POST(request: Request) {
  try {
    // Parse the request body to get the UID
    const body = await request.json();
    const { uid } = body;
    
    // Validate UID parameter
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID is required' },
        { status: 400 }
      );
    }
    
    const backendUrl = process.env.BACKEND_URL;
    
    // Validate backend URL
    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Backend service configuration error' },
        { status: 500 }
      );
    }
    
    // Log the registration attempt
    console.log(`Registering user with UID: ${uid}`);

    try {
      // Call the backend register API
      const response = await fetch(`${backendUrl}/register`, {
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
      
      console.log('Backend register response status:', response.status);
      console.log('Backend register response body:', result);
      
      if (!response.ok) {
        console.error('Backend register request failed:', result?.error_msg);
        return NextResponse.json(
          { success: false, error: result?.error_msg || 'Registration failed' },
          { status: response.status }
        );
      } else {
        // Registration successful
        return NextResponse.json({ 
          success: true, 
          message: 'User registered successfully',
          uid: uid
        });
      }
    } catch (error) {
      console.error('Error calling backend register API:', error);
      return NextResponse.json(
        { success: false, error: `Registration API error: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing registration request:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to process registration request' },
      { status: 500 }
    );
  }
} 