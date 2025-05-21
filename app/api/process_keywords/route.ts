import { NextResponse } from 'next/server';

interface KeywordsRequest {
  keywords: string[];
  tags?: Record<string, any>;
}

interface BackendResponse {
  code: number;
  ret: string;
  error_msg: string;
}

/**
 * API endpoint to process both keywords and tags for meme generation
 * 
 * @param request The incoming request with keywords and tags data
 * @returns JSON response with processing results
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const requestBody: KeywordsRequest = await request.json();
    
    // Add user_id to the request
    const body = {
      ...requestBody,
      user_id: process.env.DEFAULT_UID
    };
    
    // Log the received data for debugging
    console.log('Received combined request with:', {
      hasKeywords: !!body.keywords && Array.isArray(body.keywords),
      keywordsCount: body.keywords?.length || 0,
      hasTags: !!body.tags,
      tags: body.tags ? JSON.stringify(body.tags) : 'No tags provided',
    });
    
    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set');
      return NextResponse.json(
        { code: 500, ret: "", error_msg: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Results from both API calls
    let keywordsResult: BackendResponse | null = null;
    let tagsResult: BackendResponse | null = null;
    
    // Step 1: Process keywords if provided
    if (body.keywords && Array.isArray(body.keywords) && body.keywords.length > 0) {
      console.log(`Forwarding keywords request to backend: ${backendUrl}/process_keywords`);
      
      const keywordsRequestBody = {
        user_id: body.user_id,
        keywords: body.keywords
      };
      
      console.log(`Keywords request data:`, JSON.stringify(keywordsRequestBody));
      
      try {
        // Call the keywords API on the backend
        const keywordsResponse = await fetch(`${backendUrl}/process_keywords`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(keywordsRequestBody),
        });
        
        // Parse the keywords response
        keywordsResult = await keywordsResponse.json();
        
        console.log('Backend keywords response status:', keywordsResponse.status);
        console.log('Backend keywords response body:', keywordsResult);
        
        // If the keywords request failed, return the error immediately
        if (!keywordsResponse.ok) {
          console.error('Backend keywords request failed:', keywordsResult!.error_msg);
          return NextResponse.json(keywordsResult, { status: keywordsResponse.status });
        }
      } catch (error) {
        console.error('Error processing keywords:', error);
        return NextResponse.json(
          { code: 500, ret: "", error_msg: `Keywords API error: ${(error as Error).message}` },
          { status: 500 }
        );
      }
    }
    
    // Step 2: Process tags if provided
    if (body.tags && Object.keys(body.tags).length > 0) {
      console.log(`Forwarding tags request to backend: ${backendUrl}/process_tags`);
      
      const tagsRequestBody = {
        user_id: body.user_id,
        tags: body.tags
      };
      
      
      try {
        // Call the tags API on the backend
        const tagsResponse = await fetch(`${backendUrl}/process_tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tagsRequestBody),
        });
        
        // Parse the tags response
        tagsResult = await tagsResponse.json();
        
        console.log('Backend tags response status:', tagsResponse.status);
        console.log('Backend tags response body:', tagsResult);
        
        // If the tags request failed, return the error immediately
        if (!tagsResponse.ok) {
          console.error('Backend tags request failed:', tagsResult!.error_msg);
          return NextResponse.json(tagsResult, { status: tagsResponse.status });
        }
      } catch (error) {
        console.error('Error processing tags:', error);
        return NextResponse.json(
          { code: 500, ret: "", error_msg: `Tags API error: ${(error as Error).message}` },
          { status: 500 }
        );
      }
    }
    
    // If neither keywords nor tags were provided or processed
    if (!keywordsResult && !tagsResult) {
      return NextResponse.json(
        { code: 400, ret: "", error_msg: 'Invalid request. Provide at least keywords or tags.' },
        { status: 400 }
      );
    }
    
    // Return the result from the last successful API call
    // Prioritize tags result if both were successful
    const finalResult = tagsResult || keywordsResult;
    
    // Return the backend response
    return NextResponse.json(finalResult);
    
  } catch (error) {
    console.error('Error processing request:', error);
    
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