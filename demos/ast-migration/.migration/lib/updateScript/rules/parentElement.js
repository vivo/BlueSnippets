module.exports = function (ast, file) {
	const script =
		ast.parseOptions && ast.parseOptions.language === 'vue' ? ast.find('<script></script>') : ast
	if (!script) {
		return ast
	}

	// replace parentElement with parentNode
	script.replace(`$_$.parentElement`, `$_$.parentNode`)

	return ast
}
