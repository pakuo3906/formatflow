// Mock remark-gfm for testing
export default function remarkGfm() {
  return function transformer() {
    // No-op transformer for testing
    return {}
  }
}