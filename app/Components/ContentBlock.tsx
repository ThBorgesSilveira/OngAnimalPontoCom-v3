type ContentBlockProps = {
  content: string
  className?: string
}

export default function ContentBlock({ content, className }: ContentBlockProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
