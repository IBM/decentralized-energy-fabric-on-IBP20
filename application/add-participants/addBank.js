/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// capture network variables from config.json
const configPath = path.join(process.cwd(), '..', '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let gatewayDiscovery = config.gatewayDiscovery;

const ccpPath = path.resolve(__dirname, '..', connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// ID from wallet for the participant
const participantId = 'B1';

async function addBank() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..', '_idwallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(participantId);
        if (!userExists) {
            console.log('An identity for the user' + participantId + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: participantId, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Submit the specified transaction.
        //console.log('Transaction has been submitted');
        console.log('\nSubmit AddBank transaction.');
        let bankId = 'B1';
        let name = 'UNITED';
        let coinsBalance = '10000';
        let cashBalance = '1000';
        let cashCurrency = 'USD';

        const addBankResponse = await contract.submitTransaction('AddBank', bankId, name, coinsBalance, cashBalance, cashCurrency);
        // console.log('addBankResponse: ');
        // console.log(addBankResponse.toString('utf8'));
        console.log('addBankResponse_JSON.parse: ');
        console.log(JSON.parse(JSON.parse(addBankResponse.toString())));

        console.log('\nGet bankId state: ' + bankId);
        const bankIdResponse = await contract.evaluateTransaction('GetState', bankId);
        console.log('bankIdResponse_JSON.parse_response: ');
        console.log(JSON.parse(JSON.parse(bankIdResponse.toString())));


        console.log('\nGet banks');
        const responseBanks = await contract.evaluateTransaction('GetState', 'banks');
        console.log('responseBanks_JSON.parse_response: ');
        console.log(JSON.parse(JSON.parse(responseBanks.toString())));


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

addBank();
