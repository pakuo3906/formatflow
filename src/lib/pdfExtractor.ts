// Configure PDF.js worker (only in browser environment)
let pdfjs: any = null

const initializePdfjs = async () => {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be used in browser environment')
  }
  
  if (!pdfjs) {
    pdfjs = await import('pdfjs-dist')
    if (pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    }
  }
  return pdfjs
}

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const pdfjsLib = await initializePdfjs()
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
    const textPages: string[] = []
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join('')
        
        textPages.push(pageText)
      } catch (pageError) {
        console.error(`Error extracting page ${pageNum}:`, pageError)
        throw new Error('Failed to extract text from PDF')
      }
    }
    
    return textPages.join('\n')
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}