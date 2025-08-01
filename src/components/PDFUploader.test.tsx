import { render, screen, fireEvent } from '@testing-library/react'
import PDFUploader from './PDFUploader'

describe('PDFUploader', () => {
  it('should render file upload area', () => {
    render(<PDFUploader onFileSelect={jest.fn()} />)
    
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
    expect(screen.getByText(/pdf file/i)).toBeInTheDocument()
  })

  it('should accept PDF files only', () => {
    render(<PDFUploader onFileSelect={jest.fn()} />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    expect(fileInput).toHaveAttribute('accept', '.pdf')
  })

  it('should call onFileSelect when PDF file is selected', () => {
    const mockOnFileSelect = jest.fn()
    render(<PDFUploader onFileSelect={mockOnFileSelect} />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(mockOnFileSelect).toHaveBeenCalledWith(file)
  })

  it('should not accept non-PDF files', () => {
    const mockOnFileSelect = jest.fn()
    render(<PDFUploader onFileSelect={mockOnFileSelect} />)
    
    const fileInput = screen.getByLabelText(/choose file/i)
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(mockOnFileSelect).not.toHaveBeenCalled()
    expect(screen.getByText(/please select a pdf file/i)).toBeInTheDocument()
  })

  it('should handle drag and drop', () => {
    const mockOnFileSelect = jest.fn()
    render(<PDFUploader onFileSelect={mockOnFileSelect} />)
    
    const dropZone = screen.getByTestId('drop-zone')
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })
    
    expect(mockOnFileSelect).toHaveBeenCalledWith(file)
  })
})