# New Jersey Municipalities

> A reusable package providing New Jersey municipalities as json, geojson, & kml

## Source data
New Jersey open data portal https://njogis-newjersey.opendata.arcgis.com/datasets/municipal-boundaries-of-nj-hosted-3857

## Usage

```js
import { getMunicipalities } from '@njam-data/new-jersey-municipalities'

const geojson = await getMunicipalities('geojson')
const json = await getMunicipalities('json')
const kml = await getMunicipalities('kml')
```
