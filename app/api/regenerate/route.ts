import { NextResponse } from 'next/server';

// This function handles POST requests to regenerate meme
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { user_id, detail_modify, element } = body;
    
    // Validate required parameters
    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!detail_modify) {
      return NextResponse.json(
        { success: false, error: 'Detail modify is required' },
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
    
    // Log the request for debugging
    console.log(`Regenerating for user: ${user_id}, detail_modify: ${detail_modify}, element: ${element}`);

    try {
      // Step 1: Call the backend regenerate API
      const response = await fetch(`${backendUrl}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          detail_modify: detail_modify,
          element: element || ""
        }),
      });
      
      console.log('Backend regenerate response status:', response.status);
      console.log('Backend regenerate response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, get the text response for debugging
        const textResponse = await response.text();
        console.error('Backend regenerate returned non-JSON response:', textResponse);
        return NextResponse.json(
          { success: false, error: `Backend returned invalid response format. Status: ${response.status}. Response: ${textResponse.substring(0, 200)}...` },
          { status: 502 }
        );
      }
      
      console.log('Backend regenerate response body:', result);
      
      if (!response.ok) {
        console.error('Backend regenerate request failed:', result?.error_msg);
        return NextResponse.json(
          { success: false, error: result?.error_msg || 'Regeneration failed' },
          { status: response.status }
        );
      }
      
      // Step 2: Poll for the regenerated result
      console.log('Step 2: Polling for regenerated result...');
      
      const maxWaitTime = 60000; // 60 seconds maximum wait time
      const pollInterval = 4000; // Poll every 4 seconds
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        const resultResponse = await fetch(`${backendUrl}/get_result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id
          }),
        });
        
        console.log('Backend get_result response status:', resultResponse.status);
        
        // Check if the response is JSON
        const resultContentType = resultResponse.headers.get('content-type');
        let resultData;
        
        if (resultContentType && resultContentType.includes('application/json')) {
          resultData = await resultResponse.json();
        } else {
          // If not JSON, get the text response for debugging
          const textResponse = await resultResponse.text();
          console.error('Backend get_result returned non-JSON response:', textResponse);
          return NextResponse.json(
            { success: false, error: `Backend returned invalid response format. Status: ${resultResponse.status}. Response: ${textResponse.substring(0, 200)}...` },
            { status: 502 }
          );
        }
        
        console.log('Backend get_result response body:', resultData);
        
        if (!resultResponse.ok) {
          console.error('Backend get_result request failed:', resultData?.error_msg);
          return NextResponse.json(
            { success: false, error: resultData?.error_msg || 'Failed to get regenerated result' },
            { status: resultResponse.status }
          );
        }
        
        // Check if generation is complete (code == 0)
        if (resultData.code === 0) {
          console.log('Regeneration completed successfully');
          return NextResponse.json({ 
            success: true, 
            generated_image: resultData.ret.image
          });
        } else if (resultData.code === 1) {
          // error
          console.error('Regeneration failed:', resultData.error_msg);
          return NextResponse.json(
            { success: false, error: resultData.error_msg || 'Regeneration failed' },
            { status: 500 }
          );
        }
        
        // If not ready yet, wait before next poll
        console.log(`Regeneration not ready yet (code: ${resultData.code}), waiting ${pollInterval}ms before next poll...`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      // If we reach here, we've timed out
      console.error('Regeneration polling timed out after', maxWaitTime, 'ms');
      return NextResponse.json(
        { success: false, error: 'Regeneration timed out. Please try again.' },
        { status: 408 }
      );
      
    } catch (error) {
      console.error('Error calling backend regenerate API:', error);
      
      // Check if it's a JSON parsing error
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json(
          { success: false, error: 'Backend returned invalid JSON response. Please check backend service.' },
          { status: 502 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: `Backend API error: ${(error as Error).message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing regenerate request:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to process regenerate request' },
      { status: 500 }
    );
  }
} 