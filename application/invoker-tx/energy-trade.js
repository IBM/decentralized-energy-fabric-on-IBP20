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
const participantId = 'R1';
const utilityCompanyId = 'U1';
const residentId = 'R1';

async function tradeEnergy() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '..', '_idwallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(participantId);
        if (!userExists) {
            console.log(`An identity for the user "${participantId}" does not exist in the wallet`);
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
        console.log('\nSubmit EnergyTrade transaction.');
        let energyRate = '1';
        let energyValue = '10';
        let energyReceiverId = utilityCompanyId;
        let energySenderId = residentId;

        const energyTradeResponse = await contract.submitTransaction('EnergyTrade', energyRate, energyValue, energyReceiverId, energySenderId);
        // console.log('energyTradeResponse: ')
        // console.log(energyTradeResponse.toString('utf8'));
        console.log('response: ');
        console.log(JSON.parse(JSON.parse(energyTradeResponse.toString())));

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

tradeEnergy();
