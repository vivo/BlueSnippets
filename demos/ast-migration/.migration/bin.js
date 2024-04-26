const chalk = require('chalk')
const path = require('path')
const ora = require('ora')

const updateFiles = require('./lib/updateFiles')
const runCmdSync = require('./utils/runCmdSync')

const rootDir = path.join(__dirname, '../')

const nDir = path.join(rootDir, '')

const nSrc = `${nDir}src`

let spinner = ora().start()

const migrate = async () => {
	spinner.succeed(chalk.green(`开始迁移`))
	await updateFiles(`${nDir}src`)

	// format code
	runCmdSync('npx prettier --write . --log-level silent', `${nSrc}`)
}

migrate()
