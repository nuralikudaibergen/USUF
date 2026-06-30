"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  unoptimized,
  onError,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const actualSrc = failed || !src ? fallbackSrc : src
  const shouldSkipOptimization =
    unoptimized ??
    (actualSrc.startsWith("http://") ||
      actualSrc.startsWith("https://") ||
      actualSrc.startsWith("data:"))

  return (
    <Image
      {...props}
      src={actualSrc}
      alt={alt}
      unoptimized={shouldSkipOptimization}
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
    />
  )
}
