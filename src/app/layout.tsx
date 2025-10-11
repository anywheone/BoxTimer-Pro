import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import Header from './header'
import ThemeProvider from '@/components/ThemeProvider'
import NoFlashScript from '@/components/NoFlashScript'

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
          <SidebarProvider>
            {/* 固定ヘッダー */}
            <div className="fixed top-0 left-0 right-0 h-16 flex items-center bg-sidebar border-b border-sidebar-border dark:bg-gray-800 dark:border-gray-700 z-50 px-4">
              <Header />
            </div>

            {/* ヘッダーの下にサイドバーとメインコンテンツ */}
            <div className="flex h-screen overflow-hidden">
              <AppSidebar />
              <main className="flex-1 pt-16 overflow-y-auto">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

