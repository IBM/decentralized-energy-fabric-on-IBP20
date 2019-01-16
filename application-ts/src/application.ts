/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { FileSystemWallet, Gateway } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

const ccpPath = path.resolve(__dirname, '..', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {   

    // Main try/catch block
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '_idwallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
  
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.ts application before retrying');
            return;
        }
  
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
  
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
  
        // Get the contract from the network.
        const contract = network.getContract('decentralizedenergy');
  
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        //await contract.submitTransaction('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom');
        //console.log(`Transaction has been submitted`);
  
        console.log('\nSubmit AddResident transaction.');
        var residentId = "R1";
        var firstName = "Carlos";
        var lastName = "Roca";
        var coinsBalance = "1000";
        var energyValue = "100";
        var energyUnits = "kwh";
        var cashBalance = "100";
        var cashCurrency = "USD";        

        const addResidentResponse = await contract.submitTransaction('AddResident', residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency);
        console.log('addResidentResponse: ');
        console.log(addResidentResponse.toString('utf8'));
        console.log('addResidentResponse_JSON.parse: ');
        console.log(JSON.parse(addResidentResponse.toString()));

        console.log('\nSubmit AddBank transaction.');
        var bankId = "B1"; 
        var name = "UNITED"; 
        var coinsBalance = "10000" 
        var cashBalance = "1000"
        var cashCurrency = "USD"
        
        const addBankResponse = await contract.submitTransaction('AddBank', bankId, name, coinsBalance, cashBalance, cashCurrency);
        console.log('addBankResponse: ');
        console.log(addBankResponse.toString('utf8'));
        console.log('addBankResponse_JSON.parse: ')
        console.log(JSON.parse(addBankResponse.toString()));
        
        
        console.log('\nSubmit AddUtilityCompany transaction.');
        var utilityCompanyId = "U1";
        var name = "United";
        var coinsBalance = "10000";
        var energyValue = "100";
        var energyUnits = "kwh";

        const addUtilityCompanyResponse = await contract.submitTransaction('AddUtilityCompany', utilityCompanyId, name, coinsBalance, energyValue, energyUnits);
        console.log('addUtilityCompanyResponse: ')
        console.log(addUtilityCompanyResponse.toString('utf8'));
        console.log('addUtilityCompanyResponse_JSON.parse: ')
        console.log(JSON.parse(addUtilityCompanyResponse.toString()));

        console.log('\nGet residentId state: ' + residentId);
        const residentIdResponse = await contract.submitTransaction('GetState', residentId);
        console.log('residentIdResponse: ')
        console.log(residentIdResponse.toString('utf8'));
        console.log('residentIdResponse_JSON.parse_response: ')
        console.log(JSON.parse(residentIdResponse.toString()));


        console.log('\nSubmit EnergyTrade transaction.');
        var energyRate = "1";
        var energyValue = "10";
        var energyReceiverId = utilityCompanyId;
        var energySenderId = residentId;

        const energyTradeResponse = await contract.submitTransaction('EnergyTrade', energyRate, energyValue, energyReceiverId, energySenderId);
        console.log('energyTradeResponse: ')
        console.log(energyTradeResponse.toString('utf8'));
        console.log('energyTradeResponse_JSON.parse: ')
        console.log(JSON.parse(energyTradeResponse.toString()));

        console.log('\nGet residentId state.');
        const residentIdResponse2 = await contract.submitTransaction('GetState', residentId);
        console.log('residentIdResponse2: ')
        console.log(residentIdResponse2.toString('utf8'));
        console.log('rresidentIdResponse2_JSON.parse_response: ')
        console.log(JSON.parse(residentIdResponse2.toString()));

        console.log('\nGet residents');
        const responseResidents = await contract.submitTransaction('GetState', "residents");        
        console.log('responseResidents: ')
        console.log(responseResidents.toString('utf8'));
        console.log('responseResidents_JSON.parse_response: ')
        console.log(JSON.parse(responseResidents.toString()));
  
        // Disconnect from the gateway.
        await gateway.disconnect();
  
  
      } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
      
      } 
}

main();