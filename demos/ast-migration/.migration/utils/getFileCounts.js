const fs = require('fs')
const path = require('path')

function getFileCounts(dirPath) {
  let fileCount = 0
  let dirCount = 0

  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      fileCount++
    } else if (stats.isDirectory()) {
      const { fileCount: subFileCount, dirCount: subDirCount } =
        getFileCounts(filePath)
      fileCount += subFileCount
      dirCount += subDirCount + 1
    }
  })

  return { fileCount, dirCount }
}

module.exports = getFileCounts
