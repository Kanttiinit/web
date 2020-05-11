require('dotenv').config();
const express = require('express');
const semver = require('semver');
const pkg = require('./package.json');

express()
  .use(express.static('dist'))
  .use(express.static(__dirname + '/src/assets'))
  .get('/admin*', (req, res) =>
    res.sendFile(__dirname + '/dist/index_admin.html')
  )
  .get('/check-update', (req, res) => {
    try {
      res.json({ updateAvailable: semver.gt(pkg.version, req.query.version) });
    } catch (e) {
      res.status(400).json({ error: true });
    }
  })
  .get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html'))
  .listen(process.env.PORT || 8080);
