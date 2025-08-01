import { convertTextToMarkdown } from './markdownConverter'

describe('markdownConverter', () => {
  it('should convert basic text to markdown', () => {
    const text = 'This is a simple text.'
    const result = convertTextToMarkdown(text)
    
    expect(result).toBe('This is a simple text.')
  })
  
  it('should detect and convert headings', () => {
    const text = `CHAPTER 1: INTRODUCTION
This is the content of chapter 1.

Section 1.1: Overview
This is the overview section.`
    
    const result = convertTextToMarkdown(text)
    
    expect(result).toContain('# CHAPTER 1: INTRODUCTION')
    expect(result).toContain('## Section 1.1: Overview')
  })
  
  it('should preserve paragraphs', () => {
    const text = `First paragraph.

Second paragraph with multiple sentences. This is still the same paragraph.

Third paragraph.`
    
    const result = convertTextToMarkdown(text)
    
    expect(result).toContain('First paragraph.')
    expect(result).toContain('Second paragraph with multiple sentences. This is still the same paragraph.')
    expect(result).toContain('Third paragraph.')
  })
  
  it('should detect numbered lists', () => {
    const text = `Here are the steps:
1. First step
2. Second step
3. Third step`
    
    const result = convertTextToMarkdown(text)
    
    expect(result).toContain('1. First step')
    expect(result).toContain('2. Second step')
    expect(result).toContain('3. Third step')
  })
  
  it('should detect bullet lists', () => {
    const text = `Items:
• First item
• Second item
• Third item`
    
    const result = convertTextToMarkdown(text)
    
    expect(result).toContain('- First item')
    expect(result).toContain('- Second item')
    expect(result).toContain('- Third item')
  })
  
  it('should handle mixed content', () => {
    const text = `TITLE: Document Title

Introduction paragraph.

SECTION A: First Section
1. First point
2. Second point

SECTION B: Second Section
• Bullet one
• Bullet two

Conclusion paragraph.`
    
    const result = convertTextToMarkdown(text)
    
    expect(result).toContain('# TITLE: Document Title')
    expect(result).toContain('## SECTION A: First Section')
    expect(result).toContain('## SECTION B: Second Section')
    expect(result).toContain('1. First point')
    expect(result).toContain('- Bullet one')
  })
  
  it('should handle empty or whitespace text', () => {
    expect(convertTextToMarkdown('')).toBe('')
    expect(convertTextToMarkdown('   ')).toBe('')
    expect(convertTextToMarkdown('\n\n\n')).toBe('')
  })
  
  it('should clean up excessive whitespace', () => {
    const text = `Title   


Content with    extra spaces.


More content.`
    
    const result = convertTextToMarkdown(text)
    
    expect(result).not.toContain('   ')
    expect(result.split('\n\n').length).toBeLessThan(6) // Should not have many empty lines
  })
})