const express = require('express')
const semver = require('semver')
const pkg = require('./package.json')

express()
.use((req, res, next) => {
  if (req.headers.host.slice(0, 4) === 'www.') {
    res.redirect(301, `${req.protocol}://${req.headers.host.slice(4)}${req.originalUrl}`)
  } else {
    next()
  }
})
.use(require('compression')())
.use(express.static('dist'))
.use(express.static(__dirname + '/src/assets'))
.get('/robots.txt', (req, res) => {
  res.send('');
})
.get('/admin*', (req, res) => res.sendFile(__dirname + '/dist/index_admin.html'))
.get('/check-update', (req, res) => {
  try {
    res.json({updateAvailable: semver.gt(pkg.version, req.query.version)})
  } catch (e) {
    res.status(400).json({error: true})
  }
})
.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html'))
.listen(process.env.PORT || 8080)
