/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyContract extends Contract {


    async instantiate(ctx) {
        console.info('instantiate');

        var emptyList = [];
        await ctx.stub.putState('residents', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('banks', Buffer.from(JSON.stringify(emptyList)));
        await ctx.stub.putState('utilityCompanies', Buffer.from(JSON.stringify(emptyList)));
    }


    // participant functions 

    async AddResident(ctx, residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency) {

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
            "residentId": residentId,
            "firstName": firstName,
            "lastName": lastName,
            "coins": coins,
            "cash": cash,
            "energy": energy,
            "type": "resident"            
        }
        await ctx.stub.putState(residentId, Buffer.from(JSON.stringify(resident)));

        //add residentId to 'resident' key
        const data = await ctx.stub.getState('residents');
        let residents = JSON.parse(data.toString());        
        residents.push(residentId);
        await ctx.stub.putState('residents', Buffer.from(JSON.stringify(residents)));        

        return JSON.stringify(resident);
    }


    async AddBank(ctx, bankId, name, coinsBalance, cashBalance, cashCurrency) {

        var coins = {
            "value": Number(coinsBalance)
        }

        var cash = {
            "value": Number(cashBalance),
            "currency": cashCurrency
        }

        var bank = {
            "bankId": bankId,
            "name": name,
            "coins": coins,
            "cash": cash,
            "type": "bank"
        }
        await ctx.stub.putState(bankId, Buffer.from(JSON.stringify(bank)));

        //add bankId to 'bank' key
        const data = await ctx.stub.getState('banks');
        let banks = JSON.parse(data.toString());        
        banks.push(bankId);
        await ctx.stub.putState('banks', Buffer.from(JSON.stringify(banks)));        

        return JSON.stringify(bank);
    }

    async AddUtilityCompany(ctx, utilityCompanyId, name, coinsBalance, energyValue, energyUnits) {

        var coins = {
            "value": Number(coinsBalance)
        }

        var energy = {
            "value": Number(energyValue),
            "units": energyUnits
        }

        var utilityCompany = {
            "utilityCompanyId": utilityCompanyId,
            "name": name,
            "coins": coins,
            "energy": energy,
            "type": "resident"            
        }
        await ctx.stub.putState(utilityCompanyId, Buffer.from(JSON.stringify(utilityCompany)));

        //add utilityCompanyId to 'utilityCompanies' key
        const data = await ctx.stub.getState('utilityCompanies');
        let utilityCompanies = JSON.parse(data.toString());        
        utilityCompanies.push(utilityCompanyId);
        await ctx.stub.putState('utilityCompanies', Buffer.from(JSON.stringify(utilityCompanies)));

        return JSON.stringify(utilityCompany);
    }

    //energy trade for coins
    async EnergyTrade(ctx, energyRate, energyValue, energyReceiverId, energySenderId) {

        var coinsValue = Number(energyRate) * Number(energyValue);

        //update energyReceiverId account
        const receiverData = await ctx.stub.getState(energyReceiverId);
        let receiver = JSON.parse(receiverData.toString());
        receiver.energy.value = receiver.energy.value + Number(energyValue);
        receiver.coins.value = receiver.coins.value - coinsValue ;
        await ctx.stub.putState(energyReceiverId, Buffer.from(JSON.stringify(receiver)));

        //update energySenderId account
        const senderData = await ctx.stub.getState(energySenderId);
        let sender = JSON.parse(senderData.toString());
        sender.energy.value = sender.energy.value - Number(energyValue);
        sender.coins.value = coinsValue + sender.coins.value;
        await ctx.stub.putState(energySenderId, Buffer.from(JSON.stringify(sender)));        

        var returnObj = {
            "sender": sender,
            "receiver": receiver
        }
        return JSON.stringify(returnObj);
        
    }

    //cash trade for coins
    async CashTrade(ctx, cashRate, cashValue, cashReceiverId, cashSenderId) {
        console.info('transaction2', arg1, arg2);

        var coinsValue = Number(cashRate) * Number(cashValue);

        //update energyReceiverId account
        const receiverData = await ctx.stub.getState(cashReceiverId);
        let receiver = JSON.parse(receiverData.toString());
        receiver.cash.value = receiver.cash.value + Number(cashValue);
        receiver.coins.value = receiver.coins.value - coinsValue;
        await ctx.stub.putState(cashReceiverId, Buffer.from(JSON.stringify(receiver)));

        //update energySenderId account
        const senderData = await ctx.stub.getState(cashSenderId);
        let sender = JSON.parse(senderData.toString());
        sender.energy.value = sender.energy.value - Number(cashValue);
        sender.coins.value = sender.coins.value + coinsValue;
        await ctx.stub.putState(cashSenderId, Buffer.from(JSON.stringify(sender)));

        var returnObj = {
            "sender": sender,
            "receiver": receiver
        }        
        return JSON.stringify(returnObj);
    }

    // get the state from key
    async GetState(ctx, key) {

        const data = await ctx.stub.getState(key);
        let jsonData = JSON.parse(data.toString());
        return JSON.stringify(jsonData);
        
    }

}

module.exports = MyContract;
