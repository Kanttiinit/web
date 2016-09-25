const express = require('express');

express()
.use(require('compression')())
.use(express.static('dist'))
.use(express.static(__dirname + '/src/assets'))
.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html'))
.listen(process.env.PORT || 8080);
