/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fabric_network_1 = require("fabric-network");
var fs = require("fs");
var path = require("path");
var ccpPath = path.resolve(__dirname, '..', 'connection.json');
var ccpJSON = fs.readFileSync(ccpPath, 'utf8');
var ccp = JSON.parse(ccpJSON);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var walletPath, wallet, userExists, gateway, network, contract, residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency, addResidentResponse, bankId, name, coinsBalance, cashBalance, cashCurrency, addBankResponse, utilityCompanyId, name, coinsBalance, energyValue, energyUnits, addUtilityCompanyResponse, residentIdResponse, energyRate, energyValue, energyReceiverId, energySenderId, energyTradeResponse, residentIdResponse2, responseResidents, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    walletPath = path.join(process.cwd(), '_idwallet');
                    wallet = new fabric_network_1.FileSystemWallet(walletPath);
                    console.log("Wallet path: " + walletPath);
                    return [4 /*yield*/, wallet.exists('user1')];
                case 1:
                    userExists = _a.sent();
                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.ts application before retrying');
                        return [2 /*return*/];
                    }
                    gateway = new fabric_network_1.Gateway();
                    return [4 /*yield*/, gateway.connect(ccp, { wallet: wallet, identity: 'user1', discovery: { enabled: false } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, gateway.getNetwork('mychannel')];
                case 3:
                    network = _a.sent();
                    contract = network.getContract('decentralizedenergy');
                    // Submit the specified transaction.
                    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                    //await contract.submitTransaction('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom');
                    //console.log(`Transaction has been submitted`);
                    console.log('\nSubmit AddResident transaction.');
                    residentId = "R1";
                    firstName = "Carlos";
                    lastName = "Roca";
                    coinsBalance = "1000";
                    energyValue = "100";
                    energyUnits = "kwh";
                    cashBalance = "100";
                    cashCurrency = "USD";
                    return [4 /*yield*/, contract.submitTransaction('AddResident', residentId, firstName, lastName, coinsBalance, energyValue, energyUnits, cashBalance, cashCurrency)];
                case 4:
                    addResidentResponse = _a.sent();
                    console.log('addResidentResponse: ');
                    console.log(addResidentResponse.toString('utf8'));
                    console.log('addResidentResponse_JSON.parse: ');
                    console.log(JSON.parse(addResidentResponse.toString()));
                    console.log('\nSubmit AddBank transaction.');
                    bankId = "B1";
                    name = "UNITED";
                    coinsBalance = "10000";
                    cashBalance = "1000";
                    cashCurrency = "USD";
                    return [4 /*yield*/, contract.submitTransaction('AddBank', bankId, name, coinsBalance, cashBalance, cashCurrency)];
                case 5:
                    addBankResponse = _a.sent();
                    console.log('addBankResponse: ');
                    console.log(addBankResponse.toString('utf8'));
                    console.log('addBankResponse_JSON.parse: ');
                    console.log(JSON.parse(addBankResponse.toString()));
                    console.log('\nSubmit AddUtilityCompany transaction.');
                    utilityCompanyId = "U1";
                    name = "United";
                    coinsBalance = "10000";
                    energyValue = "100";
                    energyUnits = "kwh";
                    return [4 /*yield*/, contract.submitTransaction('AddUtilityCompany', utilityCompanyId, name, coinsBalance, energyValue, energyUnits)];
                case 6:
                    addUtilityCompanyResponse = _a.sent();
                    console.log('addUtilityCompanyResponse: ');
                    console.log(addUtilityCompanyResponse.toString('utf8'));
                    console.log('addUtilityCompanyResponse_JSON.parse: ');
                    console.log(JSON.parse(addUtilityCompanyResponse.toString()));
                    console.log('\nGet residentId state: ' + residentId);
                    return [4 /*yield*/, contract.submitTransaction('GetState', residentId)];
                case 7:
                    residentIdResponse = _a.sent();
                    console.log('residentIdResponse: ');
                    console.log(residentIdResponse.toString('utf8'));
                    console.log('residentIdResponse_JSON.parse_response: ');
                    console.log(JSON.parse(residentIdResponse.toString()));
                    console.log('\nSubmit EnergyTrade transaction.');
                    energyRate = "1";
                    energyValue = "10";
                    energyReceiverId = utilityCompanyId;
                    energySenderId = residentId;
                    return [4 /*yield*/, contract.submitTransaction('EnergyTrade', energyRate, energyValue, energyReceiverId, energySenderId)];
                case 8:
                    energyTradeResponse = _a.sent();
                    console.log('energyTradeResponse: ');
                    console.log(energyTradeResponse.toString('utf8'));
                    console.log('energyTradeResponse_JSON.parse: ');
                    console.log(JSON.parse(energyTradeResponse.toString()));
                    console.log('\nGet residentId state.');
                    return [4 /*yield*/, contract.submitTransaction('GetState', residentId)];
                case 9:
                    residentIdResponse2 = _a.sent();
                    console.log('residentIdResponse2: ');
                    console.log(residentIdResponse2.toString('utf8'));
                    console.log('rresidentIdResponse2_JSON.parse_response: ');
                    console.log(JSON.parse(residentIdResponse2.toString()));
                    console.log('\nGet residents');
                    return [4 /*yield*/, contract.submitTransaction('GetState', "residents")];
                case 10:
                    responseResidents = _a.sent();
                    console.log('responseResidents: ');
                    console.log(responseResidents.toString('utf8'));
                    console.log('responseResidents_JSON.parse_response: ');
                    console.log(JSON.parse(responseResidents.toString()));
                    // Disconnect from the gateway.
                    return [4 /*yield*/, gateway.disconnect()];
                case 11:
                    // Disconnect from the gateway.
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    console.error("Failed to submit transaction: " + error_1);
                    process.exit(1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
main();
