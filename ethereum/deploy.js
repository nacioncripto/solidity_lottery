const path = require('path');
const fs = require('fs-extra');
const HDWallerProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const KEYS = require('../conf/keys');

const provider = new HDWallerProvider(KEYS.addressPhrase, KEYS.infuraUrl);
const web3 = new Web3(provider);

const JSON_EXTENSION = '.json';
/*
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.info('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                .deploy({ data: compiledFactory.bytecode })
                .send({ from: accounts[0], gas: '1000000'});

    console.info('Contract deployed to', result.options.address);                
};
*/
//deploy();

if(process.argv.length <= 2) {
    throw Error('At least a contract to deploy.');
}

const contracts = [];

process.argv.forEach(function (val, index, array) {
    if(index > 1) {
        contracts.push(val);
    }
});

console.log(`Contracts to deploy: ${contracts}`);

const buildPath = path.resolve(__dirname, KEYS.buildFolder);

const deployItem = async (file) => {
    const fullFile = path.join(buildPath, file);
	if (!fs.statSync(fullFile).isDirectory()) {
		const extensionIndex = file.indexOf(JSON_EXTENSION);
		const extensionPosition = file.length - JSON_EXTENSION.length;
		if ( extensionIndex == extensionPosition ) {
            console.info(`Deploying contract ${fullFile}`);
            let compiledContract;

            try {
                compiledContract = require(fullFile);
            } catch (err) {
                console.error(`Invalid contract file path ${fullFile}`);
                throw err;
            }
            
            const accounts = await web3.eth.getAccounts();
            const deployWithAccount = accounts[0];

            console.info(`Attempting to deploy from account ${deployWithAccount}`);

            const result = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
                        .deploy({ data: compiledContract.bytecode })
                        .send({ from: deployWithAccount, gas: KEYS.gasLimitToDeploy});
            console.info(`Contract ${file} deployed to ${result.options.address}`);
		}
	}
};

contracts.forEach(function(file) {
    deployItem(file);
});

