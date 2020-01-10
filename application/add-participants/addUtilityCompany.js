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

// ID from wallet for the utility company
const participantId = 'U1';

async function addUtilityCompany() {
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
        console.log('\nSubmit "AddUtilityCompany" transaction.');
        let utilityCompanyId = 'U1';
        let name = 'United';
        let coinsBalance = '10000';
        let energyValue = '100';
        let energyUnits = 'kwh';

        const addUtilityCompanyResponse = await contract.submitTransaction('AddUtilityCompany', utilityCompanyId, name, coinsBalance, energyValue, energyUnits);
        console.log('addUtilityCompanyResponse_JSON.parse: ');
        console.log(JSON.parse(JSON.parse(addUtilityCompanyResponse.toString())));

        console.log('\nGet utilityCompanyId state: ' + utilityCompanyId);
        const utilityCompanyIdResponse = await contract.evaluateTransaction('GetState', utilityCompanyId);
        console.log('utilityCompanyIdResponse_JSON.parse_response: ');
        console.log(JSON.parse(JSON.parse(utilityCompanyIdResponse.toString())));


        console.log('\nGet utility companies');
        const responseResidents = await contract.evaluateTransaction('GetState', 'utilityCompanies');
        console.log('responseResidents_JSON.parse_response: ');
        console.log(JSON.parse(JSON.parse(responseResidents.toString())));


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

addUtilityCompany();
