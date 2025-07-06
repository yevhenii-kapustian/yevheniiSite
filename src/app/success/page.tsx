'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { products } from '@/data/products'

const TenMinutesInMs = 10 * 60 * 1000

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const productName = searchParams.get('product')
  const timestamp = searchParams.get('t')

  const [canDownload, setCanDownload] = useState(false)

  const allProducts = products.get('plans')
  const product = allProducts?.find(p => p.name === productName)

  useEffect(() => {
    if (!timestamp) return
    const time = parseInt(timestamp, 10)
    if (!isNaN(time) && Date.now() - time <= TenMinutesInMs) {
      setCanDownload(true)
    }
  }, [timestamp])

  if (!product || !product.downloadProduct) {
    return <p>Invalid product.</p>
  }

  return (
    <section className="pt-20 text-center">
      <h1>Thank you for your purchase!</h1>
      {canDownload ? (
        <a
          href={`/downloads/${product.downloadProduct}`}
          download
          className="text-blue-600 underline mt-4 block"
        >
          Click here to download your file
        </a>
      ) : (
        <p>This link has expired.</p>
      )}
    </section>
  )
}
