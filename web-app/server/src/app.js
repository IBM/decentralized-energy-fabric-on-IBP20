'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const network = require('./fabric/network.js');


const app = express();
app.use(morgan('combined'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors());

app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/api/auth']}));

app.post('/api/auth', function(req, res) {
    let token = jwt.sign({userID: 'admin'}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
    res.send({token});
});

app.post('/api/Resident', (req, res) => {
    let newKey = 'resident' + Math.floor(Math.random() * 100000);
    network.addResident(newKey, req.body.firstName, req.body.lastName, req.body.coins, req.body.energy, req.body.energyUnits, req.body.cash, req.body.cashCurrency )
        .then((response) => {
            res.send(response);
        });
});


app.get('/api/Resident', (req, res) => {
    network.getAllParticipants('residents')
        .then((response) => {
            res.send(response);
        });
});

app.get('/api/Resident/:id', (req, res) => {
    let resident_id = req.params.id;
    network.getParticipant(resident_id)
        .then((response) => {
            res.send(response);
        });

});

app.post('/api/Bank', (req, res) => {
    let newKey = 'bank' + Math.floor(Math.random() * 100000);
    network.addBank(newKey, req.body.name, req.body.coins, req.body.cash, req.body.cashCurrency)
        .then((response) => {
            res.send(response);
        });
});

app.get('/api/Bank', (req, res) => {
    network.getAllParticipants('banks')
        .then((response) => {
            res.send(response);
        });
});

app.get('/api/Bank/:id', (req, res) => {
    let bank_id = req.params.id;
    network.getParticipant(bank_id)
        .then((response) => {
            res.send(response);
        });

});

app.post('/api/UtilityCompany', (req, res) => {
    let newKey = 'utilitycompany' + Math.floor(Math.random() * 100000);
    network.addUtilityCompany(newKey, req.body.name, req.body.coins, req.body.energy, req.body.energyUnits)
        .then((response) => {
            res.send(response);
        });

});

app.get('/api/UtilityCompany', (req, res) => {
    network.getAllParticipants('utilityCompanies')
        .then((response) => {
            res.send(response);
        });

});

app.get('/api/UtilityCompany/:id', (req, res) => {

    let utilityCompany_id = req.params.id;
    network.getParticipant(utilityCompany_id)
        .then((response) => {
            res.send(response);
        });

});

app.post('/api/CashTrade', (req, res) => {
    network.cashTrade(req.body.cashRate, req.body.cashValue, req.body.cashReceiverId, req.body.cashSenderId)
        .then((response) => {
            res.send(response);
        });

});

app.post('/api/EnergyTrade', (req, res) => {
    network.energyTrade(req.body.energyRate, req.body.energyValue, req.body.energyReceiverId, req.body.energySenderId)
        .then((response) => {
            res.send(response);
        });
});

app.get('/api/Blockchain', (req, res) => {

    network.getBlockchain()
        .then((response) => {
            res.send({
                result: 'Success',
                returnBlockchain: response
            });
        });

});


app.listen(process.env.PORT || 8081);