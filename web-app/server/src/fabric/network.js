
'use strict';

// eslint-disable-next-line no-unused-vars
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');


// capture network variables from config.json
const configPath = path.join(process.cwd(), '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let userName = config.appAdmin;
let gatewayDiscovery = config.gatewayDiscovery;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// create car transaction
exports.addResident = async function(residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency) {
    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // eslint-disable-next-line no-unused-vars
        let result = await contract.submitTransaction('AddResident', residentId, firstName, lastName, coinsBalance.toString(), energyValue.toString(), energyUnits, cashBalance.toString(), cashCurrency);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'AddResident Transaction has been submitted';
        //return response;
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
};

// add Bank transaction
exports.addBank = async function(bankId, name, coinsBalance, cashBalance, cashCurrency) {
    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Submit the specified transaction.
        // eslint-disable-next-line no-unused-vars
        let result = await contract.submitTransaction('AddBank', bankId, name, coinsBalance.toString(), cashBalance.toString(), cashCurrency);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'AddBank Transaction has been submitted';
        //return response;
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
};

// addUtilityCompany transaction
exports.addUtilityCompany = async function(utilityCompanyId, name, coinsBalance, energyValue, energyUnits) {
    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Evaluate the specified transaction.
        await contract.submitTransaction('AddUtilityCompany', utilityCompanyId, name, coinsBalance.toString(), energyValue.toString(), energyUnits);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'AddUtilityCompany Transaction has been submitted';
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }

};


// energy trade transaction
exports.energyTrade = async function(energyRate, energyValue, energyReceiverId, energySenderId) {
    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Submit the specified transaction.
        // eslint-disable-next-line no-unused-vars
        let result = await contract.submitTransaction('EnergyTrade', energyRate.toString(), energyValue.toString(), energyReceiverId, energySenderId);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'EnergyTrade Transaction has been submitted';
        //return response;
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
};


// energy trade transaction
exports.cashTrade = async function(cashRate, cashValue, cashReceiverId, cashSenderId) {
    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Submit the specified transaction.
        // eslint-disable-next-line no-unused-vars
        let result = await contract.submitTransaction('CashTrade', cashRate.toString(), cashValue.toString(), cashReceiverId, cashSenderId);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        response.msg = 'CashTrade Transaction has been submitted';
        //return response;
        return response;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
};


exports.getAllParticipants = async function(participantType) {

    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Evaluate the specified transaction.
        const responseParticipants = await contract.evaluateTransaction('GetState', participantType);
        const participants = JSON.parse(JSON.parse(responseParticipants.toString()));

        let allParticipants = [];

        for (const participantId of participants) {
            const responseParticipant = await contract.evaluateTransaction('GetState', participantId);
            let participant = JSON.parse(JSON.parse(responseParticipant.toString()));
            allParticipants.push(participant);
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

        return allParticipants;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }

};


exports.getParticipant = async function(participantId) {

    try {

        let response = {};

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Evaluate the specified transaction.
        const responseParticipant = await contract.evaluateTransaction('GetState', participantId);
        let participant = JSON.parse(JSON.parse(responseParticipant.toString()));

        // Disconnect from the gateway.
        await gateway.disconnect();

        return participant;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }

};


exports.getBlockchain = async function() {

    try {

        let response = {};


        const returnBlockchain = [];

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        // eslint-disable-next-line no-unused-vars
        const contract = network.getContract('decentralizedenergy');

        const client = gateway.getClient();

        const channel = client.getChannel('mychannel');
        console.log('Got addressability to channel');

        const blockchainInfo = await channel.queryInfo();
        const height = blockchainInfo.height.low;

        for (let i = 0; i < height; i++) {

            let returnBlock = {};
            let block = await channel.queryBlock(i);

            returnBlock.number = block.header.number;
            returnBlock.data_hash = block.header.data_hash;

            let transactions = [];
            let ns_rwsets = [];
            if (block.data.data && block.data.data.length) {
                returnBlock.num_transactions = block.data.data.length;

                for (let j = 0; j < returnBlock.num_transactions; j++) {
                    let transaction = {};

                    transaction.id = block.data.data[j].payload.header.channel_header.tx_id;
                    transaction.timestamp = block.data.data[j].payload.header.channel_header.timestamp;

                    if (block.data.data[j].payload.data.actions && block.data.data[j].payload.data.actions.length) {
                        let actions_length = block.data.data[j].payload.data.actions.length;
                        for (let k = 0; k < actions_length; k++) {

                            if (block.data.data[j].payload.data.actions[k].payload.action.proposal_response_payload.extension.results.ns_rwset && block.data.data[j].payload.data.actions[k].payload.action.proposal_response_payload.extension.results.ns_rwset.length) {
                                let ns_rwset_length = block.data.data[j].payload.data.actions[k].payload.action.proposal_response_payload.extension.results.ns_rwset.length;

                                for (let l = 0; l < ns_rwset_length; l++) {
                                    let ns_rwset = block.data.data[j].payload.data.actions[k].payload.action.proposal_response_payload.extension.results.ns_rwset[l].rwset;
                                    ns_rwsets.push(ns_rwset);
                                }
                            }
                        }
                    }

                    transaction.ns_rwsets = ns_rwsets;
                    transactions.push(transaction);

                }
            }

            returnBlock.transactions = transactions;
            returnBlockchain.push(returnBlock);

        }


        // Disconnect from the gateway.
        await gateway.disconnect();

        return returnBlockchain;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }

};
