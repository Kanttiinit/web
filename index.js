const express = require('express');

express()
.use((req, res, next) => {
  if (req.headers.host.slice(0, 4) === 'www.') {
    res.redirect(301, `${req.protocol}://${req.headers.host.slice(4)}${req.originalUrl}`);
  } else {
    next();
  }
})
.use(require('compression')())
.use(express.static('dist'))
.use(express.static(__dirname + '/src/assets'))
.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html'))
.listen(process.env.PORT || 8080);
