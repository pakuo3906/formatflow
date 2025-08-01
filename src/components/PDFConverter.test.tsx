import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import PDFConverter from './PDFConverter'
import { extractTextFromPDF } from '../lib/pdfExtractor'
import { convertTextToMarkdown } from '../lib/markdownConverter'

// Mock the PDF extraction and markdown conversion
jest.mock('../lib/pdfExtractor')
jest.mock('../lib/markdownConverter')

const mockExtractTextFromPDF = extractTextFromPDF as jest.MockedFunction<typeof extractTextFromPDF>
const mockConvertTextToMarkdown = convertTextToMarkdown as jest.MockedFunction<typeof convertTextToMarkdown>

describe('PDFConverter', () => {
  beforeEach(() => {
    mockExtractTextFromPDF.mockClear()
    mockConvertTextToMarkdown.mockClear()
  })

  it('should render upload area initially', () => {
    render(<PDFConverter />)
    
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
    expect(screen.getByText(/no content to preview/i)).toBeInTheDocument()
  })

  it('should show processing state when file is uploaded', async () => {
    mockExtractTextFromPDF.mockResolvedValueOnce('Extracted text')
    mockConvertTextToMarkdown.mockReturnValueOnce('# Extracted text')

    render(<PDFConverter />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText(/processing/i)).toBeInTheDocument()
  })

  it('should extract text and convert to markdown when PDF is uploaded', async () => {
    const mockText = 'CHAPTER 1: Introduction\nThis is the first chapter.'
    const mockMarkdown = '# CHAPTER 1: Introduction\n\nThis is the first chapter.'
    
    mockExtractTextFromPDF.mockResolvedValueOnce(mockText)
    mockConvertTextToMarkdown.mockReturnValueOnce(mockMarkdown)

    render(<PDFConverter />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })
    
    await waitFor(() => {
      expect(mockExtractTextFromPDF).toHaveBeenCalledWith(expect.any(ArrayBuffer))
      expect(mockConvertTextToMarkdown).toHaveBeenCalledWith(mockText)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/CHAPTER 1: Introduction/)).toBeInTheDocument()
    })
  })

  it('should show error message when PDF processing fails', async () => {
    mockExtractTextFromPDF.mockRejectedValueOnce(new Error('PDF processing failed'))

    render(<PDFConverter />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText(/error processing pdf/i)).toBeInTheDocument()
    })
  })

  it('should show download button when conversion is complete', async () => {
    mockExtractTextFromPDF.mockResolvedValueOnce('Test text')
    mockConvertTextToMarkdown.mockReturnValueOnce('# Test text')

    render(<PDFConverter />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download markdown/i })).toBeInTheDocument()
    })
  })

  it('should allow uploading a new file after conversion', async () => {
    mockExtractTextFromPDF.mockResolvedValueOnce('First text')
    mockConvertTextToMarkdown.mockReturnValueOnce('# First text')

    render(<PDFConverter />)
    
    // First upload
    const fileInput = screen.getByLabelText(/choose file/i)
    const file1 = new File(['test1'], 'test1.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file1] } })
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('First text')
    }, { timeout: 3000 })
    
    // Second upload
    mockExtractTextFromPDF.mockResolvedValueOnce('Second text')
    mockConvertTextToMarkdown.mockReturnValueOnce('# Second text')
    
    const file2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file2] } })
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Second text')
    }, { timeout: 3000 })
  })

  it('should show filename in the interface', async () => {
    mockExtractTextFromPDF.mockResolvedValueOnce('Test content')
    mockConvertTextToMarkdown.mockReturnValueOnce('# Test content')

    render(<PDFConverter />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument()
    })
  })
})