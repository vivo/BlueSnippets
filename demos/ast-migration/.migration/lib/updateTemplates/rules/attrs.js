module.exports = function (ast, file) {
  const template = ast.find('<template></template>')

  if (!template) {
    return ast
  }

  const methodPrefix = ['@', 'v-on:']
  const swiperTag = 'swiper'

  // find swiper
  const swiperAttrs = template.find(`<${swiperTag} $$$0></${swiperTag}>`).match[
    '$$$0'
  ]

  // @change => :onChange
  template.replace(
    `<${swiperTag} @change="$_$" $$$1>$$$0</${swiperTag}>`,
    `<${swiperTag} :onChange="$_$" $$$1>$$$0</${swiperTag}>`
  )

  return ast
}
