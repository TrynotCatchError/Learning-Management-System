'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill/dist/quill.snow.css'  // For the snow theme, or 'quill.bubble.css' for bubble theme

interface PreviewProps {
  value: string
}

export const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  )

  return (
    <ReactQuill
      theme="snow"  // Use bubble theme instead of "bobble"
      value={value}
      readOnly
    />
  )
}
