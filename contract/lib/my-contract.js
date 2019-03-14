/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

class MyContract extends Contract {


    async instantiate(ctx) {
        console.info('Instantiate empty lists');

        var emptyList = [];
        await ctx.stub.putState('residents', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('banks', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('utilityCompanies', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('identityMap', Buffer.from(JSON.stringify(emptyList)));
    }


    // participant functions

    async AddResident(ctx, residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency) {
        var cid = new ClientIdentity(ctx.stub);
        console.info(`Received "AddResident" transaction from ${cid.getID()}`);

        var coins = {
            "value": Number(coinsBalance)
        }

        var energy = {
            "value": Number(energyValue),
            "units": energyUnits
        }

        var cash = {
            "value": Number(cashBalance),
            "currency": cashCurrency
        }

        var resident = {
            "participantId": cid.getID(),
            "residentId": residentId,
            "firstName": firstName,
            "lastName": lastName,
            "coins": coins,
            "cash": cash,
            "energy": energy,
            "type": "resident"
        }        

        //add residentId to 'resident' key
        const data = await ctx.stub.getState('residents');
        var residents = JSON.parse(data.toString());

        // detects duplicate IDs
        if (residents.indexOf(residentId) == -1) {
            residents.push(residentId);
            await ctx.stub.putState('residents', Buffer.from(JSON.stringify(residents)));
        } else {
            throw new Error('Resident with this id exists');
        }

        await ctx.stub.putState(residentId, Buffer.from(JSON.stringify(resident)));
        return JSON.stringify(resident);
    }

    async AddBank(ctx, bankId, name, coinsBalance, cashBalance, cashCurrency) {
        var cid = new ClientIdentity(ctx.stub);
        console.info(`Received "AddBank" transaction from ${cid.getID()}`);
        var coins = {
            "value": Number(coinsBalance)
        }

        var cash = {
            "value": Number(cashBalance),
            "currency": cashCurrency
        }

        var bank = {
            "participantId": cid.getID(),
            "bankId": bankId,
            "name": name,
            "coins": coins,
            "cash": cash,
            "type": "bank"
        }        

        //add bankId to 'banks' key
        const data = await ctx.stub.getState('banks');
        var banks = JSON.parse(data.toString());

        // detects duplicate IDs
        if (banks.indexOf(bankId) == -1) {
            banks.push(bankId);
            await ctx.stub.putState('banks', Buffer.from(JSON.stringify(banks)));
        } else {
            throw new Error('Bank with this id exists');
        }

        // add bank object
        await ctx.stub.putState(bankId, Buffer.from(JSON.stringify(bank)));
        return JSON.stringify(bank);
    }

    async AddUtilityCompany(ctx, utilityCompanyId, name, coinsBalance, energyValue, energyUnits) {
        var cid = new ClientIdentity(ctx.stub);
        console.info(`Received "AddUtilityCompany" transaction from ${cid.getID()}`);
        var coins = {
            "value": Number(coinsBalance)
        }

        var energy = {
            "value": Number(energyValue),
            "units": energyUnits
        }

        var utilityCompany = {
            "participantId": cid.getID(),
            "utilityCompanyId": utilityCompanyId,
            "name": name,
            "coins": coins,
            "energy": energy,
            "type": "utilityCompany"
        }        

        //add utilityCompanyId to 'utilityCompanies' key
        const data = await ctx.stub.getState('utilityCompanies');
        var utilityCompanies = JSON.parse(data.toString());

        // detects duplicate IDs
        if (utilityCompanies.indexOf(utilityCompanyId) == -1) {
            utilityCompanies.push(utilityCompanyId);
            await ctx.stub.putState('utilityCompanies', Buffer.from(JSON.stringify(utilityCompanies)));
        } else {
            throw new Error('Utility Company with this id exists');
        }

        // add utility company object
        await ctx.stub.putState(utilityCompanyId, Buffer.from(JSON.stringify(utilityCompany)));
        return JSON.stringify(utilityCompany);
    }

    //energy trade for coins
    async EnergyTrade(ctx, energyRate, energyValue, energyReceiverId, energySenderId) {
        var cid = new ClientIdentity(ctx.stub);
        console.info(`Received "EnergyTrade" transaction from ${cid.getID()}`);
        var coinsValue = Number(energyRate) * Number(energyValue);

        // first check: tx invoker can only send from his account
        const senderData = await ctx.stub.getState(energySenderId);
        if (!senderData) {
            throw new Error('Sender does not exist, create participant first');
        }
        var sender = JSON.parse(senderData.toString());
        if (cid.getID() != sender.participantId) {
            throw new Error('Incorrect ID used');
        }

        // auth test pass: update energySenderId account
        if (sender.energy.value < energyValue) {
            throw new Error('Sender does not have enough energy in the account');
        }
        if (receiver.coins.value < coinsValue) {
            throw new Error('Receiver does not have enough coins in the account');
        }
        sender.energy.value = sender.energy.value - Number(energyValue);
        sender.coins.value = coinsValue + sender.coins.value;
        await ctx.stub.putState(energySenderId, Buffer.from(JSON.stringify(sender)));

        //update energyReceiverId account
        const receiverData = await ctx.stub.getState(energyReceiverId);
        if (!receiverData) {
            throw new Error('Receiver does not exist, create participant first');
        }
        var receiver = JSON.parse(receiverData.toString());
        receiver.energy.value = receiver.energy.value + Number(energyValue);
        receiver.coins.value = receiver.coins.value - coinsValue ;
        await ctx.stub.putState(energyReceiverId, Buffer.from(JSON.stringify(receiver)));

        var returnObj = {
            "sender": sender,
            "receiver": receiver
        }
        return JSON.stringify(returnObj);

    }

    //cash trade for coins
    async CashTrade(ctx, cashRate, cashValue, cashReceiverId, cashSenderId) {
        var cid = new ClientIdentity(ctx.stub);
        console.info(`Received "CashTrade" transaction from ${cid.getID()}`);
        var coinsValue = Number(cashRate) * Number(cashValue);

        // first check: tx invoker can only send from his account
        const senderData = await ctx.stub.getState(cashSenderId);
        if (!senderData) {
            throw new Error('Sender does not exist, create participant first');
        }
        var sender = JSON.parse(senderData.toString());
        if (cid.getID() != sender.participantId) {
            throw new Error('Incorrect ID used');
        }

        // auth test pass: update cashSenderId account
        if (sender.cash.value < cashValue) {
            throw new Error('Sender does not have enough cash in the account');
        }
        if (receiver.coins.value < coinsValue) {
            throw new Error('Receiver does not have enough coins in the account');
        }
        sender.cash.value = sender.cash.value - Number(cashValue);
        sender.coins.value = sender.coins.value + coinsValue;
        await ctx.stub.putState(cashSenderId, Buffer.from(JSON.stringify(sender)));

        //update energyReceiverId account
        const receiverData = await ctx.stub.getState(cashReceiverId);
        var receiver = JSON.parse(receiverData.toString());                
        receiver.cash.value = receiver.cash.value + Number(cashValue);
        receiver.coins.value = receiver.coins.value - coinsValue;
        await ctx.stub.putState(cashReceiverId, Buffer.from(JSON.stringify(receiver)));

        var returnObj = {
            "sender": sender,
            "receiver": receiver
        }
        return JSON.stringify(returnObj);
    }

    // get the state from key
    async GetState(ctx, key) {
        
        const data = await ctx.stub.getState(key);
        var jsonData;
        if (!data) {
            jsonData = { error: `no value with key ${key} exists` };
        } else {
            jsonData = JSON.parse(data.toString());
        }
        return JSON.stringify(jsonData);
    }

}

module.exports = MyContract;
