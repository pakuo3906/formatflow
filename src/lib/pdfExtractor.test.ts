import { extractTextFromPDF } from './pdfExtractor'

// Mock PDF.js
jest.mock('pdfjs-dist', () => ({
  getDocument: jest.fn(),
}))

describe('pdfExtractor', () => {
  it('should extract text from PDF buffer', async () => {
    const mockPDF = {
      numPages: 2,
      getPage: jest.fn(),
    }
    
    const mockPage1 = {
      getTextContent: jest.fn().mockResolvedValue({
        items: [
          { str: 'Hello ' },
          { str: 'World' },
        ],
      }),
    }
    
    const mockPage2 = {
      getTextContent: jest.fn().mockResolvedValue({
        items: [
          { str: 'Second ' },
          { str: 'Page' },
        ],
      }),
    }
    
    mockPDF.getPage.mockResolvedValueOnce(mockPage1)
    mockPDF.getPage.mockResolvedValueOnce(mockPage2)
    
    const pdfjs = require('pdfjs-dist')
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve(mockPDF),
    })
    
    const buffer = new ArrayBuffer(1024)
    const result = await extractTextFromPDF(buffer)
    
    expect(result).toBe('Hello World\nSecond Page')
    expect(mockPDF.getPage).toHaveBeenCalledWith(1)
    expect(mockPDF.getPage).toHaveBeenCalledWith(2)
  })
  
  it('should handle PDF with no text content', async () => {
    const mockPDF = {
      numPages: 1,
      getPage: jest.fn(),
    }
    
    const mockPage = {
      getTextContent: jest.fn().mockResolvedValue({
        items: [],
      }),
    }
    
    mockPDF.getPage.mockResolvedValue(mockPage)
    
    const pdfjs = require('pdfjs-dist')
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve(mockPDF),
    })
    
    const buffer = new ArrayBuffer(1024)
    const result = await extractTextFromPDF(buffer)
    
    expect(result).toBe('')
  })
  
  it('should handle PDF extraction errors', async () => {
    const pdfjs = require('pdfjs-dist')
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.reject(new Error('Invalid PDF')),
    })
    
    const buffer = new ArrayBuffer(1024)
    
    await expect(extractTextFromPDF(buffer)).rejects.toThrow('Failed to extract text from PDF')
  })
  
  it('should handle page extraction errors', async () => {
    const mockPDF = {
      numPages: 1,
      getPage: jest.fn().mockRejectedValue(new Error('Page error')),
    }
    
    const pdfjs = require('pdfjs-dist')
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve(mockPDF),
    })
    
    const buffer = new ArrayBuffer(1024)
    
    await expect(extractTextFromPDF(buffer)).rejects.toThrow('Failed to extract text from PDF')
  })
})