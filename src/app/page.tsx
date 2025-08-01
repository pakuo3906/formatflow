'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// PDFConverterをクライアントサイドのみで読み込み
const PDFConverter = dynamic(() => import('@/components/PDFConverter'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-900">Loading FormatFlow...</p>
      </div>
    </div>
  )
})

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Loading FormatFlow...</p>
        </div>
      </div>
    }>
      <PDFConverter />
    </Suspense>
  )
}
