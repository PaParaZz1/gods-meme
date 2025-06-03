import { NextResponse } from 'next/server';

// This function handles POST requests to get generated meme result
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { user_id, image_url } = body;
    
    // Validate required parameters
    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!image_url) {
      return NextResponse.json(
        { success: false, error: 'Template image is required' },
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
    console.log(`Getting result for user: ${user_id}, template: ${image_url}`);

    try {
      // Step 1: Upload the base image to backend
      console.log('Step 1: Uploading base image...');
      console.log("sending data:", { user_id, image_url });
      
      const uploadResponse = await fetch(`${backendUrl}/post_base_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          image_url: image_url
        })
      });
      
      console.log('Backend post_base_image response status:', uploadResponse.status);
      console.log('Backend post_base_image response headers:', Object.fromEntries(uploadResponse.headers.entries()));
      
      // Check if the response is JSON
      const contentType = uploadResponse.headers.get('content-type');
      let uploadResult;
      
      if (contentType && contentType.includes('application/json')) {
        uploadResult = await uploadResponse.json();
      } else {
        // If not JSON, get the text response for debugging
        const textResponse = await uploadResponse.text();
        console.error('Backend post_base_image returned non-JSON response:', textResponse);
        return NextResponse.json(
          { success: false, error: `Backend returned invalid response format. Status: ${uploadResponse.status}. Response: ${textResponse.substring(0, 200)}...` },
          { status: 502 }
        );
      }
      
      console.log('Backend post_base_image response body:', uploadResult);
      
      if (!uploadResponse.ok) {
        console.error('Backend post_base_image request failed:', uploadResult?.error_msg);
        return NextResponse.json(
          { success: false, error: uploadResult?.error_msg || 'Failed to upload template image' },
          { status: uploadResponse.status }
        );
      }
      
      // Step 2: Poll for the generated result
      console.log('Step 2: Polling for generated result...');
      
      const maxWaitTime = 60000; // 60 seconds maximum wait time
      const pollInterval = 4000; // Poll several seconds
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
            { success: false, error: resultData?.error_msg || 'Failed to get generated result' },
            { status: resultResponse.status }
          );
        }
        
        // Check if generation is complete (code == 0)
        if (resultData.code === 0) {
          console.log('Generation completed successfully');
          return NextResponse.json({ 
            success: true, 
            generated_image: resultData.ret.image
          });
        } else if (resultData.code === 1) {
          // error
          console.error('Generation failed:', resultData.error_msg);
          return NextResponse.json(
            { success: false, error: resultData.error_msg || 'Generation failed' },
            { status: 500 }
          );
        }
        
        // If not ready yet, wait before next poll
        console.log(`Generation not ready yet (code: ${resultData.code}), waiting ${pollInterval}ms before next poll...`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      // If we reach here, we've timed out
      console.error('Polling timed out after', maxWaitTime, 'ms');
      return NextResponse.json(
        { success: false, error: 'Generation timed out. Please try again.' },
        { status: 408 }
      );
      
    } catch (error) {
      console.error('Error calling backend APIs:', error);
      
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
    console.error('Error processing get_result request:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to process get_result request' },
      { status: 500 }
    );
  }
} 