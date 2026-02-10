'use client'

import { useEffect, useState } from 'react'

// Opt out of static optimization to prevent build-time rendering errors
export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Calendar, ArrowLeft, Plus, FileText, TrendingUp, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Assessment = {
  id: string
  name: string | null
  role: string
  organizationType: string
  createdAt: string
  results: {
    overallCompetencyLevel: string | null
    overallAverageScore: number | null
  } | null
}

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    // Only fetch assessments if authenticated
    if (isAuthenticated && !isLoading) {
      fetchAssessments()
    }
  }, [isAuthenticated, isLoading])

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/assessments')
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.assessments || [])
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
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

  const getLevelColor = (level: string | null) => {
    if (!level) return 'bg-slate-100 text-slate-700'
    const colors: Record<string, string> = {
      AWARENESS: 'bg-slate-100 text-slate-700',
      LITERACY: 'bg-blue-100 text-blue-700',
      PROFICIENCY: 'bg-emerald-100 text-emerald-700',
      EXPERTISE: 'bg-purple-100 text-purple-700',
    }
    return colors[level] || 'bg-slate-100 text-slate-700'
  }

  const getLevelName = (level: string | null) => {
    if (!level) return 'ยังไม่ประเมิน'
    const names: Record<string, string> = {
      AWARENESS: 'ระดับตระหนัก (A)',
      LITERACY: 'ระดับรู้ความสามารถ (L)',
      PROFICIENCY: 'ระดับชำนาญ (P)',
      EXPERTISE: 'ระดับเชี่ยวชาญ (E)',
    }
    return names[level] || level
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-xs text-slate-500">ผลการประเมินทั้งหมด</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </Button>
              <Link href="/assessments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  ประเมินใหม่
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-500">กำลังตรวจสอบสิทธิ์...</p>
            </div>
          ) : !isAuthenticated ? (
            null // AuthProvider will handle redirect
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">จำนวนการประเมินทั้งหมด</CardTitle>
                    <FileText className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assessments.length}</div>
                    <p className="text-xs text-slate-500">รายการ</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">เฉลี่ยคะแนนรวม</CardTitle>
                    <TrendingUp className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {assessments.length > 0 && assessments.filter(a => a.results?.overallAverageScore).length > 0
                        ? (assessments
                            .filter(a => a.results?.overallAverageScore)
                            .reduce((sum, a) => sum + (a.results?.overallAverageScore || 0), 0) /
                            assessments.filter(a => a.results?.overallAverageScore).length
                          ).toFixed(2)
                        : '-'}
                    </div>
                    <p className="text-xs text-slate-500">จาก {assessments.filter(a => a.results).length} รายการที่มีผลลัพธ์</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ระดับสมรรถนะสูงสุด</CardTitle>
                    <Activity className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {assessments.length > 0 && assessments.filter(a => a.results?.overallCompetencyLevel).length > 0
                        ? getLevelName(assessments
                            .filter(a => a.results?.overallCompetencyLevel)
                            .sort((a, b) => {
                              const order = { AWARENESS: 1, LITERACY: 2, PROFICIENCY: 3, EXPERTISE: 4 }
                              return order[b.results?.overallCompetencyLevel as keyof typeof order] -
                                     order[a.results?.overallCompetencyLevel as keyof typeof order]
                            })[0].results?.overallCompetencyLevel ?? null)
                        : '-'}
                    </div>
                    <p className="text-xs text-slate-500">จากทุกการประเมิน</p>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment List */}
              <Card>
                <CardHeader>
                  <CardTitle>รายการการประเมิน</CardTitle>
                  <CardDescription>
                    ประวัติการประเมินสมรรถนะดิจิทัลทั้งหมด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fetchLoading ? (
                    <div className="text-center py-8 text-slate-500">กำลังโหลด...</div>
                  ) : assessments.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">ยังไม่มีการประเมิน</p>
                      <Link href="/assessments/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          เริ่มประเมินครั้งแรก
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900">
                                {assessment.name || `การประเมิน #${assessment.id.slice(0, 8)}`}
                              </h3>
                              <Badge variant="outline">{getRoleName(assessment.role)}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(assessment.createdAt).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                              {assessment.results?.overallAverageScore && (
                                <span>คะแนนเฉลี่ย: {assessment.results.overallAverageScore.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {assessment.results?.overallCompetencyLevel && (
                              <Badge className={getLevelColor(assessment.results.overallCompetencyLevel)}>
                                {getLevelName(assessment.results.overallCompetencyLevel)}
                              </Badge>
                            )}
                            <Link href={`/assessments/${assessment.id}`}>
                              <Button variant="outline" size="sm">
                                ดูผลลัพธ์
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            ระบบประเมินสมรรถนะดิจิทัล SDHP-HX
          </p>
        </div>
      </footer>
    </div>
  )
}
