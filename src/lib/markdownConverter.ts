export function convertTextToMarkdown(text: string): string {
  if (!text || !text.trim()) {
    return ''
  }

  // Split into lines and clean up
  const lines = text
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' ')) // Replace multiple spaces with single space
    .filter(line => line.length > 0)

  const result: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const convertedLine = convertLine(line)
    
    // Add the converted line
    result.push(convertedLine)
    
    // Add paragraph break if next line is not a list item and current line is not a heading
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1]
      const currentIsHeading = convertedLine.startsWith('#')
      const nextIsListItem = isListItem(nextLine) || isNumberedListItem(nextLine)
      const currentIsListItem = convertedLine.startsWith('-') || /^\d+\./.test(convertedLine)
      
      if (!currentIsHeading && !nextIsListItem && !currentIsListItem && !isHeading(nextLine)) {
        result.push('')
      }
    }
  }
  
  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function convertLine(line: string): string {
  // Check for headings
  if (isHeading(line)) {
    return convertHeading(line)
  }
  
  // Check for numbered lists
  if (isNumberedListItem(line)) {
    return line // Already in correct format
  }
  
  // Check for bullet lists
  if (isListItem(line)) {
    return convertBulletList(line)
  }
  
  // Regular paragraph
  return line
}

function isHeading(line: string): boolean {
  // Look for patterns like "CHAPTER 1:", "Section 1.1:", "TITLE:", etc.
  const headingPatterns = [
    /^(CHAPTER|SECTION|TITLE|PART|APPENDIX)\s*[\d\w]*\s*:/i,
    /^[A-Z\s]{3,}:/, // All caps words followed by colon
    /^\d+\.\d+\s+[A-Z]/, // Numbered sections like "1.1 Overview"
    /^Section\s+\d+\.\d+:/i, // Section 1.1: format
  ]
  
  return headingPatterns.some(pattern => pattern.test(line))
}

function convertHeading(line: string): string {
  // Determine heading level based on content
  if (/^(CHAPTER|TITLE|PART)\s*[\d\w]*\s*:/i.test(line)) {
    return `# ${line}`
  } else if (/^(SECTION|APPENDIX)\s*[\d\w]*\s*:/i.test(line) || /^Section\s+\d+\.\d+:/i.test(line)) {
    return `## ${line}`
  } else if (/^\d+\.\d+/.test(line)) {
    return `## ${line}`
  } else {
    return `# ${line}`
  }
}

function isNumberedListItem(line: string): boolean {
  return /^\d+\.\s+/.test(line)
}

function isListItem(line: string): boolean {
  return /^[•·‣⁃]\s+/.test(line)
}

function convertBulletList(line: string): string {
  return line.replace(/^[•·‣⁃]\s+/, '- ')
}