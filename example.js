import { getMunicipalities, getMunicipalitiesByCounty } from './index.js'

async function main () {
  const counties = await getMunicipalitiesByCounty()
  console.log('municipalities grouped by county', counties)

  const munis = await getMunicipalities('json')
  console.log('municipalities as json', munis)
}

main()
