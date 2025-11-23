import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, keywords, top_k = 9 } = body;

    // Validate required fields
    if (!user_id || !keywords) {
      return NextResponse.json(
        { code: 1, ret: null, error_msg: 'Missing required fields: user_id or keywords' },
        { status: 400 }
      );
    }

    // Call Python backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/recommend_scene_themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        keywords,
        top_k
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { code: 1, ret: null, error_msg: errorData.error_msg || 'Backend request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in recommend_scene_themes API:', error);
    return NextResponse.json(
      { code: 1, ret: null, error_msg: 'Internal server error' },
      { status: 500 }
    );
  }
}

