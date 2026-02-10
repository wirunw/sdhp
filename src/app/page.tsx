'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Database, MessageSquare, Lightbulb, Shield, ArrowRight, Users, BarChart3, Clock, BookOpen, Award, Target, GraduationCap, Sparkles, Zap, CheckCircle2, TrendingUp, Brain } from 'lucide-react'

export default function Home() {
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  SDHP Assessment
                </h1>
                <p className="text-xs text-slate-400">Digital Competency for Healthcare</p>
              </div>
            </div>
            <Link href="/assessments/new">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 border-0">
                <Sparkles className="mr-2 h-4 w-4" />
                เริ่มประเมิน
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-slate-800/50 text-emerald-400 border-emerald-500/30 hover:bg-slate-800/50 shadow-lg backdrop-blur-sm">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            สำหรับบุคลากรทางการแพทย์และสาธารณสุข
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">ประเมินสมรรถนะดิจิทัล</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              กรอบ SDHP-HX
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            เครื่องมือประเมินสมรรถนะบุคลากรสาธารณสุขยุคดิจิทัล
            <br className="hidden md:block" />
            ครอบคลุม 5 มิติสำคัญ เพื่อการพัฒนาทักษะอย่างเป็นระบบ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessments/new">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl shadow-emerald-500/30 border-0 h-auto">
                <Activity className="mr-2.5 h-5 w-5" />
                เริ่มทำแบบประเมิน
                <ArrowRight className="ml-2.5 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 h-auto backdrop-blur-sm">
                <BarChart3 className="mr-2.5 h-5 w-5" />
                ดูผลการประเมิน
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-12 border-t border-slate-800">
            <StatItem icon={<Clock className="h-5 w-5" />} value="15-20" label="นาที" />
            <StatItem icon={<CheckCircle2 className="h-5 w-5" />} value="25" label="ข้อคำถาม" />
            <StatItem icon={<Sparkles className="h-5 w-5" />} value="5" label="มิติสมรรถนะ" />
          </div>
        </div>
      </section>

      {/* 5 Dimensions */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">
              <Brain className="mr-1.5 h-3.5 w-3.5" />
              กรอบ SDHP-HX
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              5 มิติสมรรถนะดิจิทัล
            </h3>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              ประเมินตามกรอบ Smart Digital Health People Hybrid-Expanded (SDHP-HX)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DimensionCard
              icon={<Database className="h-8 w-8" />}
              title="การรู้เท่าทันเทคโนโลยี"
              subtitle="Tech Literacy (TL)"
              description="การเลือกใช้เครื่องมือดิจิทัลให้เหมาะสมกับภารกิจ"
              color="blue"
              features={['เลือกเครื่องมือ', 'ปรับใช้', 'แก้ไขปัญหา']}
            />
            <DimensionCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="การวิเคราะห์ข้อมูล"
              subtitle="Data Analysis (DA)"
              description="การใช้ข้อมูลสุขภาพเพื่อสนับสนุนการตัดสินใจ"
              color="purple"
              features={['วิเคราะห์', 'ตัดสินใจ', 'ปรับปรุง']}
            />
            <DimensionCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="การสื่อสารดิจิทัล"
              subtitle="Digital Communication (DC)"
              description="การสื่อสารในองค์กรและกับประชาชนผ่านช่องทางดิจิทัล"
              color="emerald"
              features={['ทีมงาน', 'ผู้ป่วย', 'สาธารณะ']}
            />
            <DimensionCard
              icon={<Lightbulb className="h-8 w-8" />}
              title="แนวคิดเชิงนวัตกรรม"
              subtitle="Innovation Mindset (IM)"
              description="การคิดค้นแนวทางใหม่ๆ เพื่อแก้ปัญหาหรือยกระดับบริการ"
              color="amber"
              features={['คิดใหม่', 'ทดลอง', 'ประยุกต์']}
            />
            <DimensionCard
              icon={<Shield className="h-8 w-8" />}
              title="จริยธรรมดิจิทัล"
              subtitle="Digital Ethics (DE)"
              description="ความตระหนักเรื่องความเป็นส่วนตัวของผู้ป่วยและจรรยาบรรณ"
              color="rose"
              features={['ความเป็นส่วนตัว', 'จริยธรรม', 'ปฏิบัติตาม']}
            />
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 to-blue-950/30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-800/50 text-purple-400 border-purple-500/30">
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              เกี่ยวกับโครงการ
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              รายงาน Capstone Project
            </h3>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              หลักสูตรประกาศนียบัตรผู้บริหารดิจิทัลทางการแพทย์ รุ่นที่ 1 กลุ่มที่ 6 ปีการศึกษา 2568
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <ProjectCard
              icon={<Award className="h-12 w-12 text-emerald-400" />}
              title="ประเภทโครงงาน"
              description="งานเสนอแนะแนวทางหรือนโยบาย (Policy Advocacy)"
              highlight="Human Capital: Digital Health"
              color="emerald"
            />
            <ProjectCard
              icon={<Target className="h-12 w-12 text-blue-400" />}
              title="วัตถุประสงค์"
              description="ประเมินและพัฒนาสมรรถนะดิจิทัลของบุคลากรทางการแพทย์และสาธารณสุข"
              highlight=""
              color="blue"
            />
            <ProjectCard
              icon={<GraduationCap className="h-12 w-12 text-purple-400" />}
              title="กรอบ SDHP-HX"
              description="ใช้กรอบ Smart Digital Health People Hybrid-Expanded สำหรับการประเมิน"
              highlight=""
              color="purple"
            />
          </div>

          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">ภาพรวมโครงการ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-3 text-lg">
                  <Activity className="h-6 w-6 text-emerald-400" />
                  ปัญหาที่พบเจอ
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  การเปลี่ยนผ่านสู่ยุคดิจิทัลที่เกิดขึ้นอย่างรวดเร็ว ส่งผลให้บุคลากรต้องปรับตัวเข้าสู่การใช้งานที่มีเทคโนโลยี
                  ทำให้การพัฒนาทักษะดิจิทัลเป็นความจำเป็นและเร่งด่วนขึ้น
                </p>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                  <Shield className="h-6 w-6 text-blue-400" />
                  สิ่งที่สำคัญของโครงการ
                </h4>
                <ul className="space-y-4">
                  {[
                    { icon: <CheckCircle2 className="h-5 w-5" />, text: 'การประเมินที่ถูกต้อง: ใช้กรอบ SDHP ที่ผ่านการตรวจสอบคุณภาพและความเที่ยงตรง' },
                    { icon: <TrendingUp className="h-5 w-5" />, text: 'แนวทางพัฒนา: แบ่งเป็น 3 ระยะ (Quick Win, Upskill, System-level) ตามความต้องการ' },
                    { icon: <Users className="h-5 w-5" />, text: 'ความสอดคล้อง: ครอบคลุม 5 กลุ่มบทบาทหน้าที่ของบุคลากรในระบบสุขภาพ' },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-0.5">{item.icon}</span>
                      <span className="text-slate-400"><strong className="text-white">{item.text.split(':')[0]}</strong>{item.text.split(':')[1]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Assessment Info */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                ทำไมต้องประเมิน<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  สมรรถนะดิจิทัล?
                </span>
              </h3>
              <div className="space-y-6">
                {[
                  { icon: <Clock className="h-6 w-6" />, title: 'ใช้เวลาเพียง 15-20 นาที', desc: 'แบบประเมิน 25 ข้อคำถามสถานการณ์จำลอง' },
                  { icon: <Users className="h-6 w-6" />, title: 'ปรับให้เหมาะกับบทบาท', desc: 'ครอบคลุม 5 กลุ่มบทบาทหน้าที่ของบุคลากร' },
                  { icon: <Zap className="h-6 w-6" />, title: 'ผลลัพธ์ทันที', desc: 'รู้ผลการประเมินและคำแนะนำการพัฒนาทันที' },
                  { icon: <Shield className="h-6 w-6" />, title: 'ความเป็นส่วนตัว', desc: 'ข้อมูลของคุณจะถูกเก็บเป็นความลับ' },
                ].map((item, idx) => (
                  <FeatureItem key={idx} icon={item.icon} title={item.title} description={item.desc} />
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 border border-slate-700 shadow-2xl">
              <h4 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-emerald-400" />
                ระดับสมรรถนะที่วัดได้
              </h4>
              <div className="space-y-4">
                {[
                  { level: 'AWARENESS', name: 'ระดับตระหนัก', desc: 'ตระหนักถึงความสำคัญและปฏิบัติตามคำสั่งพื้นฐาน', color: 'slate' },
                  { level: 'LITERACY', name: 'ระดับรู้ความสามารถ', desc: 'ใช้งานระบบงานดิจิทัลพื้นฐานได้ด้วยตนเอง', color: 'blue' },
                  { level: 'PROFICIENCY', name: 'ระดับชำนาญ', desc: 'มีความเชี่ยวชาญ สามารถประยุกต์ใช้และให้คำแนะนำ', color: 'emerald' },
                  { level: 'EXPERTISE', name: 'ระดับเชี่ยวชาญ', desc: 'มีความเชี่ยวชาญขั้สูง ออกแบบกระบวนงานและระบบ', color: 'purple' },
                ].map((item, idx) => (
                  <LevelBadge key={idx} level={item.level} name={item.name} description={item.desc} color={item.color} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            พร้อมที่จะประเมินสมรรถนะดิจิทัลของคุณหรือยัง?
          </h3>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            เริ่มต้นวัดสมรรถนะและรับแนวทางการพัฒนาที่เหมาะสมกับคุณ
          </p>
          <Link href="/assessments/new">
            <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl shadow-emerald-500/30 border-0 h-auto">
              <Sparkles className="mr-2.5 h-5 w-5" />
              เริ่มทำแบบประเมินฟรี
              <ArrowRight className="ml-2.5 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold">SDHP Assessment</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            ระบบประเมินสมรรถนะดิจิทัลสำหรับบุคลากรทางการแพทย์
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            พัฒนาตามกรอบ SDHP-HX (Smart Digital Health People Hybrid-Expanded)
            <br />
            หลักสูตรประกาศนียบัตรผู้บริหารดิจิทัลทางการแพทย์ รุ่นที่ 1 กลุ่มที่ 6 ปีการศึกษา 2568
          </p>
        </div>
      </footer>
    </div>
  )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="p-3 bg-slate-800/50 rounded-xl mb-2 text-emerald-400">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  )
}

function DimensionCard({ icon, title, subtitle, description, color, features }: {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  color: string
  features: string[]
}) {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:border-purple-500/40',
    emerald: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/20 hover:border-amber-500/40',
    rose: 'from-rose-500/10 to-rose-600/10 border-rose-500/20 hover:border-rose-500/40',
  }

  const iconClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400',
  }

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} hover:shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm group`}>
      <CardHeader>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${iconClasses[color as keyof typeof iconClasses]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">{title}</CardTitle>
        <CardDescription className="font-medium text-emerald-400 text-sm">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400 bg-slate-900/50">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({ icon, title, description, highlight, color }: {
  icon: React.ReactNode
  title: string
  description: string
  highlight: string
  color: string
}) {
  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:shadow-2xl hover:border-slate-700 transition-all duration-300 group">
      <CardHeader>
        <div className="p-4 bg-slate-800/50 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        {highlight && (
          <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            {highlight}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

function FeatureItem({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
      <div className="flex-shrink-0 mt-1 text-emerald-400">{icon}</div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  )
}

function LevelBadge({ level, name, description, color }: { 
  level: string, 
  name: string, 
  description: string,
  color: string
}) {
  const levelColors = {
    slate: 'bg-slate-800/50 text-slate-400 border-slate-700',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
      <Badge className={`${levelColors[color as keyof typeof levelColors]} whitespace-nowrap font-mono text-xs px-3 py-1`}>
        {level}
      </Badge>
      <div>
        <p className="text-sm font-semibold text-white mb-1">{name}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  )
}