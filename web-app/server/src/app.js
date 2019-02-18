const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

var network = require('./fabric/network.js');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


/*app.get('/queryAllResidents', (req, res) => {
  network.queryAllResidents()
    .then((response) => {      
        var residentsRecord = JSON.parse(response);        
        res.send(residentsRecord)
      });
})*/

app.post('/addResident', (req, res) => { 
  network.addResident()
    .then((response) => {
      var newKey = 'resident' + Math.random()
      network.addResident(newKey, req.body.firstName, req.body.lastName, req.body.coins, req.body.cash, req.body.energy, "resident" )
      .then((response) => {
        res.send(response)
      })
    })  
})

app.post('/addBank', (req, res) => { 
  network.addBank()
    .then((response) => {
      var newKey = 'bank' + Math.random()
      network.addResident(newKey, req.body.name, req.body.coinsBalance, req.body.cashBalance, req.body.cashCurrnency)
      .then((response) => {
        res.send(response)
      })
    })  
})

app.post('/addUtilityCompany', (req, res) => { 
  network.addUtilityCompany()
    .then((response) => {
      var newKey = 'utilitycompany' + Math.random()
      network.addResident(newKey, req.body.name, req.body.coinsBalance, req.body.energyValue, req.body.energyUnits)
      .then((response) => {
        res.send(response)
      })
    })  
})

app.listen(process.env.PORT || 8081)