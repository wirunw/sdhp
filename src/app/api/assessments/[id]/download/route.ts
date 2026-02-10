import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// สร้างรายงาด PDF/Text สำหรับดาวน์โหลด
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

    // สร้างเนื้อหารายงาด
    const report = generateReport(assessment)

    // ส่งเป็น text file
    return new NextResponse(report, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="SDHP-Assessment-${id.slice(0, 8)}.txt"`,
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

function generateReport(assessment: any): string {
  const { results, feedback } = assessment

  const getRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      EXECUTIVE: 'ผู้บริหาร',
      CLINICAL_STAFF: 'ผู้ปฏิบัติงานทางการแพทย์',
      CLINICAL_SUPPORT: 'ผู้ปฏิบัติงานสนับสนุนการแพทย์',
      BACK_OFFICE: 'ผู้ปฏิบัติงานทั่วไป',
      IT_SUPPORT: 'ผู้ปฏิบัติงานด้านสารสนเทศ',
    }
    return roleMap[role] || role
  }

  const getLevelName = (level: string | null) => {
    if (!level) return '-'
    const names: Record<string, string> = {
      AWARENESS: 'ระดับตระหนัก (A)',
      LITERACY: 'ระดับรู้ความสามารถ (L)',
      PROFICIENCY: 'ระดับชำนาญ (P)',
      EXPERTISE: 'ระดับเชี่ยวชาญ (E)',
    }
    return names[level] || level
  }

  const getDimensionName = (key: string) => {
    const names: Record<string, string> = {
      techLiteracy: 'การรู้เท่าทันเทคโนโลยี (TL)',
      dataAnalysis: 'การวิเคราะห์ข้อมูล (DA)',
      digitalCommunication: 'การสื่อสารดิจิทัล (DC)',
      innovationMindset: 'แนวคิดเชิงนวัตกรรม (IM)',
      digitalEthics: 'จริยธรรมดิจิทัล (DE)',
    }
    return names[key] || key
  }

  // สร้าง Development Timeline Recommendations
  const timeline = generateDevelopmentTimeline(assessment)

  let report = `═══════════════════════════════════════════════════════════════
  รายงานผลการประเมินสมรรถนะดิจิทัล SDHP-HX
  Smart Digital Health People Assessment
═══════════════════════════════════════════════════════════════

📅 วันที่ประเมิน: ${new Date(assessment.createdAt).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}
👤 ชื่อ: ${assessment.name || 'ไม่ระบุ'}
📋 บทบาท: ${getRoleName(assessment.role)}
🏢 ประเภทหน่วยงาน: ${assessment.organizationType.replace(/_/g, ' ')}
⏱️ ประสบการณ์การทำงาน: ${assessment.experienceLevel.replace(/_/g, ' ')}
🎯 ความถนัดดิจิทัล (ประเมินตนเอง): ${assessment.selfAssessedProficiency.replace(/_/g, ' ')}

═══════════════════════════════════════════════════════════════
  สรุปผลการประเมิน
═══════════════════════════════════════════════════════════════

📊 ระดับสมรรถนะโดยรวม: ${getLevelName(results?.overallCompetencyLevel)}
💯 คะแนนเฉลี่ยรวม: ${results?.overallAverageScore?.toFixed(2) || '-'}/5.00

───────────────────────────────────────────────────────────────
คะแนนรายมิติ
───────────────────────────────────────────────────────────────

`

  const dims = [
    { key: 'techLiteracy', name: 'การรู้เท่าทันเทคโนโลยี', short: 'TL' },
    { key: 'dataAnalysis', name: 'การวิเคราะห์ข้อมูล', short: 'DA' },
    { key: 'digitalCommunication', name: 'การสื่อสารดิจิทัล', short: 'DC' },
    { key: 'innovationMindset', name: 'แนวคิดเชิงนวัตกรรม', short: 'IM' },
    { key: 'digitalEthics', name: 'จริยธรรมดิจิทัล', short: 'DE' },
  ]

  dims.forEach((dim) => {
    const score = results?.[`${dim.key}Score`]
    const level = results?.[`${dim.key}Level`]
    report += `📌 ${getDimensionName(dim.key)}
   คะแนน: ${score?.toFixed(2) || '-'}/5.00
   ระดับ: ${getLevelName(level || null)}

`
  })

  report += `
═══════════════════════════════════════════════════════════════
  แนวทางการพัฒนาแบบ 3 ระยะ (3-Phase Roadmap)
═══════════════════════════════════════════════════════════════

`

  timeline.forEach((phase, index) => {
    report += `📍 ${phase.title}
${'─'.repeat(60)}
⏰ ระยะเวลา: ${phase.duration}
🎯 เป้าหมาย: ${phase.goal}

✅ กิจกรรมที่แนะนำ:
${phase.activities.map((a) => `   • ${a}`).join('\n')}

`
  })

  if (feedback?.challenges || feedback?.suggestions || feedback?.trainingNeeds) {
    report += `
═══════════════════════════════════════════════════════════════
  ความคิดเห็นและข้อเสนอแนะ
═══════════════════════════════════════════════════════════════
`

    if (feedback.challenges) {
      report += `🔴 อุปสรรคและความท้าทาย:
${feedback.challenges}

`
    }

    if (feedback.suggestions) {
      report += `💡 ข้อเสนอแนะ:
${feedback.suggestions}

`
    }

    if (feedback.trainingNeeds) {
      report += `📚 ความต้องการด้านการอบรม:
${feedback.trainingNeeds}

`
    }
  }

  report += `
═══════════════════════════════════════════════════════════════
  ข้อมูลเพิ่มเติม
═══════════════════════════════════════════════════════════════

• รายงานนี้สร้างโดยระบบประเมินสมรรถนะดิจิทัล SDHP-HX
• ตามกรอบ Smart Digital Health People Hybrid-Expanded
• สำหรับการพัฒนาบุคลากรทางการแพทย์และสาธารณสุข

═══════════════════════════════════════════════════════════════
`

  return report
}

// Algorithm แนะนำ Timeline การพัฒนา
function generateDevelopmentTimeline(assessment: any) {
  const { results, role } = assessment
  const dimensions = {
    techLiteracy: results?.techLiteracyScore || 0,
    dataAnalysis: results?.dataAnalysisScore || 0,
    digitalCommunication: results?.digitalCommunicationScore || 0,
    innovationMindset: results?.innovationMindsetScore || 0,
    digitalEthics: results?.digitalEthicsScore || 0,
  }

  // กำหนดเกณฑ์คาดหวังตามบทบาท
  const expectedLevels: Record<string, any> = {
    EXECUTIVE: { techLiteracy: 3, dataAnalysis: 3.5, digitalCommunication: 3, innovationMindset: 3, digitalEthics: 4 },
    CLINICAL_STAFF: { techLiteracy: 2.5, dataAnalysis: 2.5, digitalCommunication: 3.5, innovationMindset: 3, digitalEthics: 3.5 },
    CLINICAL_SUPPORT: { techLiteracy: 2.5, dataAnalysis: 2.5, digitalCommunication: 3, innovationMindset: 3, digitalEthics: 3.5 },
    BACK_OFFICE: { techLiteracy: 2.5, dataAnalysis: 3, digitalCommunication: 2.5, innovationMindset: 3, digitalEthics: 3.5 },
    IT_SUPPORT: { techLiteracy: 4, dataAnalysis: 3.5, digitalCommunication: 3, innovationMindset: 3.5, digitalEthics: 4 },
  }

  const expected = expectedLevels[role] || expectedLevels.CLINICAL_STAFF

  // ระบุพื้นที่ที่ต้องพัฒนา
  const weakDimensions = Object.entries(dimensions)
    .filter(([key, score]) => score < expected[key] - 0.3)
    .map(([key]) => key)

  const strongDimensions = Object.entries(dimensions)
    .filter(([key, score]) => score >= expected[key] + 0.5)
    .map(([key]) => key)

  // สร้าง timeline 3 ระยะ
  const timeline = []

  // ระยะที่ 1: Quick Win (90 วัน)
  const quickWinActivities = []

  if (weakDimensions.includes('digitalCommunication')) {
    quickWinActivities.push(
      'ฝึกใช้เครื่องมือสื่อสารดิจิทัลพื้นฐาน (Email, Chat, Video Call)',
      'ทบทวนวิธีการสื่อสารที่เหมาะสมกับแต่ละสถานการณ์',
      'ฝึกการเขียนอีเมลและข้อความแบบมืออาชีพ'
    )
  }

  if (weakDimensions.includes('techLiteracy')) {
    quickWinActivities.push(
      'เรียนรู้ฟีเจอร์พื้นฐานของระบบที่ใช้งานประจำ',
      'ฝึกใช้คีย์ลัดและเทคนิคพื้นฐาน',
      'ทำความคุ้นเคยกับอุปกรณ์ดิจิทัลที่ใช้งาน'
    )
  }

  if (weakDimensions.includes('dataAnalysis') && role !== 'BACK_OFFICE') {
    quickWinActivities.push(
      'เรียนรู้การดึงข้อมูลพื้นฐานจากระบบ',
      'ฝึกอ่านและตีความกราฟและรายงานข้อมูล',
      'เรียนรู้การใช้ Excel พื้นฐานสำหรับข้อมูลสุขภาพ'
    )
  }

  // เพิ่มกิจกรรมทั่วไป
  quickWinActivities.push(
    'ร่วมอบรมหรือเวิร์กชอปด้านทักษะดิจิทัล',
    'ศึกษาคู่มือการใช้งานระบบของหน่วยงาน',
    'ขอคำแนะนำจากเพื่อนร่วมงานที่มีประสบการณ์'
  )

  timeline.push({
    title: 'ระยะที่ 1: Quick Win (เร่งด่วน)',
    duration: '90 วัน',
    goal: 'แก้ไขปัญหาที่เห็นได้ชัดและสร้างพื้นฐาน',
    activities: quickWinActivities.slice(0, 6),
  })

  // ระยะที่ 2: Upskill (6 เดือน)
  const upskillActivities = []

  if (weakDimensions.includes('dataAnalysis')) {
    upskillActivities.push(
      'เรียนรู้การวิเคราะห์ข้อมูลขั้นสูง',
      'ฝึกใช้ข้อมูลเพื่อการตัดสินใจในงาน',
      'เรียนรู้การสร้าง Dashboard หรือรายงานข้อมูล'
    )
  }

  if (weakDimensions.includes('digitalCommunication')) {
    upskillActivities.push(
      'ฝึกการสื่อสารข้ามแผนกและองค์กร',
      'เรียนรู้การใช้เครื่องมือร่วมงานออนไลน์',
      'พัฒนาทักษะการนำเสนอผ่านช่องทางดิจิทัล'
    )
  }

  if (strongDimensions.length > 0) {
    upskillActivities.push(
      'พัฒนาทักษะที่เก่งให้แข็งแกร่งยิ่งขึ้น',
      'เตรียมตัวเป็น Digital Champion หรือ Mentor',
      'แบ่งปันความรู้ให้เพื่อนร่วมงาน'
    )
  }

  upskillActivities.push(
    'เข้าร่วมหลักสูตรการอบรมดิจิทัลเฉพาะทาง',
    'ลองประยุกต์ใช้เทคโนโลยีใหม่ในงานจริง',
    'ร่วมโครงการพัฒนาระบบดิจิทัลของหน่วยงาน'
  )

  timeline.push({
    title: 'ระยะที่ 2: Upskill (พัฒนาทักษะเฉพาะทาง)',
    duration: '6 เดือน',
    goal: 'เพิ่มขีดความสามารถในพื้นที่ที่ต้องการและเฉพาะทาง',
    activities: upskillActivities.slice(0, 6),
  })

  // ระยะที่ 3: System-level (12 เดือน)
  const systemActivities = [
    'มีส่วนร่วมในการออกแบบและปรับปรุงระบบดิจิทัล',
    'สร้างและพัฒนาวัฒนธรรมนวัตกรรมดิจิทัลในทีมงาน',
    'ใช้ข้อมูลเชิงลึกเพื่อปรับปรุงกระบวนการทำงาน',
    'เชื่อมโยงและบูรณาการข้อมูลระหว่างระบบต่างๆ',
    'ส่งเสริมและเป็นแบบอย่างในการปฏิบัติตามจริยธรรมดิจิทัล',
    'ร่วมพัฒนามาตรฐานและ Best Practices ด้านดิจิทัลขององค์กร',
  ]

  if (role === 'EXECUTIVE' || role === 'IT_SUPPORT') {
    systemActivities.unshift(
      'กำหนดและพัฒนานโยบายดิจิทัลขององค์กร',
      'สร้าง Data Governance และมาตรฐานข้อมูล',
      'วางแผนการเชื่อมต่อระบบ (Interoperability)'
    )
  }

  timeline.push({
    title: 'ระยะที่ 3: System-level (ยกระดับระบบ)',
    duration: '12 เดือน',
    goal: 'ยกระดับมาตรฐานและสร้างวัฒนธรรมดิจิทัลที่ยั่งยืน',
    activities: systemActivities.slice(0, 6),
  })

  return timeline
}
