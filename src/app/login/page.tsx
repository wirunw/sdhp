'use client'

import { useState } from 'react'

// Opt out of static optimization to prevent build-time rendering errors
export const dynamic = 'force-dynamic'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Shield, Activity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(password)

    if (result.success) {
      router.push(redirectTo)
      router.refresh()
    } else {
      setError(result.error || 'รหัสผ่านไม่ถูกต้อง')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-2">
              <Activity className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-900">SDHP Assessment</h1>
            </div>
          </Link>
          <p className="text-slate-600">เข้าสู่ระบบเพื่อดูผลการประเมิน</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle>เข้าสู่ระบบผู้ดูแล</CardTitle>
            <CardDescription>
              กรุณากรอกรหัสผ่านเพื่อดำเนินการต่อ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !password}
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-slate-600 hover:text-emerald-600">
                ← กลับหน้าหลัก
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>ระบบประเมินสมรรถนะดิจิทัล SDHP-HX</p>
          <p className="mt-1">ติดต่อผู้ดูแลระบบหากมีปัญหา</p>
        </div>
      </div>
    </div>
  )
}
