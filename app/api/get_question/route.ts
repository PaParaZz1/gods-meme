import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { code: 1, ret: null, error_msg: 'User ID is required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { code: 1, ret: null, error_msg: 'Backend URL is not set' },
        { status: 500 }
      )
    }
    const response = await fetch(`${backendUrl}/get_question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          code: 1, 
          ret: null, 
          error_msg: errorData.error_msg || 'Failed to fetch question from backend' 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Return the response from Python backend
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in get_question API route:', error)
    return NextResponse.json(
      { 
        code: 1, 
        ret: null, 
        error_msg: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

