import { JobRequest } from '@/workers/parse-page-content'
import { brotliDecompress } from 'node:zlib'
import { promisify } from 'node:util'

const brotliDecompressAsync = promisify(brotliDecompress)

async function decompressPageContent(content: string) {
  const decompressedContent = await brotliDecompressAsync(
    Buffer.from(content, 'base64'),
  )

  return decompressedContent.toString('utf-8')
}

export async function parsePageContent({
  url,
  content: contentBase64,
}: JobRequest) {
  console.log('parse-page', { url, contentBase64 })
  const contentString = await decompressPageContent(contentBase64)
  const id = url

  console.log({ contentString })
}
