const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {
  writeDataFile : async function(path, data) {
    await fs.mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  },
  writeHtmlFile : async function(path, html) {
    await fs.mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
    fs.writeFileSync(path, html, 'utf8');
  },
  getCoordinateOfLocation : async function(locationName) {
    let url = `https://nominatim.openstreetmap.org/search?format=json&limit=1`
    url += `&q=${locationName}`
    let res = await fetch(url, { method: "POST"});
    let json = await res.json()
    let coordinate = {
        latitude: json[0].lat,
        longitude: json[0].lon
    }
    return coordinate
  }
}