const express = require('express')
const fs = require('fs')
const https = require('https')

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '';

const app = express()

app.use(express.static('public'))

var options = {
    key  : fs.readFileSync('ssl/key.pem'),
    ca   : fs.readFileSync('ssl/csr.pem'),
    cert : fs.readFileSync('ssl/cert.pem')
}

https.createServer(options, app).listen(PORT, HOST, null, function() {
    console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
});