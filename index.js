
var https = require('https')
var semver = require('semver')
var debug = require('debug')('npm-versions')

module.exports = function* versions(repo) {
  var res = yield function (done) {
    https.request({
      method: 'GET',
      host: 'registry.npmjs.org',
      path: '/' + repo,
      headers: {
        'accept': 'application/json',
        'accept-encoding': 'identity',
        'user-agent': 'https://github.com/github-utils/npm-versions',
      },
      agent: false,
    })
    .on('error', done)
    .on('response', done.bind(null, null))
    .end()
  }

  debug('%s got status code %s', repo, res.statusCode)

  if (res.statusCode !== 200) {
    res.destroy()
    throw new Error('failed to get npmjs.org/' + repo + '\'s versions.')
  }

  var body = yield function (done) {
    var buf = ''
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      buf += chunk
    })
    res.once('end', function () {
      done(null, buf)
    })
  }

  return Object.keys(JSON.parse(body).versions)
    .filter(valid)
    .sort(semver.rcompare)
}

function valid(x) {
  return semver.valid(x)
}
