const express = require('express');

express()
.use(express.static('dist'))
.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html'))
.listen(process.env.PORT || 5000);
