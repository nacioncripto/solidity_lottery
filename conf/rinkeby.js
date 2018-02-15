/*
    This configuration file is used when the application is deployed in a server (such as Heroku). The variables must be added in the server to allow the application read them on starting up. 
*/

const CONF = {
    address: '0x55b291F2B5249F634318C635253ee2A845F05Ad9',
    infuraKey: process.env.INFURA_KEY,
    addressPhrase: 'Not needed in prod',
    buildFolder: 'Not needed in prod',
    baseExplorerUrl: 'https://rinkeby.etherscan.io/',
    gasLimitToDeploy: 'Not needed in prod'
};
CONF.explorerUrl = CONF.baseExplorerUrl + 'address/',
CONF.blockExplorer = CONF.baseExplorerUrl + 'block/';
CONF.txExplorer = CONF.baseExplorerUrl + 'tx/';
CONF.infuraUrl = `https://rinkeby.infura.io/${CONF.infuraKey}`;
CONF.contractExplorerUrl = CONF.explorerUrl + CONF.address;
module.exports = CONF;