import fs from 'node:fs/promises'
import path from 'node:path'
import { decompressPageContent, parsePageContent } from './parse-page-content'

const COMPRESSED_PAGE_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'test',
  'fixtures',
  'compressed-page.brotli',
)

describe('ParsePageContent Suite', () => {
  describe('Decompress Page Content', () => {
    it('should decompress page content', async () => {
      const expectedPageContentDecompressed = `<h1>Hello World</h1>`
      const pageContentCompressedInBrotli = 'iwmAPGgxPkhlbGxvIFdvcmxkPC9oMT4D'

      const decompressedPageContent = await decompressPageContent(
        pageContentCompressedInBrotli,
      )

      expect(decompressedPageContent).toEqual(expectedPageContentDecompressed)
    })
  })

  describe('Parse Page Content', () => {
    it('should parse the compressed page content to valid structure', async () => {
      const jobData = {
        url: 'https://apspremios.com.br/pedidos/271093',
        content: await fs.readFile(COMPRESSED_PAGE_PATH, 'utf-8'),
      }

      const parsedPageContentExpected = {
        name: 'Ação #43 40mil + IPhone 14 pro max',
        slug: 'acao-43-40mil-iphone-14-pro-max',
        quantity: 6,
        price: 0.3,
        orderId: '271093',
      }

      const parsedPageContent = await parsePageContent(jobData)

      expect(parsedPageContent).toEqual(parsedPageContentExpected)
    })
  })
})
