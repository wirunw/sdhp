'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Download, Activity, Database, BarChart3, MessageSquare, Lightbulb, Shield, CheckCircle2, AlertCircle, ArrowUpRight, Clock, Target, TrendingUp, Sparkles, Brain, Zap, BookOpen, Award, Star } from 'lucide-react'

type AssessmentDetail = {
  id: string
  name: string | null
  role: string
  experienceLevel: string
  organizationType: string
  selfAssessedProficiency: string
  createdAt: string
  results: {
    techLiteracyScore: number | null
    techLiteracyLevel: string | null
    dataAnalysisScore: number | null
    dataAnalysisLevel: string | null
    digitalCommunicationScore: number | null
    digitalCommunicationLevel: string | null
    innovationMindsetScore: number | null
    innovationMindsetLevel: string | null
    digitalEthicsScore: number | null
    digitalEthicsLevel: string | null
    overallAverageScore: number | null
    overallCompetencyLevel: string | null
  } | null
  feedback: {
    challenges: string | null
    suggestions: string | null
    trainingNeeds: string | null
  } | null
}

const DIMENSIONS = [
  { key: 'techLiteracy', name: 'การรู้เท่าทันเทคโนโลยี', short: 'TL', icon: Database, color: 'blue' },
  { key: 'dataAnalysis', name: 'การวิเคราะห์ข้อมูล', short: 'DA', icon: BarChart3, color: 'purple' },
  { key: 'digitalCommunication', name: 'การสื่อสารดิจิทัล', short: 'DC', icon: MessageSquare, color: 'emerald' },
  { key: 'innovationMindset', name: 'แนวคิดเชิงนวัตกรรม', short: 'IM', icon: Lightbulb, color: 'amber' },
  { key: 'digitalEthics', name: 'จริยธรรมดิจิทัล', short: 'DE', icon: Shield, color: 'rose' },
]

const EXPECTED_LEVELS: Record<string, any> = {
  EXECUTIVE: { techLiteracy: 3, dataAnalysis: 3.5, digitalCommunication: 3, innovationMindset: 3, digitalEthics: 4 },
  CLINICAL_STAFF: { techLiteracy: 2.5, dataAnalysis: 2.5, digitalCommunication: 3.5, innovationMindset: 3, digitalEthics: 3.5 },
  CLINICAL_SUPPORT: { techLiteracy: 2.5, dataAnalysis: 2.5, digitalCommunication: 3, innovationMindset: 3, digitalEthics: 3.5 },
  BACK_OFFICE: { techLiteracy: 2.5, dataAnalysis: 3, digitalCommunication: 2.5, innovationMindset: 3, digitalEthics: 3.5 },
  IT_SUPPORT: { techLiteracy: 4, dataAnalysis: 3.5, digitalCommunication: 3, innovationMindset: 3.5, digitalEthics: 4 },
}

export default function AssessmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    // Fetch assessment directly without authentication check
    if (params.id) {
      fetchAssessment(params.id as string)
    }
  }, [params.id])

  const fetchAssessment = async (id: string) => {
    try {
      const response = await fetch(`/api/assessments/${id}`)
      const data = await response.json()
      
      if (response.ok && data.assessment) {
        setAssessment(data.assessment)
      } else {
        console.error('Failed to fetch assessment:', data.error)
        // ไม่ redirect แต่แสดง error แทน
      }
    } catch (error) {
      console.error('Error fetching assessment:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  const getLevelColor = (level: string | null) => {
    if (!level) return 'bg-slate-800/50 text-slate-400 border-slate-700'
    const colors: Record<string, string> = {
      AWARENESS: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      LITERACY: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PROFICIENCY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      EXPERTISE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }
    return colors[level] || 'bg-slate-800/50 text-slate-400 border-slate-700'
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

  const getProgressValue = (score: number | null) => {
    if (!score) return 0
    return (score / 5) * 100
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/assessments/${params.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `SDHP-Assessment-${params.id?.slice(0, 8)}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  // Generate Development Timeline
  const generateDevelopmentTimeline = () => {
    if (!assessment || !assessment.results) return []

    const { results, role } = assessment
    const dimensions = {
      techLiteracy: results.techLiteracyScore || 0,
      dataAnalysis: results.dataAnalysisScore || 0,
      digitalCommunication: results.digitalCommunicationScore || 0,
      innovationMindset: results.innovationMindsetScore || 0,
      digitalEthics: results.digitalEthicsScore || 0,
    }

    const expected = EXPECTED_LEVELS[role] || {}

    // ระบุพื้นที่ที่ต้องพัฒนา
    const weakDimensions = Object.entries(dimensions)
      .filter(([key, score]) => score < (expected[key as keyof typeof expected] || 0) - 0.3)
      .map(([key]) => key)

    const strongDimensions = Object.entries(dimensions)
      .filter(([key, score]) => score >= (expected[key as keyof typeof expected] || 0) + 0.5)
      .map(([key]) => key)

    const timeline: Array<{
      title: string
      subtitle: string
      icon: any
      color: string
      goal: string
      activities: string[]
    }> = []

    // ระยะที่ 1: Quick Win
    const quickWinActivities: string[] = []
    if (weakDimensions.includes('digitalCommunication')) {
      quickWinActivities.push('ฝึกใช้เครื่องมือสื่อสารดิจิทัลพื้นฐาน', 'ทบทวนวิธีการสื่อสารที่เหมาะสม', 'ฝึกการเขียนอีเมลและข้อความแบบมืออาชีพ')
    }
    if (weakDimensions.includes('techLiteracy')) {
      quickWinActivities.push('เรียนรู้ฟีเจอร์พื้นฐานของระบบ', 'ฝึกใช้คีย์ลัดและเทคนิคพื้นฐาน', 'ทำความคุ้นเคยกับอุปกรณ์ดิจิทัล')
    }
    quickWinActivities.push('ร่วมอบรมหรือเวิร์กชอปด้านทักษะดิจิทัล', 'ศึกษาคู่มือการใช้งานระบบ', 'ขอคำแนะนำจากเพื่อนร่วมงาน')

    timeline.push({
      title: 'ระยะที่ 1: Quick Win',
      subtitle: 'เร่งด่วน (90 วัน)',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-500/50',
      goal: 'แก้ไขปัญหาที่เห็นได้ชัดและสร้างพื้นฐาน',
      activities: quickWinActivities.slice(0, 5),
    })

    // ระยะที่ 2: Upskill
    const upskillActivities: string[] = []
    if (weakDimensions.includes('dataAnalysis')) {
      upskillActivities.push('เรียนรู้การวิเคราะห์ข้อมูลขั้นสูง', 'ฝึกใช้ข้อมูลเพื่อการตัดสินใจ', 'เรียนรู้การสร้าง Dashboard')
    }
    if (weakDimensions.includes('digitalCommunication')) {
      upskillActivities.push('ฝึกการสื่อสารข้ามแผนก', 'เรียนรู้การใช้เครื่องมือร่วมงาน', 'พัฒนาทักษะการนำเสนอผ่านดิจิทัล')
    }
    if (strongDimensions.length > 0) {
      upskillActivities.push('พัฒนาทักษะที่เก่งให้แข็งแกร่ง', 'เตรียมตัวเป็น Digital Champion', 'แบ่งปันความรู้ให้เพื่อนร่วมงาน')
    }
    upskillActivities.push('เข้าร่วมหลักสูตรการอบรมดิจิทัล', 'ลองประยุกต์ใช้เทคโนโลยีใหม่', 'ร่วมโครงการพัฒนาระบบดิจิทัล')

    timeline.push({
      title: 'ระยะที่ 2: Upskill',
      subtitle: 'พัฒนาทักษะเฉพาะทาง (6 เดือน)',
      icon: Target,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 hover:border-blue-500/50',
      goal: 'เพิ่มขีดความสามารถในพื้นที่ที่ต้องการ',
      activities: upskillActivities.slice(0, 5),
    })

    // ระยะที่ 3: System-level
    const systemActivities = [
      'มีส่วนร่วมในการออกแบบระบบดิจิทัล',
      'สร้างวัฒนธรรมนวัตกรรมดิจิทัลในทีมงาน',
      'ใช้ข้อมูลเชิงลึกปรับปรุงกระบวนการ',
      'เชื่อมโยงและบูรณาการข้อมูลระหว่างระบบ',
      'ส่งเสริมจริยธรรมดิจิทัล',
      'ร่วมพัฒนามาตรฐานดิจิทัลขององค์กร',
    ]

    if (role === 'EXECUTIVE' || role === 'IT_SUPPORT') {
      systemActivities.unshift('กำหนดนโยบายดิจิทัลขององค์กร', 'สร้าง Data Governance และมาตรฐานข้อมูล', 'วางแผนการเชื่อมต่อระบบ')
    }

    timeline.push({
      title: 'ระยะที่ 3: System-level',
      subtitle: 'ยกระดับระบบ (12 เดือน)',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50',
      goal: 'ยกระดับมาตรฐานและสร้างวัฒนธรรมดิจิทัล',
      activities: systemActivities.slice(0, 5),
    })

    return timeline
  }

  // Show loading while fetching assessment data
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center relative z-10">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-2xl shadow-emerald-500/30 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <Activity className="h-10 w-10 text-white animate-pulse" />
          </div>
          <p className="text-slate-400 text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center max-w-md p-8 relative z-10">
          <div className="p-4 bg-rose-500/20 rounded-2xl mx-auto mb-6 w-20 h-20 flex items-center justify-center border border-rose-500/30">
            <AlertCircle className="h-10 w-10 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">ไม่พบข้อมูลการประเมิน</h2>
          <p className="text-slate-400 mb-6">ไม่สามารถโหลดข้อมูลการประเมินนี้ได้ หรือข้อมูลอาจถูกลบไปแล้ว</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-0">
                กลับสู่ Dashboard
              </Button>
            </Link>
            <Link href="/assessments/new">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600">
                ประเมินใหม่
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const expectedLevels = EXPECTED_LEVELS[assessment.role] || {}

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
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
                  <p className="text-xs text-slate-400">Digital Competency Assessment</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleDownload} className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                <Download className="mr-2 h-4 w-4" />
                ดาวน์โหลดรายงาน
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Overall Score */}
          <Card className="mb-8 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">สรุปผลการประเมิน</CardTitle>
              <CardDescription className="text-slate-400">
                {assessment.name || `การประเมิน #${assessment.id.slice(0, 8)}`} •{' '}
                {new Date(assessment.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20" />
                  <div className="relative p-8 text-center">
                    <Sparkles className="h-8 w-8 text-white/80 mx-auto mb-4" />
                    <p className="text-sm text-white/90 mb-3 font-medium tracking-wide">ระดับสมรรถนะโดยรวม</p>
                    <div className="text-6xl font-bold text-white mb-3 drop-shadow-lg">
                      {assessment.results?.overallCompetencyLevel ? getLevelName(assessment.results.overallCompetencyLevel).split(' ')[0] : '-'}
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 transition-all" variant="secondary">
                      {getLevelName(assessment.results?.overallCompetencyLevel ?? null)}
                    </Badge>
                    {assessment.results?.overallAverageScore && (
                      <div className="mt-5 pt-5 border-t border-white/20">
                        <p className="text-3xl font-bold text-white drop-shadow-sm">
                          {assessment.results.overallAverageScore.toFixed(2)}
                          <span className="text-lg font-normal text-white/80">/5.00</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20 hover:shadow-lg hover:border-blue-500/30 transition-all">
                    <p className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">บทบาทหน้าที่</p>
                    <p className="text-lg font-semibold text-white">{getRoleName(assessment.role)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20 hover:shadow-lg hover:border-purple-500/30 transition-all">
                    <p className="text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wide">ประสบการณ์การทำงาน</p>
                    <p className="text-lg font-semibold text-white">{assessment.experienceLevel.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20 hover:shadow-lg hover:border-amber-500/30 transition-all">
                    <p className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wide">ความถนัดดิจิทัล (ประเมินตนเอง)</p>
                    <p className="text-lg font-semibold text-white">{assessment.selfAssessedProficiency.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <Card className="mb-8 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">คะแนนรายมิติ</CardTitle>
              <CardDescription className="text-slate-400">
                คะแนนใน 5 มิติสมรรถนะดิจิทัล
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DIMENSIONS.map((dim) => {
                  const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                  const level = assessment.results?.[`${dim.key}Level` as keyof typeof assessment.results] as string | null
                  const expected = expectedLevels[dim.key] || 0
                  const passed = score && score >= expected

                  const Icon = dim.icon
                  const colorClass = passed ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10' : 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/10'

                  return (
                    <div key={dim.key} className={`border-2 rounded-xl p-5 space-y-4 hover:shadow-2xl transition-all duration-300 ${colorClass}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                            <Icon className={`h-5 w-5 ${passed ? 'text-emerald-400' : 'text-amber-400'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-white">{dim.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{dim.short}</p>
                          </div>
                        </div>
                        {passed ? (
                          <div className="p-2 bg-emerald-500/20 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="p-2 bg-amber-500/20 rounded-full">
                            <AlertCircle className="h-5 w-5 text-amber-400" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 font-medium">คะแนน</span>
                          <span className="font-bold text-lg text-white">{score ? score.toFixed(2) : '-'}</span>
                        </div>
                        <Progress value={getProgressValue(score)} className={`h-3 ${passed ? 'bg-emerald-950' : 'bg-amber-950'}`} />
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <Badge className={`${getLevelColor(level)} text-xs px-3 py-1 font-medium`} variant="secondary">
                          {getLevelName(level)}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium bg-slate-800/50 px-2 py-1 rounded">
                          คาดหวัง: {expected.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-emerald-500/20 shadow-2xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <Star className="h-5 w-5 text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg text-emerald-400">จุดแข็ง</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DIMENSIONS
                    .filter(dim => {
                      const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                      const expected = expectedLevels[dim.key] || 0
                      return score && score >= expected + 0.5
                    })
                    .map((dim) => {
                      const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                      const Icon = dim.icon
                      return (
                        <div key={dim.key} className="flex items-center gap-3 p-4 bg-slate-800/50 border border-emerald-500/20 rounded-xl hover:bg-slate-800 transition-all">
                          <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-white">{dim.name}</p>
                            <p className="text-xs text-emerald-400 font-medium">
                              {score?.toFixed(2)} คะแนน - เกินเกณฑ์
                            </p>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                        </div>
                      )
                    })}
                  {DIMENSIONS.filter(dim => {
                    const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                    const expected = expectedLevels[dim.key] || 0
                    return score && score >= expected + 0.5
                  }).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      ยังไม่พบจุดแข็งที่เด่นชัด
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 backdrop-blur-xl border-amber-500/20 shadow-2xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 rounded-xl">
                    <Target className="h-5 w-5 text-amber-400" />
                  </div>
                  <CardTitle className="text-lg text-amber-400">พื้นที่ที่ต้องพัฒนา</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DIMENSIONS
                    .filter(dim => {
                      const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                      const expected = expectedLevels[dim.key] || 0
                      return score && score < expected
                    })
                    .map((dim) => {
                      const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                      const expected = expectedLevels[dim.key] || 0
                      const Icon = dim.icon
                      return (
                        <div key={dim.key} className="flex items-center gap-3 p-4 bg-slate-800/50 border border-amber-500/20 rounded-xl hover:bg-slate-800 transition-all">
                          <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-white">{dim.name}</p>
                            <p className="text-xs text-amber-400 font-medium">
                              {score?.toFixed(2)} / {expected.toFixed(1)} คะแนน
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  {DIMENSIONS.filter(dim => {
                    const score = assessment.results?.[`${dim.key}Score` as keyof typeof assessment.results] as number | null
                    const expected = expectedLevels[dim.key] || 0
                    return score && score < expected
                  }).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      ผ่านเกณฑ์ทุกมิติ 🎉
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Section */}
          {assessment.feedback && (assessment.feedback.challenges || assessment.feedback.suggestions || assessment.feedback.trainingNeeds) && (
            <Card className="mb-8 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">ความคิดเห็นและข้อเสนอแนะ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessment.feedback.challenges != null && (
                  <div>
                    <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      อุปสรรคและความท้าทาย
                    </h4>
                    <p className="text-sm text-slate-300 bg-red-500/10 border border-red-500/20 p-4 rounded-xl leading-relaxed">
                      {assessment.feedback.challenges}
                    </p>
                  </div>
                )}
                {assessment.feedback.suggestions != null && (
                  <div>
                    <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ข้อเสนอแนะ
                    </h4>
                    <p className="text-sm text-slate-300 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl leading-relaxed">
                      {assessment.feedback.suggestions}
                    </p>
                  </div>
                )}
                {assessment.feedback.trainingNeeds != null && (
                  <div>
                    <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      ความต้องการด้านการอบรม
                    </h4>
                    <p className="text-sm text-slate-300 bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl leading-relaxed">
                      {assessment.feedback.trainingNeeds}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Development Timeline */}
          <Card className="mb-8 bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">แนวทางการพัฒนาแบบ 3 ระยะ</CardTitle>
              <CardDescription className="text-slate-400">
                Roadmap สำหรับการพัฒนาสมรรถนะดิจิทัลตามกรอบ SDHP-HX
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {generateDevelopmentTimeline().map((phase, index) => {
                  const Icon = phase.icon
                  return (
                    <div key={index} className={`border-2 rounded-xl p-6 bg-gradient-to-br ${phase.color} hover:shadow-2xl transition-all duration-300`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-4 rounded-xl shadow-lg ${phase.color.split(' ')[0].replace('/20', '/30')}`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{phase.title}</h3>
                          <p className="text-sm font-medium text-white/90">{phase.subtitle}</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/10">
                        <p className="text-base leading-relaxed text-white">
                          <strong className="font-semibold text-emerald-400">เป้าหมาย:</strong> {phase.goal}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-3 text-white">กิจกรรมที่แนะนำ:</p>
                        <ul className="space-y-3">
                          {phase.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-3 bg-slate-900/30 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                              <span className="text-xl font-bold text-emerald-400">•</span>
                              <span className="leading-relaxed text-slate-300">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8 mb-8">
            <Link href="/assessments/new">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all">
                <Activity className="mr-2 h-4 w-4" />
                ประเมินใหม่
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-0">
                กลับสู่ Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800 text-slate-400 py-8 mt-auto backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold">SDHP Assessment</span>
          </div>
          <p className="text-sm leading-relaxed mb-2">
            ระบบประเมินสมรรถนะดิจิทัล SDHP-HX
          </p>
          <p className="text-xs text-slate-500">
            พัฒนาตามกรอบ SDHP-HX (Smart Digital Health People Hybrid-Expanded)
          </p>
        </div>
      </footer>
    </div>
  )
}