'use strict';

 const { FileSystemWallet, Gateway } = require('fabric-network');
 const fs = require('fs');
 const path = require('path');

 async function main() {
   try {


// capture network variables from config.json
const configPath = path.join(process.cwd(), 'config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var appAdmin = config.appAdmin;
var channelName = config.channel_name;
var smartContractName = config.smart_contract_name;
var appAdminSecret = config.appAdminSecret;
var orgMSPID = config.orgMSPID;
var caName = config.caName;

const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

     // Parse the connection profile. This would be the path to the file downloaded
     // from the IBM Blockchain Platform operational console.
     //const ccpPath = path.resolve(__dirname, 'connection.json');
     //const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

     // Configure a wallet. This wallet must already be primed with an identity that
     // the application can use to interact with the peer node.
     //const walletPath = path.resolve(__dirname, 'wallet');
     const walletPath = path.join(process.cwd(), 'wallet');
     const wallet = new FileSystemWallet(walletPath);

     // Create a new gateway, and connect to the gateway peer node(s). The identity
     // specified must already exist in the specified wallet.
     const gateway = new Gateway();
     await gateway.connect(ccp, { wallet, identity: appAdmin , discovery: {enabled: true, asLocalhost:false }});

     // Get the network channel that the smart contract is deployed to.
     const network = await gateway.getNetwork(channelName);

     // Get the smart contract from the network channel.
     const contract = network.getContract(smartContractName);

     // Submit the 'addResident' transaction to the smart contract, and wait for it
     // to be committed to the ledger


     console.log('\nSubmit AddResident transaction.');
     var residentId = "R1";
     var firstName = "Carlos";
     var lastName = "Roca";
     var coinsBalance = "1000";
     var energyValue = "100";
     var energyUnits = "kwh";
     var cashBalance = "100";
     var cashCurrency = "USD"; 
             
     await contract.submitTransaction('AddResident', 'R1', firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency);
     console.log('Transaction has been submitted');

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


     await gateway.disconnect();

     } catch (error) {
       console.error(`Failed to submit transaction: ${error}`);
       process.exit(1);
     }
   }
 main();
