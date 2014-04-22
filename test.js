
var co = require('co')
var assert = require('assert')

var getVersions = require('.')

it('should get the versions of domify', co(function* () {
  var versions = yield* getVersions('domify')
  assert(~versions.indexOf('0.0.2'))
}))
