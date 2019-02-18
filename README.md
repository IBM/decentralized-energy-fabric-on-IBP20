# Decentralized Energy with Blockchain


>Hyperledger Fabric sample Fabcar on IBM Blockchain Platform 2.0

This code pattern demonstrates setting up a network on the IBM Blockchain Platform 2.0 and deploying the Decentralized smart contract on the network.  Next, we generate client side certificates so the developer can subsequently enroll an application identity and then submit transactions on the smart contract.   The application is setup with a Node.js server using the Fabric Node SDK to process requests to the network.

A key application of Blockchain being currently explored is a Decentralized Energy network. The idea stems from a neighborhood where certain Residents are producing energy through Solar panels or other means, and can sell excess energy to Residents needing energy. The transactions would be based on coins in each Resident's account. As per a pre-determined contract and rate, the coins would be debited from the consumer and credited to the producer, for a certain billing period. Each transaction would need to be atomic and added to a Blockchain ledger for trust and verification. The network can include Banks to transact coins for Fiat currency (USD). The network can have Utility Company who can buy or provide energy through the network.

The network consists of Residents, Banks and Utility Companies. Residents can exchange coins for energy among each other.  The application assumes a pre-paid system where transactions occur after the energy is consumed and the values are updated.  The Resident can exchange coins for Fiat money (USD) with Banks on the network.  The Residents can also transact coins for energy with a Utility company on the network.

The code pattern demonstrates how a Node.js smart contract can be packaged using the IBM Blockchain Platform Extension for VS Code. Then, using the extension, you can set up a local instance of the Hyperledger Fabric network, on which you can install and instantiate the contract. Lastly, the application is setup with a Node.js server using the Fabric Node SDK to process transactions that communicate with the network.

When you have completed this code pattern, you will understand how to:

* Package the smart contract using IBM Blockchain Platform Extension for VS Code
* Setup a Hyperledger Fabric network on IBM Blockchain Platform 2.0
* Install and instantiate smart contract package onto the IBM Blockchain Platform 2.0
* Develop a Node.js server with the Hyperledger Fabric SDK to interact with the deployed network
* Interact with the contract and execute transactions using the SDK.


# Architecture flow

<p align="center">
  <img src="docs/doc-images/arch-flow.png">
</p>

1. The developer uses the IBM Blockchain Platform Extension for VS Code to package the Decentralized Energy smart contract.
2. Launch the IBM Blockchain Platform 2.0 and Kubernetes Services on the IBM Cloud.
3. Install chaincode on the peer node.
4. Instantiate the chaincode on the peer node.
5. Execute the decentralized energy smart contract transactions from a node.js application.


# Included components
*   [IBM Blockchain Platform 2.0](https://console.bluemix.net/docs/services/blockchain/howto/ibp-v2-deploy-iks.html#ibp-v2-deploy-iks) gives you total control of your blockchain network with a user interface that can simplify and accelerate your journey to deploy and manage blockchain components on the IBM Cloud Kubernetes Service.
*   [IBM Cloud Kubernetes Service](https://www.ibm.com/cloud/container-service) gcreates a cluster of compute hosts and deploys highly available containers. A Kubernetes cluster lets you securely manage the resources that you need to quickly deploy, update, and scale applications.
* [IBM Blockchain Platform Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform) is designed to assist users in developing, testing, and deploying smart contracts -- including connecting to Hyperledger Fabric environments.


## Featured technologies
+ [Hyperledger Fabric v1.4](https://hyperledger-fabric.readthedocs.io) is a platform for distributed ledger solutions, underpinned by a modular architecture that delivers high degrees of confidentiality, resiliency, flexibility, and scalability.
+ [Node.js](https://nodejs.org) is an open source, cross-platform JavaScript run-time environment that executes server-side JavaScript code.

### Prerequisites

- [IBM Cloud account](https://cloud.ibm.com/registration/?target=%2Fdashboard%2Fapps)
- [Node v8.x or greater and npm v5.x or greater](https://nodejs.org/en/download/)
- [VSCode version 1.26 or greater](https://code.visualstudio.com)
- [IBM Blockchain Platform Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform)

# Running the application

Follow these steps to set up and run this code pattern. The steps are described in detail below.

### Steps

1. [Clone the repo](#1-clone-the-repo)
2. [Package the smart contract](#2-package-the-smart-contract)
3. [Create IBM Cloud services](#3-create-ibm-cloud-services)
4. [Build a network](#4-build-a-network)
5. [Deploy Decentralized Energy Smart Contract on the network](#5-deploy-decentralizedenergy-smart-contract-on-the-network)
6. [Connect application to the network](#6-connect-application-to-the-network)
7. [Run the application](#7-run-the-application)


## 1. Clone the repo

Clone this repository in a folder your choice:

```
git clone https://github.com/IBM/decentralized-energy-fabric-IBP20.git
```


## 2. Package the smart contract

We will use the IBM Blockchain Platform extension to package the smart contract.
* Open Visual Studio code and open the `contract` folder from Decentralized Energy repository that was cloned earlier.

* Press the `F1` key to see the different VS code options. Choose `IBM Blockchain Platform: Package a Smart Contract Project`.

<p align="center">
  <img src="docs/doc-images/vs-code-options.png">
</p>


* Click the `IBM Blockchain Platform` extension button on the left. This will show the packaged contracts on top and the blockchain connections on the bottom.

<p align="center">
  <img height="500" src="docs/doc-images/ibm-blockchain-extension.png">
</p>

* Next, right click on the packaged contract (in this case, select decentralized-energy@0.0.1) to export it and choose `Export Package`.

* Choose a location on your machine and save `.cds` file.  We will use this packages smart contract later to deploy on the IBM Blockchain Platform 2.0 service.


Now, we will start creating our Hyperledger Fabric network on the IBM Cloud.

## 3. Create IBM Cloud services

* Create the [IBM Cloud Kubernetes Service](https://cloud.ibm.com/catalog/infrastructure/containers-kubernetes).  You can find the service in the `Catalog`.  For this code pattern, we can use the `Free` cluster, and give it a name.  Note, that the IBM Cloud allows one instance of a free cluster and expires after 30 days.

<br>
<p align="center">
  <img src="docs/doc-gifs/create-ibm-kubernetes-service.gif">
</p>
<br>

* Create the [IBM Blockchain Platform 2.0](https://console.bluemix.net/catalog/services/blockchain/) service on the IBM Cloud.  You can find the service in the `Catalog`, and give a name.

<br>
<p align="center">
  <img src="docs/doc-gifs/create-ibm-blockchain-2-service.gif">
</p>
<br>

* After your kubernetes cluster is up and running, you can deploy your IBM Blockchain Platform on the cluster.  The service walks through few steps and finds your cluster on the IBM Cloud to deploy the service on.

<br>
<p align="center">
  <img src="docs/doc-gifs/deploy-blockchain-on-cluster.gif">
</p>
<br>

* Once the Blockchain Platform is deployed on the Kubernetes cluster, you can launch the console to start operating on your blockchain network.

<br>
<p align="center">
  <img src="docs/doc-gifs/launch-ibm-blockchain.gif">
</p>
<br>

## 4. Build a network

We will build a network as provided by the IBM Blockchain Platform [documentation](https://console.bluemix.net/docs/services/blockchain/howto/ibp-console-build-network.html#ibp-console-build-network).  This will include creating a channel with a single peer organization with its own MSP and CA (Certificate Authority), and an orderer organization with its own MSP and CA. We will create the respective identities to deploy peers and operate nodes.

### Create your organization and your entry point to your blockchain

* #### Create your peer organization CA
  - Click <b>Add Certificate Authority</b>.
  - Click <b>IBM Cloud</b> under <b>Create Certificate Authority</b> and <b>Next</b>.
  - Give it a <b>Display name</b> of `Org1 CA`.  
  - Specify an <b>Admin ID</b> of `admin` and <b>Admin Secret</b> of `adminpw`.

<br>
<p align="center">
  <img src="docs/doc-gifs/create-peer-org1-ca.gif">
</p>
<br>


* #### Use your CA to register identities
  - Select the <b>Org 1 CA</b> Certificate Authority that we created.
  - First, we will register an admin for our organization "org1". Click on the <b>Register User</b> button.  Give an <b>Enroll ID</b> of `org1admin`, and <b>Enroll Secret</b> of `org1adminpw`.  Click <b>Next</b>.  Set the <b>Type</b> for this identity as `client` and select from any of the affiliated organizations from the drop-down list. We will leave the <b>Maximum enrollments</b> and <b>Add Attributes</b> fields blank.
  - We will repeat the process to create an identity of the peer. Click on the <b>Register User</b> button.  Give an <b>Enroll ID</b> of `peer1`, and <b>Enroll Secret</b> of `peer1pw`.  Click <b>Next</b>.  Set the <b>Type</b> for this identity as `peer` and select from any of the affiliated organizations from the drop-down list. We will leave the <b>Maximum enrollments</b> and <b>Add Attributes</b> fields blank.

<br>
<p align="center">
  <img src="docs/doc-gifs/org1-ca-register-identities.gif">
</p>
<br>


* #### Create the peer organization MSP definition
  - Navigate to the <b>Organizations</b> tab in the left navigation and click <b>Create MSP definition</b>.
  - Enter the <b>MSP Display name</b> as `Org1 MSP` and an <b>MSP ID</b> of `org1msp`.
  - Under <b>Root Certificate Authority</b> details, specify the peer CA that we created `Org1 CA` as the root CA for the organization.
  - Give the <b>Enroll ID</b> and <b>Enroll secret</b> for your organization admin, `org1admin` and `org1adminpw`. Then, give the Identity name, `Org1 Admin`.
  - Click the <b>Generate</b> button to enroll this identity as the admin of your organization and export the identity to the wallet. Click <b>Export</b> to export the admin certificates to your file system. Finally click <b>Create MSP definition</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/peer-org-msp-def.gif">
</p>
<br>


* Create a peer
  - On the <b>Nodes</b> page, click <b>Add peer</b>.
  - Click <b>IBM Cloud</b> under Create a new peer and <b>Next</b>.
  - Give your peer a <b>Display name</b> of `Peer Org1`.
  - On the next screen, select `Org1 CA` as your <b>Certificate Authority</b>. Then, give the <b>Enroll ID</b> and <b>Enroll secret</b> for the peer identity that you created for your peer, `peer1`, and `peer1pw`. Then, select the <b>Administrator Certificate (from MSP)</b>, `Org1 MSP`, from the drop-down list and click <b>Next</b>.
  - Give the <b>TLS Enroll ID</b>, `admin`, and <b>TLS Enroll secret</b>, `adminpw`, the same values are the Enroll ID and Enroll secret that you gave when creating the CA.  Leave the <b>TLS CSR hostname</b> blank.
  - The last side panel will ask you to <b>Associate an identity</b> and make it the admin of your peer. Select your peer admin identity `Org1 Admin`.
  - Review the summary and click <b>Submit</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/create-peer.gif">
</p>
<br>

### Create the node that orders transactions

* #### Create your orderer organization CA
  - Click <b>Add Certificate Authority</b>.
  - Click <b>IBM Cloud</b> under <b>Create Certificate Authority</b> and <b>Next</b>.
  - Give it a unique <b>Display name</b> of `Orderer CA`.  
  - Specify an <b>Admin ID</b> of `admin` and <b>Admin Secret</b> of `adminpw`.

<br>
<p align="center">
  <img src="docs/doc-gifs/orderer-org-ca.gif">
</p>
<br>

* #### Use your CA to register orderer and orderer admin identities
  - In the <b>Nodes</b> tab, select the <b>Orderer CA</b> Certificate Authority that we created.
  - First, we will register an admin for our organization. Click on the <b>Register User</b> button.  Give an <b>Enroll ID</b> of `ordereradmin`, and <b>Enroll Secret</b> of `ordereradminpw`.  Click <b>Next</b>.  Set the <b>Type</b> for this identity as `client` and select from any of the affiliated organizations from the drop-down list. We will leave the <b>Maximum enrollments</b> and <b>Add Attributes</b> fields blank.
  - We will repeat the process to create an identity of the orderer. Click on the <b>Register User</b> button.  Give an <b>Enroll ID</b> of `orderer1`, and <b>Enroll Secret</b> of `orderer1pw`.  Click <b>Next</b>.  Set the <b>Type</b> for this identity as `peer` and select from any of the affiliated organizations from the drop-down list. We will leave the <b>Maximum enrollments</b> and <b>Add Attributes</b> fields blank.

<br>
<p align="center">
  <img src="docs/doc-gifs/orderer-ca-register-identities.gif">
</p>
<br>


* #### Create the orderer organization MSP definition
  - Navigate to the <b>Organizations</b> tab in the left navigation and click <b>Create MSP definition</b>.
  - Enter the <b>MSP Display name</b> as `Orderer MSP` and an <b>MSP ID</b> of `orderermsp`.
  - Under <b>Root Certificate Authority</b> details, specify the peer CA that we created `Orderer CA` as the root CA for the organization.
  - Give the <b>Enroll ID</b> and <b>Enroll secret</b> for your organization admin, `ordereradmin` and `ordereradminpw`. Then, give the <b>Identity name</b>, `Orderer Admin`.
  - Click the <b>Generate</b> button to enroll this identity as the admin of your organization and export the identity to the wallet. Click <b>Export</b> to export the admin certificates to your file system. Finally click <b>Create MSP definition</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/orderer-org-msp-def.gif">
</p>
<br>

* #### Create an orderer
  - On the <b>Nodes</b> page, click <b>Add orderer</b>.
  - Click <b>IBM Cloud</b> and proceed with <b>Next</b>.
  - Give your peer a <b>Display name</b> of `Orderer`.
  - On the next screen, select `Orderer CA` as your <b>Certificate Authority</b>. Then, give the <b>Enroll ID</b> and <b>Enroll secret</b> for the peer identity that you created for your orderer, `orderer1`, and `orderer1pw`. Then, select the <b>Administrator Certificate (from MSP)</b>, `Orderer MSP`, from the drop-down list and click <b>Next</b>.
  - Give the <b>TLS Enroll ID</b>, `admin`, and <b>TLS Enroll secret</b>, `adminpw`, the same values are the Enroll ID and Enroll secret that you gave when creating the CA.  Leave the <b>TLS CSR hostname</b> blank.
  - The last side panel will ask to <b>Associate an identity</b> and make it the admin of your peer. Select your peer admin identity `Orderer Admin`.
  - Review the summary and click <b>Submit</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/create-orderer.gif">
</p>
<br>

* #### Add organization as Consortium Member on the orderer to transact
  - Navigate to the <b>Nodes</b> tab, and click on the <b>Orderer</b> that we created.
  - Under <b>Consortium Members</b>, click <b>Add organization</b>.
  - From the drop-down list, select `Org1 MSP`, as this is the MSP that represents the peer's organization org1.
  - Click <b>Submit</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/add-org-orderer.gif">
</p>
<br>


### Create and join channel

* #### Create the channel
  - Navigate to the <b>Channels</b> tab in the left navigation.
  - Click <b>Create channel</b>.
  - Give the channel a name, `mychannel`.
  - Select the orderer you created, `Orderer` from the orderers drop-down list.
  - Select the MSP identifying the organization of the channel creator from the drop-down list. This should be `Org1 MSP (org1msp)`.
  - Associate available identity as `Org1 Admin`.
  - Click <b>Add</b> next to your organization. Make your organization an <b>Operator</b>.
  - Click <b>Create</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/create-channel.gif">
</p>
<br>


* #### Join your peer to the channel
  - Click <b>Join channel</b> to launch the side panels.
  - Select your `Orderer` and click <b>Next</b>.
  - Enter the name of the channel you just created. `mychannel` and click <b>Next</b>.
  - Select which peers you want to join the channel, click `Peer Org1` .
  - Click <b>Submit</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/join-channel.gif">
</p>
<br>


## 5. Deploy Decentralized Energy Smart Contract on the network


* #### Install a smart contract
  - Click the <b>Smart contracts</b> tab to install the smart contract.
  - Click <b>Install smart contract</b> to upload the Decentralized smart contract package file, which you packaged earlier using the Visual Studio code extension.
  - Click on <b>Add file</b> and find your packaged smart contract.  
  - Once the contract is uploaded, click <b>Install</b>.


<br>
<p align="center">
  <img src="docs/doc-gifs/install-smart-contract.gif">
</p>
<br>

* #### Instantiate smart contract
  - On the smart contracts tab, find the smart contract from the list installed on your peers and click <b>Instantiate</b> from the overflow menu on the right side of the row.
  - On the side panel that opens, select the channel, `mychannel` to instantiate the smart contract on. Click <b>Next</b>.
  - Select the organization members to be included in the policy, `org1msp`.  Click <b>Next</b>.
  - Give <b>Function name</b> of `instantiate` and leave <b>Arguments</b> blank. **Note:** `instantiate` is the method in the `my-contract.js` file that initiates the smart contracts on the peer.  Some may name this `initLedger`.
  - Click <b>Instantiate</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/instantiate-smart-contract.gif">
</p>
<br>

## 6. Connect application to the network

* #### Connect with sdk through connection profile
  - Under the Instantiated Smart Contract, click on `Connect with SDK` from the overflow menu on the right side of the row.
  - Choose from the dropdown for <b>MSP for connection</b>, `org1msp`.
  - Choose from <b>Certificate Authority</b> dropdown, `Org1 CA`.
  - Download the connection profile by scrolling down and clicking <b>Download Connection Profile</b>.  This will download the connection json which we will use soon to establish connection.
  - You can click <b>Close</b> once the download completes.

<br>
<p align="center">
  <img src="docs/doc-gifs/connect-with-sdk.gif">
</p>
<br>

* #### Create an application admin
  - Go to the <b>Nodes</b> tab on the left bar, and under <b>Certif Authorities</b>, choose your organization CA, <b>Org1 CA</b>.
  - Click on <b>Register user</b>.
  - Give an <b>Enroll ID</b> and <b>Enroll Secret</b> to administer your application users, `app-admin` and `app-adminpw`.
  - Choose `client` as <b>Type</b> and any organization for affiliation.  We can pick `org1` to be consistent.
  - You can leave the <b>Maximum enrollments</b> blank.
  - Under <b>Attributes</b>, click on <b>Add attribute</b>.  Give attribute as `hf.Registrar.Roles` = `*`.  This will allow this identity to act as registrar and issues identities for our app.  Click <b>Add-attribute</b>.
  - Click <b>Register</b>.

<br>
<p align="center">
  <img src="docs/doc-gifs/register-app-admin.gif">
</p>
<br>


* #### Update application connection
  - Copy the connection profile you downloaded into [server folder](web-app/server)
  - Update the [config.json](web-app/server/config.json) file with:
    - The connection json file name you downloaded.
    - The <b>enroll id</b> and <b>enroll secret</b> for your app admin, which we earlier provided as `app-admin` and `app-adminpw`.
    - The orgMSP ID, which we provided as `org1msp`.
    - The caName, which can be found in your connection json file under "organization" -> "org1msp" -> certificateAuthorities". This would be like an IP address and a port.
    - The username you would like to register.
    - Update gateway discovery to `{ enabled: true, asLocalhost: false }` to connect to IBP.

> the current default setup is to connect to a local fabric instance from VS Code

```bash
 {
    "connection_file": "mychannel_fabcar_profile.json",
    "channel_name": "mychannel",
    "smart_contract_name": "decentralizedenergy",
    "appAdmin": "app-admin",
    "appAdminSecret": "app-adminpw",
    "orgMSPID": "org1msp",
    "caName": "169.46.208.151:30404",
    "userName": "user1",
    "gatewayDiscovery": { "enabled": true, "asLocalhost": false }
 }
    ```



## 7. Run the application

* #### Enroll admin
  - First, navigate to the `web-app` directory, and install the node dependencies.
    ```bash
    cd web-app/server
    npm install
    ```

  - Run the `enrollAdmin.js` script
    ```bash
    node enrollAdmin.js
    ```

  - You should see the following in the terminal:
    ```bash
    msg: Successfully enrolled admin user app-admin and imported it into the wallet
    ```


  - Run the `invoke.js` script to execute the transactions on the smart contract
    ```bash
    node invoke.js
    ```

  - You should see the following in the terminal:
    ```bash
    msg:  Submit AddResident transaction. info: [TransactionEventHandler]: _strategySuccess: strategy success for transaction "4ae2d2e3cad8cb52bc8f59518905919d693b4cc036405be0f25108ba623d67f5" 
    
    ...

    ```


## Extending the code pattern
This application can be expanded in a couple of ways:
* Create a wallet for every member and use the member's wallet to interact with the application.
* Add a UI application in place of the `invoke.js` node application to execute the transactions.


## Links
* [Hyperledger Fabric Docs](http://hyperledger-fabric.readthedocs.io/en/latest/)
* [Zero to Blockchain](https://www.redbooks.ibm.com/Redbooks.nsf/RedbookAbstracts/crse0401.html?Open)
* [IBM Code Patterns for Blockchain](https://developer.ibm.com/patterns/category/blockchain/)

## License
This code pattern is licensed under the Apache Software License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
