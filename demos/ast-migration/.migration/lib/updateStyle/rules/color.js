const postcss = require('postcss')
const { Root, AtRule } = postcss

const plugin = (opts = {}) => {
	return {
		postcssPlugin: 'postcss-color',
		Once(root, { result }) {
			// change all color value to red
			root.walkDecls(node => {
				if (node.prop === 'color') {
					node.value = 'red'
				}
			})
		}
	}
}
plugin.postcss = true

module.exports = plugin
