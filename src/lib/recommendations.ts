interface DimensionScore {
  techLiteracyScore: number | null
  dataAnalysisScore: number | null
  digitalCommunicationScore: number | null
  innovationMindsetScore: number | null
  digitalEthicsScore: number | null
}

interface AssessmentData {
  role: string
  experienceLevel: string
  organizationType: string
  selfAssessedProficiency: string
  scores: DimensionScore
}

interface Recommendation {
  phase: string
  phaseName: string
  timeframe: string
  goal: string
  actionItems: string[]
  priority: 'high' | 'medium' | 'low'
  dimensions: string[]
}

interface HRDRoadmap {
  overallStrategy: string
  phases: Recommendation[]
  gapAnalysis: {
    lowestDimension: string
    lowestScore: number | null
    priorityDimensions: string[]
  }
  roleSpecificRecommendations: string[]
  immediateActions: string[]
}

const DIMENSION_LABELS = {
  techLiteracyScore: 'การรู้เท่าทันเทคโนโลยี',
  dataAnalysisScore: 'การวิเคราะห์ข้อมูล',
  digitalCommunicationScore: 'การสื่อสารดิจิทัล',
  innovationMindsetScore: 'แนวคิดเชิงนวัตกรรม',
  digitalEthicsScore: 'จริยธรรมดิจิทัล',
}

const PHASE_1_RECOMMENDATIONS: Recommendation[] = [
  {
    phase: 'Phase 1',
    phaseName: 'ระยะที่ 1: ระยะเร่งด่วน (Quick Win)',
    timeframe: '90 วัน',
    goal: 'จัดการปัจจัยเชิงโครงสร้างและลดอุปสรรคหน้างาน (Managing Hygiene Factors)',
    actionItems: [
      'จัดทำมาตรฐานการใช้งานระบบ (Playbook) สำหรับเทคโนโลยีหลัก',
      'สร้างสื่อการเรียนรู้แบบสั้น (Micro-learning) แก้ปัญหาหน้างานทันที',
      'จัดตั้งระบบสนับสนุนผู้ใช้งาน (Helpdesk) ที่เข้าถึงง่าย',
      'ลดความซับซ้อนในการสื่อสารทางดิจิทัล',
      'สำรวจและแก้ไขปัญหาการบันทึกข้อมูลซ้ำซ้อนระหว่างระบบ',
    ],
    priority: 'high',
    dimensions: ['techLiteracyScore', 'digitalCommunicationScore'],
  },
]

const PHASE_2_RECOMMENDATIONS: Record<string, Recommendation[]> = {
  techLiteracyScore: [
    {
      phase: 'Phase 2',
      phaseName: 'ระยะที่ 2: พัฒนาทักษะเฉพาะทาง (Upskill)',
      timeframe: '6 เดือน',
      goal: 'พัฒนาทักษะการรู้เท่าทันเทคโนโลยี',
      actionItems: [
        'เรียนรู้การใช้งานเทคโนโลยีดิจิทัลพื้นฐานอย่างเป็นระบบ',
        'ฝึกใช้เครื่องมือดิจิทัลให้ชำนาญเพิ่มขึ้น',
        'เข้าร่วม workshop การใช้งานระบบหลักขององค์กร',
        'ประยุกต์ใช้เทคโนโลยีในงานประจำวัน',
      ],
      priority: 'high',
      dimensions: ['techLiteracyScore'],
    },
  ],
  dataAnalysisScore: [
    {
      phase: 'Phase 2',
      phaseName: 'ระยะที่ 2: พัฒนาทักษะเฉพาะทาง (Upskill)',
      timeframe: '6 เดือน',
      goal: 'พัฒนาทักษะการวิเคราะห์ข้อมูล',
      actionItems: [
        'เรียนรู้การอ่านและวิเคราะห์ข้อมูลพื้นฐาน',
        'ฝึกใช้เครื่องมือวิเคราะห์ข้อมูล (Excel, Analytics Dashboard)',
        'ฝึกการตีความข้อมูลเพื่อการตัดสินใจ',
        'ประยุกต์ใช้ข้อมูลในการปรับปรุงงาน',
      ],
      priority: 'high',
      dimensions: ['dataAnalysisScore'],
    },
  ],
  digitalCommunicationScore: [
    {
      phase: 'Phase 2',
      phaseName: 'ระยะที่ 2: พัฒนาทักษะเฉพาะทาง (Upskill)',
      timeframe: '6 เดือน',
      goal: 'พัฒนาทักษะการสื่อสารดิจิทัล',
      actionItems: [
        'เรียนรู้การใช้งานช่องทางสื่อสารดิจิทัลที่เหมาะสม',
        'ฝึกการเขียนอีเมลและเอกสารแบบดิจิทัล',
        'เรียนรู้การใช้ Video Conference อย่างมีประสิทธิภาพ',
        'พัฒนาการทำงานเป็นทีมแบบ remote',
      ],
      priority: 'high',
      dimensions: ['digitalCommunicationScore'],
    },
  ],
  innovationMindsetScore: [
    {
      phase: 'Phase 2',
      phaseName: 'ระยะที่ 2: พัฒนาทักษะเฉพาะทาง (Upskill)',
      timeframe: '6 เดือน',
      goal: 'พัฒนาแนวคิดเชิงนวัตกรรม',
      actionItems: [
        'เรียนรู้ Design Thinking และแนวคิดนวัตกรรม',
        'ฝึกการคิดเชิงสร้างสรรค์และแก้ปัญหา',
        'เรียนรู้เทคโนโลยีใหม่ๆ ที่น่าสนใจ',
        'ร่วมคิดแนวทางปรับปรุงงานด้วยเทคโนโลยี',
      ],
      priority: 'medium',
      dimensions: ['innovationMindsetScore'],
    },
  ],
  digitalEthicsScore: [
    {
      phase: 'Phase 2',
      phaseName: 'ระยะที่ 2: พัฒนาทักษะเฉพาะทาง (Upskill)',
      timeframe: '6 เดือน',
      goal: 'พัฒนาจริยธรรมดิจิทัล',
      actionItems: [
        'เรียนรู้กฎหมายและข้อบังคับเกี่ยวกับข้อมูลสุขภาพ',
        'ฝึกการรักษาความปลอดภัยข้อมูลผู้ป่วย',
        'เรียนรู้การใช้งานที่ถูกต้องตามจริยธรรม',
        'ปฏิบัติตามมาตรฐานความเป็นส่วนตัวและความปลอดภัย',
      ],
      priority: 'high',
      dimensions: ['digitalEthicsScore'],
    },
  ],
}

const PHASE_3_RECOMMENDATIONS: Recommendation[] = [
  {
    phase: 'Phase 3',
    phaseName: 'ระยะที่ 3: ระยะสร้างความยั่งยืน (System-level Transformation)',
    timeframe: '12 เดือน',
    goal: 'ยกระดับธรรมาภิบายข้อมูลและวัฒนธรรมองค์กร (Sustainable Data Culture)',
    actionItems: [
      'มีส่วนร่วมในการยกระดับมาตรฐานข้อมูลขององค์กร',
      'ใช้ทักษะวิเคราะห์ข้อมูลในการตัดสินใจระดับหน่วยงาน',
      'ส่งเสริมการเชื่อมต่อระบบสารสนเทศ (Interoperability)',
      'คิดค้นนวัตกรรมดิจิทัลเพื่อยกระดับความปลอดภัยผู้ป่วย',
      'เป็น Digital Champion ในการแบ่งปันความรู้',
    ],
    priority: 'medium',
    dimensions: ['dataAnalysisScore', 'innovationMindsetScore', 'digitalEthicsScore'],
  },
]

const ROLE_SPECIFIC_RECOMMENDATIONS: Record<string, string[]> = {
  clinical_staff: [
    'เน้นการใช้งานระบบ EMR/EHR อย่างมีประสิทธิภาพ',
    'พัฒนาการวิเคราะห์ข้อมูลทางคลินิก (Clinical Data Analysis)',
    'เรียนรู้การใช้เทคโนโลยีเพื่อปรับปรุงคุณภาพการรักษา',
  ],
  nursing_staff: [
    'เน้นการใช้งานระบบพยาบาลและดูแลผู้ป่วย',
    'พัฒนาการสื่อสารดิจิทัลกับครอบครัวผู้ป่วย',
    'เรียนรู้การใช้เทคโนโลยีเพื่อความปลอดภัยผู้ป่วย',
  ],
  administrative_staff: [
    'เน้นการใช้งานระบบบริหารและจัดการเอกสาร',
    'พัฒนาการวิเคราะห์ข้อมูลด้านการจัดการ',
    'เรียนรู้การใช้เทคโนโลยีเพื่อเพิ่มประสิทธิภาพงาน',
  ],
  management: [
    'เน้นการวิเคราะห์ข้อมูลเชิงกลยุทธ์ (Strategic Data Analysis)',
    'พัฒนาแนวคิดเชิงนวัตกรรมดิจิทัล',
    'เป็นผู้นำในการส่งเสริมวัฒนธรรมดิจิทัล',
  ],
  it_support: [
    'เน้นการใช้งานเทคโนโลยีขั้นสูงและระบบซับซ้อน',
    'พัฒนาความสามารถในการเชื่อมต่อระบบ (Interoperability)',
    'เป็น Digital Champion และ Mentors ให้แก่บุคลากร',
  ],
}

export function calculateGapAnalysis(scores: DimensionScore): {
  lowestDimension: string
  lowestScore: number | null
  priorityDimensions: string[]
} {
  const dimensions: { key: keyof DimensionScore; label: string }[] = [
    { key: 'techLiteracyScore', label: 'การรู้เท่าทันเทคโนโลยี' },
    { key: 'dataAnalysisScore', label: 'การวิเคราะห์ข้อมูล' },
    { key: 'digitalCommunicationScore', label: 'การสื่อสารดิจิทัล' },
    { key: 'innovationMindsetScore', label: 'แนวคิดเชิงนวัตกรรม' },
    { key: 'digitalEthicsScore', label: 'จริยธรรมดิจิทัล' },
  ]

  const sortedDimensions = dimensions
    .filter(dim => scores[dim.key] !== null)
    .sort((a, b) => (scores[a.key] || 0) - (scores[b.key] || 0))

  const lowestDimension = sortedDimensions[0]?.key || ''
  const lowestScore = scores[lowestDimension as keyof DimensionScore] || null

  // Priority dimensions are those below 3.0
  const priorityDimensions = sortedDimensions
    .filter(dim => (scores[dim.key] || 0) < 3.0)
    .map(dim => dim.label)

  return {
    lowestDimension: DIMENSION_LABELS[lowestDimension as keyof typeof DIMENSION_LABELS] || '-',
    lowestScore,
    priorityDimensions,
  }
}

export function generateHRDRoadmap(data: AssessmentData): HRDRoadmap {
  const { scores, role } = data

  // Calculate gap analysis
  const gapAnalysis = calculateGapAnalysis(scores)

  // Identify lowest dimension
  const dimensions: (keyof DimensionScore)[] = [
    'techLiteracyScore',
    'dataAnalysisScore',
    'digitalCommunicationScore',
    'innovationMindsetScore',
    'digitalEthicsScore',
  ]

  const sortedDimensions = dimensions
    .filter(dim => scores[dim] !== null)
    .sort((a, b) => (scores[a] || 0) - (scores[b] || 0))

  const lowestDimKey = sortedDimensions[0] || 'techLiteracyScore'

  // Get role-specific recommendations
  const roleKey = role.replace(/ /g, '_').toLowerCase()
  const roleSpecificRecs = ROLE_SPECIFIC_RECOMMENDATIONS[roleKey] || [
    'พัฒนาทักษะดิจิทัลตามบทบาทหน้าที่',
    'เรียนรู้เทคโนโลยีที่เกี่ยวข้องกับงาน',
    'ประยุกต์ใช้เทคโนโลยีในการทำงานจริง',
  ]

  // Determine immediate actions based on lowest scoring dimension
  const immediateActions = [
    `เร่งพัฒนาทักษะ ${DIMENSION_LABELS[lowestDimKey as keyof typeof DIMENSION_LABELS]} (คะแนนต่ำสุด)`,
    'ทำตามแนวทาง Phase 1: Quick Win ใน 90 วันแรก',
    'ติดต่อ Helpdesk หรือ Digital Champions ถ้าพบปัญหา',
  ]

  // Build phases
  let allPhases: Recommendation[] = [...PHASE_1_RECOMMENDATIONS]

  // Add Phase 2 recommendations based on lowest dimension
  if (PHASE_2_RECOMMENDATIONS[lowestDimKey]) {
    allPhases = [...allPhases, ...PHASE_2_RECOMMENDATIONS[lowestDimKey]]
  } else {
    // Add all Phase 2 recommendations if specific one not found
    Object.values(PHASE_2_RECOMMENDATIONS).forEach(recs => {
      allPhases = [...allPhases, ...recs]
    })
  }

  // Add Phase 3 recommendations
  allPhases = [...allPhases, ...PHASE_3_RECOMMENDATIONS]

  return {
    overallStrategy: 'การดำเนินงานตาม Roadmap 3 ระยะนี้ จะเปลี่ยนจากเพียงการ "สอนให้บุคลากรใช้งานเป็น" ไปสู่การ "สร้างสภาพแวดล้อมที่เอื้อให้บุคลากรทำงานได้ดีขึ้น" อันเป็นหัวใจสำคัญของการสร้าง Smart Digital Health People ที่ยั่งยืน',
    phases: allPhases,
    gapAnalysis,
    roleSpecificRecommendations: roleSpecificRecs,
    immediateActions,
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-400 border-red-500/30'
    case 'medium':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    case 'low':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  }
}