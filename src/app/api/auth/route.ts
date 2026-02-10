import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = 'mdx1'
const AUTH_COOKIE_NAME = 'sdhp_auth'
const AUTH_COOKIE_VALUE = 'authenticated'

// POST: Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'กรุณาระบุรหัสผ่าน' },
        { status: 400 }
      )
    }

    if (password === ADMIN_PASSWORD) {
      // Set auth cookie
      const cookieStore = await cookies()
      cookieStore.set({
        name: AUTH_COOKIE_NAME,
        value: AUTH_COOKIE_VALUE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    )
  }
}

// DELETE: Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE_NAME)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    )
  }
}

// GET: Check auth status
export async function GET() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME)

    const isAuthenticated = authCookie?.value === AUTH_COOKIE_VALUE

    return NextResponse.json({ authenticated: isAuthenticated })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
