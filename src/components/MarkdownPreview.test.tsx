import { render, screen } from '@testing-library/react'
import MarkdownPreview from './MarkdownPreview'

describe('MarkdownPreview', () => {
  it('should render markdown content as HTML', () => {
    const markdown = '# Hello World\n\nThis is a **bold** text.'
    render(<MarkdownPreview content={markdown} />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World')
    expect(screen.getByText('bold')).toBeInTheDocument()
  })
  
  it('should render empty state when no content', () => {
    render(<MarkdownPreview content="" />)
    
    expect(screen.getByText(/no content to preview/i)).toBeInTheDocument()
  })
  
  it('should handle lists correctly', () => {
    const markdown = `# Items
    
1. First item
2. Second item

- Bullet one
- Bullet two`
    
    render(<MarkdownPreview content={markdown} />)
    
    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByText('Bullet one')).toBeInTheDocument()
  })
  
  it('should apply custom className', () => {
    const markdown = '# Test'
    const { container } = render(<MarkdownPreview content={markdown} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
  
  it('should handle code blocks', () => {
    const markdown = '```javascript\nconsole.log("hello")\n```'
    render(<MarkdownPreview content={markdown} />)
    
    expect(screen.getByText(/console\.log\("hello"\)/)).toBeInTheDocument()
  })
  
  it('should render links correctly', () => {
    const markdown = '[Google](https://google.com)'
    render(<MarkdownPreview content={markdown} />)
    
    const link = screen.getByRole('link', { name: 'Google' })
    expect(link).toHaveAttribute('href', 'https://google.com')
  })
  
  it('should handle tables', () => {
    const markdown = `| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |`
    
    render(<MarkdownPreview content={markdown} />)
    
    expect(screen.getByText(/Name/)).toBeInTheDocument()
    expect(screen.getByText(/John/)).toBeInTheDocument()
    expect(screen.getByText(/25/)).toBeInTheDocument()
  })
})