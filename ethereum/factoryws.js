import web3 from './web3ws';
import LotteryFactory from './build/LotteryFactory.json';
import KEYS from '../conf/keys';

const instance = new web3.eth.Contract(
    JSON.parse(LotteryFactory.interface),
    KEYS.address
);

export default instance;