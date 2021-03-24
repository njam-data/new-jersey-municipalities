import { getData } from './index.js'

async function main () {
  const data = await getData('json')
  console.log(data)
}

main()
