import { NextRequest, NextResponse } from 'next/server'
import { generateHRDRoadmap } from '@/lib/recommendations'

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

    // สร้าง HRD Roadmap recommendations
    const hrdRoadmap = generateHRDRoadmap({
      role,
      experienceLevel,
      organizationType,
      selfAssessedProficiency,
      scores: {
        techLiteracyScore,
        dataAnalysisScore,
        digitalCommunicationScore,
        innovationMindsetScore,
        digitalEthicsScore,
      },
    })

    // สร้างข้อมูลผลลัพธ์ที่จะส่งกลับ (ไม่บันทึกลง database)
    const result = {
      formData: {
        name: name || null,
        department: department || null,
        role,
        experienceLevel,
        organizationType,
        selfAssessedProficiency,
      },
      scores: {
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
      answers,
      feedback,
      hrdRoadmap,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}
