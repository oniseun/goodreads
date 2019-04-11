const geoip = require('geoip-lite')

var getIp = function(req) {
  var ip

  if (req.headers['x-forwarded-for']) {
    var ips = req.headers['x-forwarded-for'].split(',')
    ip = ips[0].replace(/\s/g, '')
  }

  ip = ip || req.connection.remoteAddress

  return ip.replace('::ffff:', '')
}

var getCountryCode = function(req) {
  var geo = geoip.lookup(getIp(req))
  return geo ? geo.country : ''
}

// Exports
exports.getIp = getIp
exports.getCountryCode = getCountryCode
