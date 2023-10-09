import axios from 'axios'
import { brotliCompress } from 'node:zlib'
import { promisify } from 'node:util'
import { JobRequest } from '@/workers/process-page-content'

import { parserQueue } from '@/queues/parser'

const brotliCompressAsync = promisify(brotliCompress)

async function getPageContent(url: string) {
  const response = await axios.get(url)

  return response.data
}

async function compressPageContent(content: string) {
  const compressedContent = await brotliCompressAsync(content)

  return compressedContent.toString('base64')
}

export async function processPageContent({ url }: JobRequest) {
  const contentBase64 = await getPageContent(url).then(compressPageContent)

  const data = {
    url,
    content: contentBase64,
  }

  await parserQueue.add(parserQueue.name, data)
}
