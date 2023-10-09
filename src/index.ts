import { setInterval } from 'node:timers/promises'

for await (const _ of setInterval(1000)) {
  console.log('Hello World')
}
