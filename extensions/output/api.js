module.exports = function api() {
  let express = require('express')
  let app = express()
  let path = require('path')
  let moment = require('moment')

  let run = function(reporter, tradeObject) {
    startServer(process.env.PORT || 9000, reporter.ip, tradeObject)
  }

  let objectWithoutKey = (object, key) => {
    // eslint-disable-next-line no-unused-vars
    const {[key]: deletedKey, ...otherKeys} = object
    return otherKeys
  }

  let startServer = function(port, ip, tradeObject) {
    console.log('Douglas', port)

    app.set('views', path.join(__dirname + '/../../templates'))
    app.set('view engine', 'ejs')

    app.use('/assets', express.static(__dirname + '/../../templates/dashboard_assets'))
    app.use('/assets-wp', express.static(__dirname + '/../../dist/'))
    app.use('/assets-zenbot', express.static(__dirname + '/../../assets'))

    app.get('/', function(req, res) {
      app.locals.moment = moment
      app.locals.deposit = tradeObject.options.deposit
      let datas = JSON.parse(JSON.stringify(objectWithoutKey(tradeObject, 'options'))) // deep copy to prevent alteration
      res.render('dashboard', datas)
    })

    app.get('/trades', function(req, res) {
      res.send(objectWithoutKey(tradeObject, 'options'))
    })

    app.get('/stats', function(req, res) {
      res.sendFile(path.join(__dirname + '../../../stats/index.html'))
    })

    // if (ip) {
    //   app.listen(port, ip)
    //   tradeObject.url = ip + ':' + port + '/'
    // } else {
    app.listen(port)
    tradeObject.url = require('ip').address() + ':' + port + '/'
    // }
    console.log('Web GUI running on port ' + port)
  }

  return {
    run: run
  }
}