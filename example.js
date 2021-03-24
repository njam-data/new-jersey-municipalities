import { getData } from './index.js'

async function main () {
  const kml = await getData('json')
  console.log(kml)
}

main()
