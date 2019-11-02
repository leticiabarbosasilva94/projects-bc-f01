const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, './database.json');

function checkDatabaseFile() {
  const exists = fs.existsSync(filePath);
  if (!exists) createDatabaseFile();
}

async function createDatabaseFile() {
  await fs.promises.writeFile(filePath, JSON.stringify([]), { flag: 'w' });
}
checkDatabaseFile();

module.exports = filePath;
