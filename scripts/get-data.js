import * as fs from 'fs/promises'
import * as path from 'path'
import tokml from 'tokml'
import topojson from 'topojson-server'
import topojsonSimplify, { simplify } from 'topojson-simplify'
import geojson2svg from 'geojson2svg'

import { readJsonFile, writeJsonFile } from '../lib/json.js'

const filename = 'new-jersey-municipalities'
const { pathname: dataDirectoryPath } = new URL('../data', import.meta.url)
const sourceDataFilepath = path.join(dataDirectoryPath, 'source', `${filename}.geojson`)
const targetGeoJsonFilePath = path.join(dataDirectoryPath, `${filename}.geojson`)
const targetJsonFilePath = path.join(dataDirectoryPath, `${filename}.json`)
const targetKmlFilePath = path.join(dataDirectoryPath, `${filename}.kml`)
const targetTopojsonFilePath = path.join(dataDirectoryPath, `${filename}-topojson.json`)
const targetSimplifiedTopojsonFilePath = path.join(dataDirectoryPath, `${filename}-simplified-topojson.json`)
const targetSvgFilePath = path.join(dataDirectoryPath, `${filename}.svg`)

const svgConverter = geojson2svg({
  viewPortSize: {
    width: 200,
    height: 200
  },
  mapExtent: {
    left: -180,
    bottom: -180,
    right: 180,
    top: 180
  },
  output: 'svg',
  fitTo: 'height',
  explode: true,
  attributes: [
    {
      property: 'properties.name',
      type: 'dynamic'
    },
    {
      property: 'properties.mun_code',
      type: 'dynamic'
    },
    {
      property: 'fill',
      value: 'red',
      type: 'static'
    },
    {
      property: 'stroke',
      value: 'white',
      type: 'static'
    },
    {
      property: 'stroke-width',
      value: '2',
      type: 'static'
    }
  ]
})

const geojson = await readJsonFile(sourceDataFilepath)

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
await writeJsonFile(targetGeoJsonFilePath, geojson)

// Write JSON file
const json = geojson.features.map((feature) => {
  return feature.properties
})

await writeJsonFile(targetJsonFilePath, json)

const kml = tokml(geojson)
await fs.writeFile(targetKmlFilePath, kml)

const topo = topojson.topology({ geojson })
await writeJsonFile(targetTopojsonFilePath, topo)

const simplified = topojsonSimplify.simplify(topojsonSimplify.presimplify(topo), .000001)
await writeJsonFile(targetSimplifiedTopojsonFilePath, simplified)

const svgPaths = svgConverter.convert(geojson)
const svg = `<svg version="1.1"
baseProfile="full"
width="200" height="200"
xmlns="http://www.w3.org/2000/svg">

${svgPaths.join('')}

</svg>
`

await fs.writeFile(targetSvgFilePath, svg)
