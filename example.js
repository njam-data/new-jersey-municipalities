import { getMunicipalities } from './index.js'

async function main () {
  const data = await getMunicipalities('json')
  console.log(data)
}

main()
