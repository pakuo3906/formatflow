import { ReactNode } from 'react'

interface MockReactMarkdownProps {
  children: string
  remarkPlugins?: any[]
  components?: any
}

// Mock ReactMarkdown for testing
export default function ReactMarkdown({ children, components }: MockReactMarkdownProps) {
  // Simple mock implementation that renders basic HTML elements
  const content = children
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    .replace(/^-\s(.+)$/gm, '<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/```(.+?)```/gs, '<code>$1</code>')
    .replace(/\|(.+)\|/g, '<td>$1</td>')
    .split('\n')
    .map(line => line.trim())
    .join('')

  return <div dangerouslySetInnerHTML={{ __html: content }} />
}