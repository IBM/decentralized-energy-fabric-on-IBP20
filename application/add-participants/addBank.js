/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'connection.json');
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
        await gateway.connect(ccp, { wallet, identity: participantId, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Submit the specified transaction.
        //console.log('Transaction has been submitted');
        console.log('\nSubmit AddBank transaction.');
        var bankId = "B1";
        var name = "UNITED";
        var coinsBalance = "10000"
        var cashBalance = "1000"
        var cashCurrency = "USD"

        const addBankResponse = await contract.submitTransaction('AddBank', bankId, name, coinsBalance, cashBalance, cashCurrency);
        // console.log('addBankResponse: ');
        // console.log(addBankResponse.toString('utf8'));
        console.log('addBankResponse_JSON.parse: ');
        console.log(JSON.parse(JSON.parse(addBankResponse.toString())));

        console.log('\nGet bankId state: ' + bankId);
        const bankIdResponse = await contract.submitTransaction('GetState', bankId);
        // console.log('bankIdResponse: ')
        // console.log(bankIdResponse.toString('utf8'));
        console.log('bankIdResponse_JSON.parse_response: ')
        console.log(JSON.parse(JSON.parse(bankIdResponse.toString())));


        console.log('\nGet banks');
        const responseBanks = await contract.submitTransaction('GetState', "banks");
        // console.log('responseResidents: ')
        // console.log(responseResidents.toString('utf8'));
        console.log('responseBanks_JSON.parse_response: ')
        console.log(JSON.parse(JSON.parse(responseBanks.toString())));


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

addBank();
