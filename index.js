import * as fs from 'fs/promises'
import * as path from 'path'

import { readJsonFile } from './lib/json.js'

const { pathname: dataDirectoryPath } = new URL('data', import.meta.url)
const filename = 'new-jersey-municipalities'

const geojsonFilePath = path.join(dataDirectoryPath, `${filename}.geojson`)
const jsonFilePath = path.join(dataDirectoryPath, `${filename}.json`)
const kmlFilePath = path.join(dataDirectoryPath, `${filename}.kml`)

/**
 * Get New Jersey municipalities data as GeoJSON, JSON, or KML
 * @param {string} fileType - Valid file types: `geojson`, `json`, or `kml`. Default: 'json'
 * @returns {Promise}
 */
export async function getData (fileType = 'json', encoding='utf8') {
  if (fileType === 'geojson') {
    return readJsonFile(geojsonFilePath)
  }

  if (fileType === 'json') {
    return readJsonFile(jsonFilePath)
  }

  if (fileType === 'kml') {
    return fs.readFile(kmlFilePath, encoding)
  }

  throw new Error(`File type ${fileType} not available`)
}
