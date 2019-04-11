const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format
const appInfo = require('../package')
const appLabel = appInfo.name + '/' + appInfo.version

const myFormat = printf(info => {
  try {
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message)
    }
  } catch (err) { }
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

const logger = createLogger({
  format: combine(
    label({ label: appLabel }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
})

module.exports = logger
