const $ = require('gogocode')
const path = require('path')
const prettier = require('prettier')
const fs = require('fs')
const chalk = require('chalk')

const ruleFiles = fs.readdirSync(path.resolve(__dirname, 'rules'))
const rules = ruleFiles.map((file) => require(`./rules/${file}`))

/**
 * Update templates
 * @param {*} file file
 * @param {*} path file path
 * @param {string} [language='js'] language
 * @return {*}
 */
const updateTemplates = async (file, path, language = 'js') => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path, function read(err, code) {
        if (err) {
          reject(err)
          throw err
        }
        const sourceCode = code.toString()

        const ast =
          language === 'vue'
            ? $(sourceCode, { parseOptions: { language: 'vue' } })
            : $(sourceCode)

        if (!sourceCode || !ast) {
          resolve()
          return
        }

        // Traverse all rules
        const outAst = rules.reduce((ast, rule) => rule(ast, file, path), ast)

        const outputCode = outAst.root().generate()

        fs.writeFile(path, outputCode, function (err) {
          if (err) {
            reject(err)
            throw err
          }
          resolve()
        })
      })
    } catch (error) {
      console.log(chalk.yellow('\n' + 'Parse failed, file skipped：' + path))
      reject(error)
    }
  })
}

module.exports = updateTemplates
