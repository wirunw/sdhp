import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ดึงรายการการประเมินทั้งหมด
export async function GET() {
  try {
    const assessments = await db.assessment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        results: true,
      },
    })

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}

// บันทึกการประเมินใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      department,
      role,
      experienceLevel,
      organizationType,
      selfAssessedProficiency,
      answers,
      feedback,
    } = body

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!role || !experienceLevel || !organizationType || !selfAssessedProficiency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // คำนวณคะแนนรายมิติ
    const dimensionScores = {
      TECH_LITERACY: [] as number[],
      DATA_ANALYSIS: [] as number[],
      DIGITAL_COMMUNICATION: [] as number[],
      INNOVATION_MINDSET: [] as number[],
      DIGITAL_ETHICS: [] as number[],
    }

    // จัดกลุ่มคะแนนตามมิติ
    Object.entries(answers).forEach(([questionId, score]) => {
      // แปลงคะแนนเป็น number
      const numericScore = typeof score === 'string' ? parseInt(score) : score as number
      
      if (questionId.startsWith('TL')) {
        dimensionScores.TECH_LITERACY.push(numericScore)
      } else if (questionId.startsWith('DA')) {
        dimensionScores.DATA_ANALYSIS.push(numericScore)
      } else if (questionId.startsWith('DC')) {
        dimensionScores.DIGITAL_COMMUNICATION.push(numericScore)
      } else if (questionId.startsWith('IM')) {
        dimensionScores.INNOVATION_MINDSET.push(numericScore)
      } else if (questionId.startsWith('DE')) {
        dimensionScores.DIGITAL_ETHICS.push(numericScore)
      }
    })

    // คำนวณค่าเฉลี่ยรายมิติ
    const calculateAverage = (scores: number[]) => {
      if (scores.length === 0) return null
      const sum = scores.reduce((acc, curr) => acc + curr, 0)
      return Math.round((sum / scores.length) * 100) / 100 // ปัดเป็นทศนิยม 2 ตำแหน่ง
    }

    const techLiteracyScore = calculateAverage(dimensionScores.TECH_LITERACY)
    const dataAnalysisScore = calculateAverage(dimensionScores.DATA_ANALYSIS)
    const digitalCommunicationScore = calculateAverage(dimensionScores.DIGITAL_COMMUNICATION)
    const innovationMindsetScore = calculateAverage(dimensionScores.INNOVATION_MINDSET)
    const digitalEthicsScore = calculateAverage(dimensionScores.DIGITAL_ETHICS)

    // คำนวณคะแนนเฉลี่ยรวม
    const allScores = [
      techLiteracyScore,
      dataAnalysisScore,
      digitalCommunicationScore,
      innovationMindsetScore,
      digitalEthicsScore,
    ].filter((score): score is number => score !== null)

    const overallAverageScore = allScores.length > 0
      ? Math.round((allScores.reduce((acc, curr) => acc + curr, 0) / allScores.length) * 100) / 100
      : null

    // กำหนดระดับสมรรถนะตาม Method A
    const getCompetencyLevel = (score: number | null): 'EXPERTISE' | 'PROFICIENCY' | 'LITERACY' | 'AWARENESS' | null => {
      if (!score) return null
      if (score >= 4.0) return 'EXPERTISE'
      if (score >= 3.0) return 'PROFICIENCY'
      if (score >= 2.0) return 'LITERACY'
      return 'AWARENESS'
    }

    const techLiteracyLevel = getCompetencyLevel(techLiteracyScore) as any
    const dataAnalysisLevel = getCompetencyLevel(dataAnalysisScore) as any
    const digitalCommunicationLevel = getCompetencyLevel(digitalCommunicationScore) as any
    const innovationMindsetLevel = getCompetencyLevel(innovationMindsetScore) as any
    const digitalEthicsLevel = getCompetencyLevel(digitalEthicsScore) as any
    const overallCompetencyLevel = getCompetencyLevel(overallAverageScore) as any

    // บันทึก Assessment
    const assessment = await db.assessment.create({
      data: {
        name: name || null,
        department: department || null,
        role,
        experienceLevel,
        organizationType,
        selfAssessedProficiency,
      },
    })

    // บันทึกผลการประเมิน
    const result = await db.assessmentResult.create({
      data: {
        assessmentId: assessment.id,
        techLiteracyScore,
        techLiteracyLevel,
        dataAnalysisScore,
        dataAnalysisLevel,
        digitalCommunicationScore,
        digitalCommunicationLevel,
        innovationMindsetScore,
        innovationMindsetLevel,
        digitalEthicsScore,
        digitalEthicsLevel,
        overallAverageScore,
        overallCompetencyLevel,
      },
    })

    // บันทึกคำตอบรายข้อ
    const scenarioQuestions = [
      { id: 'TL1', dimension: 'TECH_LITERACY', question: 'เมื่อระบบ HIS มีการอัปเดตเวอร์ชันใหม่ คุณมักจะทำอย่างไร' },
      { id: 'TL2', dimension: 'TECH_LITERACY', question: 'เมื่อเครื่องมือดิจิทัลที่ใช้ทำงานประจำเกิดปัญหาขัดข้อง คุณจะจัดการอย่างไร' },
      { id: 'TL3', dimension: 'TECH_LITERACY', question: 'คุณเลือกใช้แอปพลิเคชันหรือซอฟต์แวร์ใหม่ในการทำงานอย่างไร' },
      { id: 'TL4', dimension: 'TECH_LITERACY', question: 'เมื่อมีการนำระบบ Telehealth มาใช้ คุณปรับตัวอย่างไร' },
      { id: 'TL5', dimension: 'TECH_LITERACY', question: 'คุณจัดการความปลอดภัยดิจิทัลในการทำงานประจำวันอย่างไร' },
      { id: 'DA1', dimension: 'DATA_ANALYSIS', question: 'เมื่อต้องการทราบแนวโน้มจำนวนผู้ป่วยในแผนก คุณจะทำอย่างไร' },
      { id: 'DA2', dimension: 'DATA_ANALYSIS', question: 'คุณใช้ข้อมูลจากระบบในการตัดสินใจดูแลผู้ป่วยอย่างไร' },
      { id: 'DA3', dimension: 'DATA_ANALYSIS', question: 'เมื่อพบว่ามีความผิดปกติในข้อมูลรายงาน คุณจะทำอย่างไร' },
      { id: 'DA4', dimension: 'DATA_ANALYSIS', question: 'คุณใช้ข้อมูลเพื่อปรับปรุงคุณภาพบริการอย่างไร' },
      { id: 'DA5', dimension: 'DATA_ANALYSIS', question: 'คุณจัดการกับข้อมูลขนาดใหญ่ (Big Data) จากระบบต่างๆ อย่างไร' },
      { id: 'DC1', dimension: 'DIGITAL_COMMUNICATION', question: 'คุณสื่อสารกับผู้ป่วยผ่านช่องทางดิจิทัลอย่างไร' },
      { id: 'DC2', dimension: 'DIGITAL_COMMUNICATION', question: 'คุณทำงานร่วมกับทีมสายอาชีพอื่นผ่านช่องทางดิจิทัลอย่างไร' },
      { id: 'DC3', dimension: 'DIGITAL_COMMUNICATION', question: 'คุณถ่ายทอดความรู้ดิจิทัลให้เพื่อนร่วมงานอย่างไร' },
      { id: 'DC4', dimension: 'DIGITAL_COMMUNICATION', question: 'คุณจัดการปัญหาการสื่อสารที่เกิดจากระบบไม่เชื่อมต่อกันอย่างไร' },
      { id: 'DC5', dimension: 'DIGITAL_COMMUNICATION', question: 'คุณใช้สื่อสังคมออนไลน์ในการทำงานอย่างไร' },
      { id: 'IM1', dimension: 'INNOVATION_MINDSET', question: 'เมื่อเผชิญปัญหาในการทำงานที่ซ้ำซ้อน คุณจะทำอย่างไร' },
      { id: 'IM2', dimension: 'INNOVATION_MINDSET', question: 'ทัศนคติของคุณต่อ AI และเทคโนโลยีใหม่ๆ คืออะไร' },
      { id: 'IM3', dimension: 'INNOVATION_MINDSET', question: 'คุณตอบสนองต่อการเปลี่ยนแปลงดิจิทัลอย่างไร' },
      { id: 'IM4', dimension: 'INNOVATION_MINDSET', question: 'คุณมีส่วนร่วมในการปรับปรุงกระบวนการทำงานดิจิทัลอย่างไร' },
      { id: 'IM5', dimension: 'INNOVATION_MINDSET', question: 'คุณเรียนรู้เทคโนโลยีใหม่ๆ อย่างไร' },
      { id: 'DE1', dimension: 'DIGITAL_ETHICS', question: 'คุณจัดการข้อมูลส่วนบุคคลของผู้ป่วยอย่างไร' },
      { id: 'DE2', dimension: 'DIGITAL_ETHICS', question: 'เมื่อมีคนขอข้อมูลผู้ป่วยโดยไม่มีสิทธิ์ คุณจะทำอย่างไร' },
      { id: 'DE3', dimension: 'DIGITAL_ETHICS', question: 'คุณใช้สื่อสังคมออนไลน์เกี่ยวกับงานอย่างไร' },
      { id: 'DE4', dimension: 'DIGITAL_ETHICS', question: 'คุณจัดการกับข้อมูลที่ผิดพลาดหรือไม่ถูกต้องอย่างไร' },
      { id: 'DE5', dimension: 'DIGITAL_ETHICS', question: 'ทัศนคติของคุณต่อกฎหมาย PDPA คืออะไร' },
    ]

    for (const q of scenarioQuestions) {
      if (answers[q.id]) {
        await db.scenarioResponse.create({
          data: {
            assessmentId: assessment.id,
            dimension: q.dimension as any,
            questionNumber: parseInt(q.id.replace(/\D/g, '')),
            questionText: q.question,
            score: answers[q.id] as number,
          },
        })
      }
    }

    // บันทึก Feedback (ถ้ามี)
    if (feedback?.challenges || feedback?.suggestions || feedback?.trainingNeeds) {
      await db.feedback.create({
        data: {
          assessmentId: assessment.id,
          challenges: feedback.challenges || null,
          suggestions: feedback.suggestions || null,
          trainingNeeds: feedback.trainingNeeds || null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      result,
    })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}
