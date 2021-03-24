# New Jersey Municipalities

> A reusable package providing New Jersey municipalities as json, geojson, & kml

## Source data
New Jersey open data portal https://njogis-newjersey.opendata.arcgis.com/datasets/municipal-boundaries-of-nj-hosted-3857

## Usage

```js
import { getData } from 'new-jersey-municipalities'

const geojson = await getData('geojson')
const json = await getData('json')
const kml = await getData('kml')
```
