import web3 from './web3';
import LotteryFactory from './build/LotteryFactory.json';
import KEYS from '../conf/keys';

console.log(KEYS);

const instance = new web3.eth.Contract(
    JSON.parse(LotteryFactory.interface),
    KEYS.address
);

export default instance;