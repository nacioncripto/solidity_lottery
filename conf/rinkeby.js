/*
    This configuration file is used when the application is deployed in a server (such as Heroku). The variables must be added in the server to allow the application read them on starting up. 
*/

const CONF = {
    address2: process.env.ADDRESS,
    address: '0xA847020423447951785f94238c7F395b85dB87E8',
    infuraKey: process.env.INFURA_KEY,
    addressPhrase: 'Not needed in prod',
    buildFolder: 'Not needed in prod',
    explorerUrl: 'https://rinkeby.etherscan.io/address/',
    gasLimitToDeploy: 'Not needed in prod'
};
CONF.infuraUrl = `https://rinkeby.infura.io/${CONF.infuraKey}`;
CONF.contractExplorerUrl = CONF.explorerUrl + CONF.address;
module.exports = CONF;