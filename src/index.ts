import { pagesQueue } from '@/queues/pages'
import '@/workers/parse-page-content'
import '@/workers/process-page-content'

async function main() {
  await pagesQueue.add(
    'pages',
    { url: 'https://google.com' },
    { jobId: 'https://google.com' },
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
