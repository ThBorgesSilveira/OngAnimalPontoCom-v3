type ContentBlockProps = {
  content: string
  className?: string
}

export default function ContentTextBlock({ content, className }: ContentBlockProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
