import * as fs from 'fs/promises'

/**
 * @param {string} filePath path to file
 * @returns {Promise}
 */
export async function readJsonFile (filePath) {
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

/**
* @param {string} filePath - file path that will be written
* @param {object} data - object that will be serialized with JSON.stringify
* @returns {Promise}
*/
export async function writeJsonFile (filePath, data) {
  const json = JSON.stringify(data)
  return fs.writeFile(filePath, json)
}
