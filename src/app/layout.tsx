import type { Metadata } from "next";
import { Prompt, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SDHP Assessment - ระบบประเมินสมรรถนะดิจิทัล",
  description: "เครื่องมือประเมินสมรรถนะดิจิทัลสำหรับบุคลากรทางการแพทย์และสาธารณสุข ตามกรอบ SDHP-HX",
  keywords: ["SDHP", "Digital Health", "Digital Competency", "Assessment", "Healthcare", "สมรรถนะดิจิทัล", "บุคลากรสาธารณสุข"],
  authors: [{ name: "คณะผู้เข้าอบรมหลักสูตรประกาศนียบัตรผู้บริหารดิจิทัลทางการแพทย์ รุ่นที่ 1 กลุ่มที่ 6" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "SDHP Assessment - ระบบประเมินสมรรถนะดิจิทัล",
    description: "เครื่องมือประเมินสมรรถนะดิจิทัลสำหรับบุคลากรทางการแพทย์และสาธารณสุข",
    url: "/",
    siteName: "SDHP Assessment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDHP Assessment - ระบบประเมินสมรรถนะดิจิทัล",
    description: "เครื่องมือประเมินสมรรถนะดิจิทัลสำหรับบุคลากรทางการแพทย์และสาธารณสุข",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${prompt.variable} ${inter.variable} antialiased bg-background text-foreground font-prompt`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
