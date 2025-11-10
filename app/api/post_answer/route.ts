import { NextResponse } from 'next/server'

interface PostAnswerRequest {
  user_id: string
  answer_data: {
    question: string
    answer: string
  }
}

export async function POST(request: Request) {
  try {
    const body: PostAnswerRequest = await request.json()
    const { user_id, answer_data } = body

    if (!user_id) {
      return NextResponse.json(
        { code: 1, ret: null, error_msg: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!answer_data || !answer_data.question || !answer_data.answer) {
      return NextResponse.json(
        { code: 1, ret: null, error_msg: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json(
        { code: 1, ret: null, error_msg: 'Backend URL is not set' },
        { status: 500 }
      )
    }

    console.log('Posting answer to backend:', {
      user_id,
      answer_data
    })

    const response = await fetch(`${backendUrl}/post_answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        answer_data: answer_data
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend post_answer request failed:', errorData)
      return NextResponse.json(
        { 
          code: 1, 
          ret: null, 
          error_msg: errorData.error_msg || 'Failed to post answer to backend' 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend post_answer response:', data)
    
    // Return the response from Python backend
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in post_answer API route:', error)
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

