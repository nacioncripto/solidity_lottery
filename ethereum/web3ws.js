import Web3 from 'web3';
import KEYS from '../conf/keys';

//We are on the server *OR* the user is not running metamask
const provider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws');
const web3 = new Web3(provider);

export default web3;