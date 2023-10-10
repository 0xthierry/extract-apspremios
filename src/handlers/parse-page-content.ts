import { brotliDecompress } from 'node:zlib'
import { promisify } from 'node:util'
import * as cheerio from 'cheerio'
import { JobRequest } from '@/workers/parse-page-content'
import { aggregateQueue } from '@/queues/aggregate'
import { logger } from '@/core/logger'

const childLogger = logger.child({ module: 'parse-page-content' })

const brotliDecompressAsync = promisify(brotliDecompress)

export async function decompressPageContent(content: string) {
  const decompressedContent = await brotliDecompressAsync(
    Buffer.from(content, 'base64'),
  )

  return decompressedContent.toString('utf-8')
}

function slugify(text: string) {
  const normalizedText = text
    .toLowerCase() // Convert to lowercase
    .normalize('NFKD') // Normalize to NFKD form
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except hyphens and spaces)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
    .trim() // Remove leading and trailing spaces

  return normalizedText
}

function extractFromHTML(html: string) {
  const $ = cheerio.load(html)
  const name = $('span:contains("Sorteio:")').next().text().trim()
  const quantity = $('span:contains("Quantidade:")')
    .next()
    .text()
    .trim()
    .match(/\d+/)
  const price = $('span:contains("Valor por bilhete:")')
    .next()
    .text()
    .trim()
    .match(/[\d,]+/)
  const titlePaid = $(
    'h1:contains("Pagamento Aprovado! Agradecemos sua participação no sorteio, boa sorte!")',
  )
    .text()
    .trim()

  console.log({ titlePaid })

  if (!price || !quantity) {
    throw new Error('Invalid page content')
  }

  return {
    name,
    slug: slugify(name),
    quantity: Number(quantity[0]),
    price: Number(price[0].replace(',', '.')),
    isPaid: titlePaid.length > 0,
  }
}

export async function parsePageContent({
  url,
  content: contentBase64,
}: JobRequest) {
  childLogger.info({ url }, 'Parsing page content')
  const contentString = await decompressPageContent(contentBase64)
  const parsedContent = extractFromHTML(contentString)
  const { pathname } = new URL(url)
  const pathSegments = pathname.split('/')
  const orderId = pathSegments[pathSegments.length - 1]

  const data = {
    ...parsedContent,
    orderId: String(orderId),
  }

  if (!data.isPaid) {
    childLogger.info({ url }, 'Page is not paid, skipping')
    return
  }

  await aggregateQueue.add(aggregateQueue.name, data)
  childLogger.info({ url }, 'Finished parsing page content')
  return data
}
