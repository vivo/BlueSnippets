const $ = require('gogocode')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const updateTemplates = require('./updateTemplates')
const updateScript = require('./updateScript')
const updateStyle = require('./updateStyle')
const getFileCounts = require('../utils/getFileCounts')
const ora = require('ora')
let spinner = ora('Updating files...')
let processing = 0
let processed = 0

const { styleSuffix, jsSuffix } = require('../config')

/**
 * Update files
 * @param {*} path - The file path
 */
const updateFiles = async (path) => {
  processing = getFileCounts(path).fileCount
  await migrate(path)
  return true
}

const migrate = (path) => {
  spinner.color = 'cyan'
  spinner.start()

  return new Promise((resolve, reject) => {
    const onProcess = () => {
      processed += 1
      spinner.text = `Updating files...(${processed}/${processing})`

      if (processing === processed) {
        spinner.succeed(chalk.green.bold(`迁移完成！`))
        resolve()
      }
    }

    const traverse = (path) => {
      try {
        fs.readdir(path, (err, files) => {
          files.forEach((file) => {
            const filePath = `${path}/${file}`
            fs.stat(filePath, async function (err, stats) {
              if (err) {
                console.error(
                  chalk.red(`  \n🚀 ~ ${o} Update Script Error:${err}`)
                )
              } else {
                if (stats.isFile()) {
                  const language = file.split('.').pop()
                  if (language === 'vue') {
                    await updateTemplates(file, filePath, language)
                    await updateScript(file, filePath, language)
                    await updateStyle(file, filePath, language)
                  } else if (jsSuffix.includes(language)) {
                    await updateScript(file, filePath, language)
                  } else if (styleSuffix.includes(language)) {
                    await updateStyle(file, filePath, language)
                  }
                  onProcess()
                } else {
                  traverse(`${path}/${file}`)
                }
              }
            })
          })
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    }

    traverse(path)
  })
}

module.exports = updateFiles
