var chalk = require('chalk');   //string styling module在终端显示带颜色的字符串
var semver = require('semver'); //npm 中的模块版本都需要遵循 semver 2.0 的语义化版本规则
var packageConfig = require('../package.json'); //package包配置信息
var shell = require('shelljs'); //在node中使用shell脚本


//能过child_process进程通信模块开启子进程，同步执行命令，并返回结果
function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [
  {
    name: 'node', //node模块
    currentVersion: semver.clean(process.version),  //当前版本号（clean，只保留版本号）
    versionRequirement: packageConfig.engines.node  //配置node版本，一般当前版本不能低于配置的需求
  },
]

//查询npm是否安装，如果是，则将其加入到请求组里；
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

//模块导出，是一个函数，需要执行；
module.exports = function () {
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      //如果当前应用环境版本与配置环境不适合，则输出警告
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
