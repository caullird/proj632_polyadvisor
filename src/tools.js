const fs = require('fs');

module.exports = {
  writeFile : async function(path, data) {
    await fs.mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  }
}