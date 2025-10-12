import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import Header from './header'
import ThemeProvider from '@/components/ThemeProvider'
import NoFlashScript from '@/components/NoFlashScript'
import { SidebarPositionProvider } from '@/contexts/SidebarPositionContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BoxTimer Pro',
  description: 'A professional timer application built with Next.js',
  icons: {
    icon: '/BoxTimer_Logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <NoFlashScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SidebarPositionProvider>
            <SidebarProvider defaultOpen={false}>
              {/* 固定ヘッダー */}
              <div className="fixed top-0 left-0 right-0 h-16 flex items-center bg-sidebar border-b border-sidebar-border dark:bg-gray-800 dark:border-gray-700 z-50 pl-4 header-padding-adjust overflow-visible">
                <Header />
              </div>

              {/* ヘッダーの下にサイドバーとメインコンテンツ */}
              <div className="flex min-h-screen">
                <AppSidebar />
                <main className="flex-1 min-w-0 pt-16">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </SidebarPositionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

