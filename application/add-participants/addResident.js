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

// ID from wallet for the resident
const participantId = 'R1';

async function addResident() {
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
        console.log('\nSubmit "AddResident" transaction.');
        var residentId = "R1";
        var firstName = "Carlos";
        var lastName = "Roca";
        var coinsBalance = "1000";
        var energyValue = "100";
        var energyUnits = "kwh";
        var cashBalance = "100";
        var cashCurrency = "USD";

        const addResidentResponse = await contract.submitTransaction('AddResident', residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency);
        // console.log('addResidentResponse: ');
        // console.log(addResidentResponse.toString('utf8'));
        console.log('addResidentResponse_JSON.parse: ');
        console.log(JSON.parse(JSON.parse(addResidentResponse.toString())));

        console.log('\nGet residentId state: ' + residentId);
        const residentIdResponse = await contract.submitTransaction('GetState', residentId);
        // console.log('residentIdResponse: ')
        // console.log(residentIdResponse.toString('utf8'));
        console.log('residentIdResponse_JSON.parse_response: ')
        console.log(JSON.parse(JSON.parse(residentIdResponse.toString())));


        console.log('\nGet residents');
        const responseResidents = await contract.submitTransaction('GetState', "residents");
        // console.log('responseResidents: ')
        // console.log(responseResidents.toString('utf8'));
        console.log('responseResidents_JSON.parse_response: ')
        console.log(JSON.parse(JSON.parse(responseResidents.toString())));


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

addResident();
