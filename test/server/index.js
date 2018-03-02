const cors = require('cors')
const ecstatic = require('ecstatic')
const http = require('http')
const path = require('path')

const server = http.createServer(function (req, res) {
  cors()(req, res, function (err) {
    if (err) throw err
    ecstatic({ root: path.join(__dirname, 'static') })(req, res)
  })
})

const port = Number(process.env.AIRTAP_PORT) || 8000
console.log('Test server listening on port', port)

server.listen(port)
