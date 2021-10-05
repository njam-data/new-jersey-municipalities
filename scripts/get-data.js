import * as fs from 'fs/promises'
import * as path from 'path'
import tokml from 'tokml'
import topojson from 'topojson-server'
import topojsonSimplify from 'topojson-simplify'
import { featureCollection } from '@turf/helpers'
import { geoPath } from 'd3-geo'

import * as dirname from '@njam-data/tools/dirname.js'
import { readJson, writeJson } from '@njam-data/tools/json.js'
import { getCounties } from '@njam-data/new-jersey-counties'
import { slugify } from '@njam-data/tools/text.js'

const filename = 'new-jersey-municipalities'

const dataDirectory = dirname.join(import.meta.url, '..', 'data')
const sourceDirectory = path.join(dataDirectory, 'source')
const sourceDataFilepath = path.join(sourceDirectory, `${filename}.geojson`)
const targetGeoJsonFilePath = path.join(dataDirectory, `${filename}.geojson`)
const targetJsonFilePath = path.join(dataDirectory, `${filename}.json`)
const targetKmlFilePath = path.join(dataDirectory, `${filename}.kml`)
const targetTopojsonFilePath = path.join(dataDirectory, `${filename}-topojson.json`)
const targetSimplifiedTopojsonFilePath = path.join(dataDirectory, `${filename}-simplified-topojson.json`)
const countiesDirectory = path.join(dataDirectory, 'counties')

const counties = (await getCounties()).map((county) => {
  return {
    county: county.county,
    countyLabel: county.county_label
  }
})

function createCountyFilepath (county, ext) {
  return path.join(countiesDirectory, `${county}.${ext}`)
}

const geojson = await readJson(sourceDataFilepath)

geojson.features = geojson.features.map((feature) => {
  const properties = {}

  for (const key in feature.properties) {
    const newKey = key.toLowerCase()
    properties[newKey] = feature.properties[key]
  }

  feature.properties = properties
  return feature
})

// Write GeoJSON file
await writeJson(targetGeoJsonFilePath, geojson)

// Write JSON file
const json = geojson.features.map((feature) => {
  return feature.properties
})

await writeJson(targetJsonFilePath, json)

const kml = tokml(geojson)
await fs.writeFile(targetKmlFilePath, kml)

const topo = topojson.topology({ geojson })
await writeJson(targetTopojsonFilePath, topo)

const simplified = topojsonSimplify.simplify(topojsonSimplify.presimplify(topo), .000001)
await writeJson(targetSimplifiedTopojsonFilePath, simplified)

for (const county of counties) {
  let munis = geojson.features.filter((feature) => {
    return feature.properties.county === county.county
  })

  munis = munis.map((muni) => {
    return {
      id: muni.properties.mun_code,
      properties: {
        county: muni.properties.county,
        mun_code: muni.properties.mun_code,
        mun_label: muni.properties.mun_label,
        name: muni.properties.name
      },
      geometry: muni.geometry
    }
  })

  const countySlug = slugify(county.county.toLowerCase(), { separator: '_' })
  const json = featureCollection(munis)

  const countyFilepath = createCountyFilepath(countySlug, 'geojson')
  const countyTopoFilepath = createCountyFilepath(`${countySlug}-topojson`, 'json')
  const countySimplifiedTopoFilepath = createCountyFilepath(`${countySlug}-simplified-topojson`, 'json')

  await writeJson(countyFilepath, json)

  const topo = topojson.topology({ json })
  await writeJson(countyTopoFilepath, topo)

  const simplified = topojsonSimplify.simplify(topojsonSimplify.presimplify(topo), .000001)
  await writeJson(countySimplifiedTopoFilepath, simplified)
}
