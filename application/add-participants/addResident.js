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
        await gateway.connect(ccp, { wallet, identity: participantId, discovery: gatewayDiscovery });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');

        // Submit the specified transaction.
        //console.log('Transaction has been submitted');
        console.log('\nSubmit "AddResident" transaction.');
        let residentId = 'R1';
        let firstName = 'Carlos';
        let lastName = 'Roca';
        let coinsBalance = '1000';
        let energyValue = '100';
        let energyUnits = 'kwh';
        let cashBalance = '100';
        let cashCurrency = 'USD';

        const addResidentResponse = await contract.submitTransaction('AddResident', residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency);
        console.log('addResidentResponse_JSON.parse: ');
        console.log(JSON.parse(JSON.parse(addResidentResponse.toString())));

        console.log('\nGet residentId state: ' + residentId);
        const residentIdResponse = await contract.evaluateTransaction('GetState', residentId);
        console.log('residentIdResponse_JSON.parse_response: ');
        console.log(JSON.parse(JSON.parse(residentIdResponse.toString())));


        console.log('\nGet residents');
        const responseResidents = await contract.evaluateTransaction('GetState', 'residents');
        console.log('responseResidents_JSON.parse_response: ');
        console.log(JSON.parse(JSON.parse(responseResidents.toString())));

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

addResident();
