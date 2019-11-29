module.exports = function (bundler) {
  bundler.addAssetType('htm', require.resolve('./htm'))
}
