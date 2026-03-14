import Image from "next/image"

type ImageWithCaptionProps = {
  src: string
  alt: string
  caption: string
  figureClass?: string
  imageClass?: string
  captionClass?: string
  width?: number
  height?: number
}

export default function ImageWithCaption({
  src,
  alt,
  caption,
  figureClass,
  imageClass,
  captionClass,
  width = 600,
  height = 400,
}: ImageWithCaptionProps) {
  return (
    <figure className={figureClass}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClass}
      />
      <figcaption className={captionClass}>{caption}</figcaption>
    </figure>
  )
}
