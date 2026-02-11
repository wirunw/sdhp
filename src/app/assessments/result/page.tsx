'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, TrendingUp, Activity, Brain, Shield, Lightbulb, Users, Download as DownloadIcon, Rocket, Clock, Target, AlertCircle, CheckCircle2, Zap } from 'lucide-react'

interface AssessmentResult {
  formData: {
    name: string | null
    department: string | null
    role: string
    experienceLevel: string
    organizationType: string
    selfAssessedProficiency: string
  }
  scores: {
    techLiteracyScore: number | null
    techLiteracyLevel: string
    dataAnalysisScore: number | null
    dataAnalysisLevel: string
    digitalCommunicationScore: number | null
    digitalCommunicationLevel: string
    innovationMindsetScore: number | null
    innovationMindsetLevel: string
    digitalEthicsScore: number | null
    digitalEthicsLevel: string
    overallAverageScore: number | null
    overallCompetencyLevel: string
  }
  answers: Record<string, number>
  feedback: {
    challenges: string
    suggestions: string
    trainingNeeds: string
  }
  hrdRoadmap: {
    overallStrategy: string
    phases: Array<{
      phase: string
      phaseName: string
      timeframe: string
      goal: string
      actionItems: string[]
      priority: 'high' | 'medium' | 'low'
      dimensions: string[]
    }>
    gapAnalysis: {
      lowestDimension: string
      lowestScore: number | null
      priorityDimensions: string[]
    }
    roleSpecificRecommendations: string[]
    immediateActions: string[]
  }
  createdAt: string
}

const DIMENSIONS = [
  { key: 'techLiteracy', label: 'การรู้เท่าทันเทคโนโลยี', icon: Activity, color: 'emerald' },
  { key: 'dataAnalysis', label: 'การวิเคราะห์ข้อมูล', icon: TrendingUp, color: 'blue' },
  { key: 'digitalCommunication', label: 'การสื่อสารดิจิทัล', icon: Users, color: 'purple' },
  { key: 'innovationMindset', label: 'แนวคิดเชิงนวัตกรรม', icon: Lightbulb, color: 'orange' },
  { key: 'digitalEthics', label: 'จริยธรรมดิจิทัล', icon: Shield, color: 'red' },
]

const LEVEL_LABELS = {
  AWARENESS: 'ระดับ A (Awareness)',
  LITERACY: 'ระดับ L (Literacy)',
  PROFICIENCY: 'ระดับ P (Proficiency)',
  EXPERTISE: 'ระดับ E (Expertise)',
}

const LEVEL_DESCRIPTIONS = {
  AWARENESS: 'เริ่มต้นรับรู้และเข้าใจแนวคิดพื้นฐาน',
  LITERACY: 'สามารถใช้งานเทคโนโลยีและเครื่องมือดิจิทัลได้ในระดับพื้นฐาน',
  PROFICIENCY: 'มีทักษะและสามารถใช้งานได้อย่างมีประสิทธิภาพ',
  EXPERTISE: 'เชี่ยวชาญและสามารถนำไปประยุกต์ใช้ได้อย่างครบถ้วน',
}

export default function AssessmentResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedData = sessionStorage.getItem('assessmentResult')
    if (storedData) {
      setResult(JSON.parse(storedData))
    } else {
      router.push('/assessments/new')
    }
    setLoading(false)
  }, [router])

  const handleDownloadCSV = () => {
    try {
      if (!result) {
        console.error('No result data available')
        return
      }

      const rows = [
        ['SDHP Digital Competency Assessment Report'],
        ['', ''],
        ['ผู้ประเมิน', result.formData.name || 'ไม่ระบุ'],
        ['แผนก/กลุ่มงาน', result.formData.department || 'ไม่ระบุ'],
        ['บทบาทหน้าที่', result.formData.role.replace(/_/g, ' ')],
        ['ประสบการณ์การทำงาน', result.formData.experienceLevel.replace(/_/g, ' ')],
        ['ประเภทหน่วยงาน', result.formData.organizationType.replace(/_/g, ' ')],
        ['ความถนัดดิจิทัล', result.formData.selfAssessedProficiency.replace(/_/g, ' ')],
        ['วันที่ประเมิน', new Date(result.createdAt).toLocaleString('th-TH')],
        ['', ''],
        ['=== ผลการประเมินรายมิติ ==='],
        ['มิติ', 'คะแนน', 'ระดับ', 'คำอธิบาย'],
        ['การรู้เท่าทันเทคโนโลยี', result.scores.techLiteracyScore?.toFixed(2) || '-', result.scores.techLiteracyLevel, LEVEL_DESCRIPTIONS[result.scores.techLiteracyLevel as keyof typeof LEVEL_DESCRIPTIONS]],
        ['การวิเคราะห์ข้อมูล', result.scores.dataAnalysisScore?.toFixed(2) || '-', result.scores.dataAnalysisLevel, LEVEL_DESCRIPTIONS[result.scores.dataAnalysisLevel as keyof typeof LEVEL_DESCRIPTIONS]],
        ['การสื่อสารดิจิทัล', result.scores.digitalCommunicationScore?.toFixed(2) || '-', result.scores.digitalCommunicationLevel, LEVEL_DESCRIPTIONS[result.scores.digitalCommunicationLevel as keyof typeof LEVEL_DESCRIPTIONS]],
        ['แนวคิดเชิงนวัตกรรม', result.scores.innovationMindsetScore?.toFixed(2) || '-', result.scores.innovationMindsetLevel, LEVEL_DESCRIPTIONS[result.scores.innovationMindsetLevel as keyof typeof LEVEL_DESCRIPTIONS]],
        ['จริยธรรมดิจิทัล', result.scores.digitalEthicsScore?.toFixed(2) || '-', result.scores.digitalEthicsLevel, LEVEL_DESCRIPTIONS[result.scores.digitalEthicsLevel as keyof typeof LEVEL_DESCRIPTIONS]],
        ['', ''],
        ['คะแนนเฉลี่ยรวม', result.scores.overallAverageScore?.toFixed(2) || '-'],
        ['ระดับสมรรถนะโดยรวม', result.scores.overallCompetencyLevel, LEVEL_DESCRIPTIONS[result.scores.overallCompetencyLevel as keyof typeof LEVEL_DESCRIPTIONS]],
        ['', ''],
        ['=== ความคิดเห็นเชิงลึก ==='],
        ['อุปสรรคหรือความท้าทาย', result.feedback.challenges || '-'],
        ['ข้อเสนอแนะ', result.feedback.suggestions || '-'],
        ['ความต้องการด้านการอบรม', result.feedback.trainingNeeds || '-'],
        ['', ''],
        ['=== HRD Roadmap Recommendations ==='],
        ['Overall Strategy', result.hrdRoadmap.overallStrategy],
        ['', ''],
        ['Gap Analysis'],
        ['มิติที่คะแนนต่ำสุด', result.hrdRoadmap.gapAnalysis.lowestDimension],
        ['คะแนนต่ำสุด', result.hrdRoadmap.gapAnalysis.lowestScore?.toFixed(2) || '-'],
        ['มิติที่ต้องเร่งพัฒนา', Array.isArray(result.hrdRoadmap.gapAnalysis.priorityDimensions) ? result.hrdRoadmap.gapAnalysis.priorityDimensions.join(', ') : '-'],
        ['', ''],
      ['Immediate Actions'],
      ...(Array.isArray(result.hrdRoadmap.immediateActions) 
        ? result.hrdRoadmap.immediateActions.map(action => [action]) 
        : [['ไม่ระบุ']]),
      ['', ''],
      ['Role-Specific Recommendations'],
      ...(Array.isArray(result.hrdRoadmap.roleSpecificRecommendations) 
        ? result.hrdRoadmap.roleSpecificRecommendations.map(rec => [rec]) 
        : [['ไม่ระบุ']]),
        ['', ''],
        ['Phase Recommendations'],
        ...result.hrdRoadmap.phases.flatMap(phase => [
          '',
          [`${phase.phase}: ${phase.phaseName}`],
          [`เวลา: ${phase.timeframe}`],
          [`เป้าหมาย: ${phase.goal}`],
          ['Priority', phase.priority],
          ...phase.actionItems.map(item => [item]),
        ]),
      ]

      const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
      console.log('CSV Content generated, length:', csvContent.length)

      // Create blob with BOM for Excel compatibility
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
      console.log('Blob created, size:', blob.size)

      const url = URL.createObjectURL(blob)
      console.log('Object URL created:', url)

      const link = document.createElement('a')
      link.href = url
      link.download = `SDHP-Assessment-${new Date().toISOString().split('T')[0]}.csv`
      link.style.display = 'none'
      
      document.body.appendChild(link)
      console.log('Link appended to body')

      link.click()
      console.log('Link clicked')

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        console.log('Cleanup completed')
      }, 100)
    } catch (error) {
      console.error('Error downloading CSV:', error)
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด CSV กรุณาลองใหม่')
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-slate-600'
    if (score >= 4.0) return 'bg-emerald-500'
    if (score >= 3.0) return 'bg-blue-500'
    if (score >= 2.0) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'EXPERTISE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'PROFICIENCY': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'LITERACY': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'AWARENESS': return 'bg-red-500/10 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'medium': return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30'
    }
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Phase 1': return Zap
      case 'Phase 2': return Target
      case 'Phase 3': return Rocket
      default: return Clock
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ผลการประเมิน SDHP
                </h1>
                <p className="text-xs text-slate-400">Smart Digital Health People Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          {/* Overall Score Card */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">สมรรถนะดิจิทัลโดยรวม</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl">
                  <span className="text-4xl font-bold text-white">
                    {result.scores.overallAverageScore?.toFixed(2) || '-'}
                  </span>
                </div>
                <Badge className={`mt-4 ${getLevelBadgeColor(result.scores.overallCompetencyLevel)}`} variant="outline">
                  {LEVEL_LABELS[result.scores.overallCompetencyLevel as keyof typeof LEVEL_LABELS]}
                </Badge>
                <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                  {LEVEL_DESCRIPTIONS[result.scores.overallCompetencyLevel as keyof typeof LEVEL_DESCRIPTIONS]}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIMENSIONS.map((dim) => {
              const scoreKey = `${dim.key}Score` as keyof typeof result.scores
              const levelKey = `${dim.key}Level` as keyof typeof result.scores
              const score = result.scores[scoreKey] as number | null
              const level = result.scores[levelKey] as string
              const Icon = dim.icon

              return (
                <Card key={dim.key} className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-gradient-to-br from-${dim.color}-500 to-${dim.color}-600 rounded-xl shadow-lg shadow-${dim.color}-500/25`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">{dim.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">คะแนน</span>
                      <span className="text-2xl font-bold text-white">{score?.toFixed(2) || '-'}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
                        style={{ width: `${(score || 0) * 20}%` }}
                      />
                    </div>
                    <Badge className={getLevelBadgeColor(level)} variant="outline">
                      {LEVEL_LABELS[level as keyof typeof LEVEL_LABELS]}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Personal Information */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">ข้อมูลทั่วไป</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-sm">ชื่อ</label>
                  <p className="text-white font-medium">{result.formData.name || 'ไม่ระบุ'}</p>
                </div>
                <div>
                  <label className="text-slate-500 text-sm">แผนก/กลุ่มงาน</label>
                  <p className="text-white font-medium">{result.formData.department || 'ไม่ระบุ'}</p>
                </div>
                <div>
                  <label className="text-slate-500 text-sm">บทบาทหน้าที่</label>
                  <p className="text-white font-medium">{result.formData.role.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-slate-500 text-sm">ประสบการณ์การทำงาน</label>
                  <p className="text-white font-medium">{result.formData.experienceLevel.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-slate-500 text-sm">ประเภทหน่วยงาน</label>
                  <p className="text-white font-medium">{result.formData.organizationType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-slate-500 text-sm">ความถนัดดิจิทัล (ประเมินตนเอง)</label>
                  <p className="text-white font-medium">{result.formData.selfAssessedProficiency.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {(result.feedback.challenges || result.feedback.suggestions || result.feedback.trainingNeeds) && (
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">ความคิดเห็นเชิงลึก</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.feedback.challenges && (
                  <div>
                    <label className="text-slate-500 text-sm block mb-2">อุปสรรคหรือความท้าทาย</label>
                    <p className="text-white bg-slate-800/50 p-4 rounded-xl">{result.feedback.challenges}</p>
                  </div>
                )}
                {result.feedback.suggestions && (
                  <div>
                    <label className="text-slate-500 text-sm block mb-2">ข้อเสนอแนะ</label>
                    <p className="text-white bg-slate-800/50 p-4 rounded-xl">{result.feedback.suggestions}</p>
                  </div>
                )}
                {result.feedback.trainingNeeds && (
                  <div>
                    <label className="text-slate-500 text-sm block mb-2">ความต้องการด้านการอบรม</label>
                    <p className="text-white bg-slate-800/50 p-4 rounded-xl">{result.feedback.trainingNeeds}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gap Analysis */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl shadow-lg shadow-rose-500/25">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">การวิเคราะห์ช่องว่าง (Gap Analysis)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                  <span className="font-semibold text-rose-400">มิติที่คะแนนต่ำสุด</span>
                </div>
                <p className="text-2xl font-bold text-white">{result.hrdRoadmap.gapAnalysis.lowestDimension}</p>
                <p className="text-slate-400 text-sm mt-1">คะแนน: {result.hrdRoadmap.gapAnalysis.lowestScore?.toFixed(2) || '-'}</p>
              </div>

              {result.hrdRoadmap.gapAnalysis.priorityDimensions.length > 0 && (
                <div>
                  <label className="text-slate-500 text-sm block mb-2">มิติที่ต้องเร่งพัฒนา (คะแนน &lt; 3.0)</label>
                  <div className="flex flex-wrap gap-2">
                    {result.hrdRoadmap.gapAnalysis.priorityDimensions.map((dim, idx) => (
                      <Badge key={idx} className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                        {dim}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Immediate Actions */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border-amber-500/30 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">การดำเนินการทันที (Immediate Actions)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {Array.isArray(result.hrdRoadmap.immediateActions) ? (
                  result.hrdRoadmap.immediateActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="text-white">{action}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">ไม่ระบุ</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* HRD Roadmap */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg shadow-blue-500/25">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">HRD Roadmap: แผนพัฒนาทักษะดิจิทัล 3 ระยะ</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 bg-slate-800/50 p-4 rounded-xl border-l-4 border-blue-500">
                {result.hrdRoadmap.overallStrategy}
              </p>

              <div className="space-y-6">
                {result.hrdRoadmap.phases.map((phase, idx) => {
                  const PhaseIcon = getPhaseIcon(phase.phase)
                  return (
                    <div key={idx} className="relative">
                      {/* Phase connector line */}
                      {idx < result.hrdRoadmap.phases.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
                      )}

                      <Card className="bg-slate-800/50 border-slate-700 ml-4">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl shadow-lg ${
                              phase.phase === 'Phase 1' ? 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/25' :
                              phase.phase === 'Phase 2' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25' :
                              'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/25'
                            }`}>
                              <PhaseIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                  {phase.phase}
                                </Badge>
                                <Badge className={getPriorityBadgeColor(phase.priority)}>
                                  {phase.priority} priority
                                </Badge>
                              </div>
                              <CardTitle className="text-lg text-white mb-1">{phase.phaseName}</CardTitle>
                              <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {phase.timeframe}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-slate-500 text-sm block mb-2">เป้าหมาย</label>
                            <p className="text-white bg-slate-700/50 p-3 rounded-lg">{phase.goal}</p>
                          </div>
                          <div>
                            <label className="text-slate-500 text-sm block mb-2">Action Items</label>
                            <ul className="space-y-2">
                              {phase.actionItems.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-3">
                                  <div className="mt-0.5 flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                                  </div>
                                  <span className="text-slate-300">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {phase.dimensions.map((dim, dimIdx) => (
                              <Badge key={dimIdx} variant="outline" className="text-xs bg-slate-700/30 border-slate-600 text-slate-300">
                                {DIMENSIONS.find(d => d.key === dim)?.label || dim}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Recommendations */}
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl text-white">ข้อเสนอแนะตามบทบาทหน้าที่</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {Array.isArray(result.hrdRoadmap.roleSpecificRecommendations) ? (
                  result.hrdRoadmap.roleSpecificRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="text-slate-300">{rec}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">ไม่ระบุ</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownloadCSV} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-0 px-8">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
            <Link href="/assessments/new">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white px-8">
                ทำแบบประเมินใหม่
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800 text-slate-400 py-6 mt-auto backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            ระบบประเมินสมรรถนะดิจิทัล SDHP-HX
          </p>
        </div>
      </footer>
    </div>
  )
}