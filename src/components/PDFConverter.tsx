'use client'

import { useState } from 'react'
import PDFUploader from './PDFUploader'
import MarkdownPreview from './MarkdownPreview'
import { extractTextFromPDF, fileToArrayBuffer } from '../lib/pdfExtractor'
import { extractTextFromPDFSimple } from '../lib/simplePdfExtractor'
import { convertTextToMarkdown } from '../lib/markdownConverter'

type ProcessingState = 'idle' | 'processing' | 'completed' | 'error'

export default function PDFConverter() {
  const [state, setState] = useState<ProcessingState>('idle')
  const [filename, setFilename] = useState<string>('')
  const [markdown, setMarkdown] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFileSelect = async (file: File) => {
    setState('processing')
    setFilename(file.name)
    setError('')
    
    try {
      let text: string
      
      try {
        // Try PDF.js first
        const buffer = await fileToArrayBuffer(file)
        text = await extractTextFromPDF(buffer)
      } catch (pdfError) {
        console.warn('PDF.js extraction failed, using fallback:', pdfError)
        // Fallback to simple demo extraction
        text = await extractTextFromPDFSimple(file)
      }
      
      // Convert to Markdown
      const convertedMarkdown = convertTextToMarkdown(text)
      
      setMarkdown(convertedMarkdown)
      setState('completed')
    } catch (err) {
      console.error('PDF processing error:', err)
      setError('Error processing PDF. Please try again.')
      setState('error')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    
    a.href = url
    a.download = filename.replace('.pdf', '.md')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNewFile = () => {
    setState('idle')
    setFilename('')
    setMarkdown('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FormatFlow</h1>
              <p className="text-sm text-gray-600">Convert PDF documents to Markdown</p>
            </div>
            {state === 'completed' && (
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Markdown
                </button>
                <button
                  onClick={handleNewFile}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload New File
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Upload */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Upload PDF</h2>
              {filename && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filename}
                </span>
              )}
            </div>
            
            {state === 'idle' || state === 'completed' ? (
              <PDFUploader onFileSelect={handleFileSelect} />
            ) : state === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-900">Processing PDF...</p>
                <p className="text-sm text-gray-500">Extracting text and converting to Markdown</p>
              </div>
            ) : state === 'error' ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">Error Processing PDF</p>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <button
                  onClick={handleNewFile}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Try Again
                </button>
              </div>
            ) : null}
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Markdown Preview</h2>
              {state === 'completed' && (
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                  Conversion Complete
                </span>
              )}
            </div>
            
            <div className="h-full overflow-auto">
              <MarkdownPreview content={markdown} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}