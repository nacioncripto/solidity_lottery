/*
    - Rename this file to dev.js and fill the address and infuraKey values.
    - Don't commit your dev.js. It is only for working in your local.
*/
const CONF = {
    address: '',
    infuraKey: '',
    addressPhrase: '',
    buildFolder: 'build',
    baseExplorerUrl: 'https://rinkeby.etherscan.io/',
    gasLimitToDeploy: '1500000'
};
CONF.explorerUrl = CONF.baseExplorerUrl + 'address/',
CONF.blockExplorer = CONF.baseExplorerUrl + 'block/';
CONF.txExplorer = CONF.baseExplorerUrl + 'tx/';
CONF.infuraUrl = `https://rinkeby.infura.io/${CONF.infuraKey}`;
CONF.contractExplorerUrl = CONF.explorerUrl + CONF.address;
module.exports = CONF;