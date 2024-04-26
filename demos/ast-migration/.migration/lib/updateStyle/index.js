const $ = require('gogocode')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const compiler = require('@vue/component-compiler-utils')
const { parse, compileStyle } = compiler
const postcss = require('postcss')
const { Root, Declaration, Rule } = postcss

const update = require('./utils/update')

const ruleFiles = fs.readdirSync(path.resolve(__dirname, 'rules'))

const updateStyle = async (file, path, language = 'vue') => {
	const rules = ruleFiles.map(file => {
		const rule = require(`./rules/${file}`)
		return rule({ path })
	})
	return new Promise((resolve, reject) => {
		try {
			const res = update(path, rules, language)

			const outputCode = language === 'vue' ? res.root().generate() : res

			fs.writeFile(path, outputCode, function (err) {
				if (err) {
					reject(err)
					throw err
				}
				resolve()
			})
		} catch (error) {
			console.log(chalk.yellow('\n' + 'Parse failed, file skipped：' + path))
			reject(error)
		}
	})
}

module.exports = updateStyle
