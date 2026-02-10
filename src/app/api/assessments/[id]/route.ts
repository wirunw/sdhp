import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ดึงรายละเอียดการประเมินตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const assessment = await db.assessment.findUnique({
      where: { id },
      include: {
        results: true,
        feedback: true,
        responses: true,
      },
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ assessment })
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}
