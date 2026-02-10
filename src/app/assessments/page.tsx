import { redirect } from 'next/navigation'

export default function AssessmentsPage() {
  // Redirect ไปหน้า dashboard หรือสร้างการประเมินใหม่
  redirect('/assessments/new')
}
