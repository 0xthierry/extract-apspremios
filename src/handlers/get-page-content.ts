import axios from 'axios'
import { brotliCompress } from 'node:zlib'
import { promisify } from 'node:util'
import { JobRequest } from '@/workers/get-page-content'
import { logger } from '@/core/logger'
import { parserQueue } from '@/queues/parser'

const childLogger = logger.child({ module: 'get-page-content' })

const brotliCompressAsync = promisify(brotliCompress)

async function _getPageContent(url: string) {
  const response = await axios.get(url)

  if (response.status !== 200) {
    throw new Error(`Error getting page content: ${response.status}`)
  }

  return response.data
}

async function compressPageContent(content: string) {
  const compressedContent = await brotliCompressAsync(content)

  return compressedContent.toString('base64')
}

export async function getPageContent({ url }: JobRequest) {
  childLogger.info({ url }, 'Getting page content')
  const contentBase64 = await _getPageContent(url).then(compressPageContent)

  const data = {
    url,
    content: contentBase64,
  }

  await parserQueue.add(parserQueue.name, data)
  childLogger.info({ url }, 'Finished getting page content')
}
