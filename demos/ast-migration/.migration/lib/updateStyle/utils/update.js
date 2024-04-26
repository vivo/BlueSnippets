const path = require('path')
const $ = require('gogocode')
const fs = require('fs-extra')
const compiler = require('@vue/component-compiler-utils')
const { parse, compileStyle } = compiler
const postcss = require('postcss')
const { Root, Declaration, Rule } = postcss

const scssParser = require('postcss-scss')
const lessParser = require('postcss-less')
const sassParser = require('postcss-sass')

const parsers = {
	scss: scssParser,
	less: lessParser,
	sass: sassParser,
	css: lessParser
}

const { styleSuffix } = require('../../../config')

/**
 *	Update style
 * @param {*} path file path
 * @param {*} rules rules
 * @param {string} [language='vue'] language
 * @return {*}
 */
const update = (path, rules, language = 'vue') => {
	const sourceCode = fs.readFileSync(path).toString()

	if (language === 'vue') {
		// return an ast result
		return handleVue(sourceCode, rules, path)
	} else if (styleSuffix.includes(language)) {
		// return an text result
		return handleCss(sourceCode, rules, path, language)
	} else {
		throw new Error(`language ${language} is not supported.`)
		return
	}
}

/**
 * Handle vue file
 * @param {*} sourceCode source code
 * @param {*} rules	rules
 * @param {*} path	file path
 * @return {*}
 */
const handleVue = (sourceCode, rules, path) => {
	const ast = $(sourceCode, { parseOptions: { language: 'vue' } })

	if (!ast) {
		return ast
	}

	const styles = ast.rootNode.value.styles

	styles.forEach((style, index) => {
		let content = style.content
		const lang = style.lang || 'css'

		const result = compileStyle({
			source: content,
			scoped: false, // Need to set scoped false, otherwise compileStyle will add a scoped id on the selector by default.
			postcssOptions: {
				syntax: parsers[lang]
			}
		})
		// Parse failed, skip this file
		if (result.errors.length || !result.code) {
			console.log(result.errors)
			return
		}

		const res = postcss(rules).process(result.code, {
			from: path,
			syntax: parsers[lang]
		})

		style.content = res.css
	})

	return ast
}

/**
 * Handle css file
 * @param {*} sourceCode source code
 * @param {*} rules rules
 * @param {*} path	file path
 * @param {*} lang	language
 * @return {*}
 */
const handleCss = (sourceCode, rules, path, lang) => {
	const result = postcss(rules).process(sourceCode, {
		from: path,
		syntax: parsers[lang]
	})
	return result?.css
}

module.exports = update
