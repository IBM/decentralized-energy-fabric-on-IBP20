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
        let connection_file = config.connection_file;
        let appAdmin = config.appAdmin;
        let channelName = config.channel_name;
        let smartContractName = config.smart_contract_name;

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
        let residentId = 'R1';
        let firstName = 'Carlos';
        let lastName = 'Roca';
        let coinsBalance = '1000';
        let energyValue = '100';
        let energyUnits = 'kwh';
        let cashBalance = '100';
        let cashCurrency = 'USD';

        await contract.submitTransaction('AddResident', 'R1', firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency);
        console.log('Transaction has been submitted');

        console.log('\nSubmit AddBank transaction.');
        let bankId = 'B1';
        let name = 'UNITED';
        coinsBalance = '10000';
        cashBalance = '1000';
        cashCurrency = 'USD';

        const addBankResponse = await contract.submitTransaction('AddBank', bankId, name, coinsBalance, cashBalance, cashCurrency);
        console.log('addBankResponse: ');
        console.log(addBankResponse.toString('utf8'));
        console.log('addBankResponse_JSON.parse: ');
        console.log(JSON.parse(addBankResponse.toString()));


        console.log('\nSubmit AddUtilityCompany transaction.');
        let utilityCompanyId = 'U1';
        name = 'United';
        coinsBalance = '10000';
        energyValue = '100';
        energyUnits = 'kwh';

        const addUtilityCompanyResponse = await contract.submitTransaction('AddUtilityCompany', utilityCompanyId, name, coinsBalance, energyValue, energyUnits);
        console.log('addUtilityCompanyResponse: ');
        console.log(addUtilityCompanyResponse.toString('utf8'));
        console.log('addUtilityCompanyResponse_JSON.parse: ');
        console.log(JSON.parse(addUtilityCompanyResponse.toString()));

        console.log('\nGet residentId state: ' + residentId);
        const residentIdResponse = await contract.submitTransaction('GetState', residentId);
        console.log('residentIdResponse: ');
        console.log(residentIdResponse.toString('utf8'));
        console.log('residentIdResponse_JSON.parse_response: ');
        console.log(JSON.parse(residentIdResponse.toString()));


        console.log('\nSubmit EnergyTrade transaction.');
        let energyRate = '1';
        energyValue = '10';
        let energyReceiverId = utilityCompanyId;
        let energySenderId = residentId;

        const energyTradeResponse = await contract.submitTransaction('EnergyTrade', energyRate, energyValue, energyReceiverId, energySenderId);
        console.log('energyTradeResponse: ');
        console.log(energyTradeResponse.toString('utf8'));
        console.log('energyTradeResponse_JSON.parse: ');
        console.log(JSON.parse(energyTradeResponse.toString()));

        console.log('\nGet residentId state.');
        const residentIdResponse2 = await contract.submitTransaction('GetState', residentId);
        console.log('residentIdResponse2: ');
        console.log(residentIdResponse2.toString('utf8'));
        console.log('rresidentIdResponse2_JSON.parse_response: ');
        console.log(JSON.parse(residentIdResponse2.toString()));

        console.log('\nGet residents');
        const responseResidents = await contract.submitTransaction('GetState', 'residents');
        console.log('responseResidents: ');
        console.log(responseResidents.toString('utf8'));
        console.log('responseResidents_JSON.parse_response: ');
        console.log(JSON.parse(responseResidents.toString()));


        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
main();
