import * as fs from 'fs/promises'
import * as path from 'path'

import * as dirname from '@njam-data/tools/dirname.js'
import { readJson } from '@njam-data/tools/json.js'

const filename = 'new-jersey-municipalities'

const dataDirectory = dirname.join(import.meta.url, 'data')
const geojsonFilePath = path.join(dataDirectory, `${filename}.geojson`)
const jsonFilePath = path.join(dataDirectory, `${filename}.json`)
const kmlFilePath = path.join(dataDirectory, `${filename}.kml`)
const topojsonFilePath = path.join(dataDirectory, `${filename}-topojson.json`)
const topojsonSimplifiedFilePath = path.join(dataDirectory, `${filename}-simplified-topojson.json`)
const countiesDirectory = path.join(dataDirectory, 'counties')

/**
 * Get New Jersey municipalities data as GeoJSON, JSON, or KML
 * @param {string} fileType - Valid file types: `geojson`, `json`, or `kml`. Default: 'json'
 * @returns {Promise}
 */
export async function getMunicipalities (fileType = 'json', encoding='utf8') {
  if (fileType === 'geojson') {
    return readJson(geojsonFilePath)
  }

  if (fileType === 'json') {
    return readJson(jsonFilePath)
  }

  if (fileType === 'kml') {
    return fs.readFile(kmlFilePath, encoding)
  }

  if (fileType === 'topojson') {
    return readJson(topojsonFilePath, encoding)
  }

  if (fileType === 'simplified-topojson') {
    return readJson(topojsonSimplifiedFilePath, encoding)
  }

  throw new Error(`File type ${fileType} not available`)
}

export async function getMunicipalitiesByCounty () {
  const filepaths = await fs.readdir(countiesDirectory)

  const data = filepaths
    .filter((filepath) => {
      return filepath.includes('simplified-geojson')
    })
    .map(async (filepath) => {
      const collection = await readJson(path.join(countiesDirectory, filepath))

      return {
        county: filepath.split('-')[0],
        data: collection
      }
    })

  return Promise.all(data)
}
