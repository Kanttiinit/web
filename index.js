const express = require('express');

express()
.use(express.static('dist'))
.listen(process.env.PORT || 5000);
