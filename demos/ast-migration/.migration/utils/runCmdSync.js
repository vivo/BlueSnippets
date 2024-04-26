/**
 * 删除
 * @param {*} cmd
 * @param {*} cwd
 * @returns
 */
function runCmdSync(cmd, cwd) {
  const spawnSync = require('child_process').spawnSync

  const cmdArr = cmd.split(' ')
  const args = cmdArr.slice(1, cmdArr.length)
  const result = spawnSync(cmdArr[0], args, {
    cwd,
  })
  const stdout = result && result.stdout ? result.stdout.toString() : ''
  const stderr = result && result.stderr ? result.stderr.toString() : ''
  return stdout + stderr
}

module.exports = runCmdSync
