const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/LotteryFactory.json');

let accounts;
let factory;

beforeEach( async ()=> {
    accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '2000000' });

    factory.setProvider(provider);
});

describe('LotteryFactory', () => {

	it('Deploys a lottery factory', () => {
        assert.ok(factory.options.address);
    });

	it('Gets lotteries stats without deployed lotteries', async () => {
        const result = await factory.methods.getLotteriesStats().call();
        const stats = {
            totalAmount: result[0],
            totalPlayers: result[1]
        };
        assert.equal(0, stats.totalAmount);
        assert.equal(0, stats.totalPlayers);
    });

	it('Gets lotteries count equals 0', async () => {
        const result = await factory.methods.getLotteriesCount().call();
        assert.equal(0, result);
    });

    it('Gets an empty lottery arraylist', async () => {
        const result = await factory.methods.getLotteries().call();
        assert.equal(0, result.length);
    });

    it('Gets lotteries count equals to 1 after deploying a lottery', async () => {
        await factory.methods.createLottery('1000', '3').send({
            from: accounts[0],
            gas: '1000000'
        });
        
        const result = await factory.methods.getLotteriesCount().call();
        assert.equal(1, result);
    });

	it('Gets lotteries stats after deploying 1 lottery', async () => {
        await factory.methods.createLottery('1000', '3').send({
            from: accounts[0],
            gas: '1000000'
        });

        const result = await factory.methods.getLotteriesStats().call();
        const stats = {
            totalAmount: result[0],
            totalPlayers: result[1]
        };
        
        assert.equal(1000, stats.totalAmount);
        assert.equal(3, stats.totalPlayers);
    });

	it('Gets lotteries stats after deploying 2 lotteries', async () => {
        await factory.methods.createLottery('1000', '3').send({
            from: accounts[0],
            gas: '1000000'
        });
        await factory.methods.createLottery('3500', '5').send({
            from: accounts[0],
            gas: '1000000'
        });

        const result = await factory.methods.getLotteriesStats().call();
        const stats = {
            totalAmount: result[0],
            totalPlayers: result[1]
        };
        
        assert.equal(4500, stats.totalAmount);
        assert.equal(8, stats.totalPlayers);
    });

    it('Deploying a lottery when factory is paused. It should fail.', async () => {
        const methods = factory.methods;
        await methods.pause().call();
        try {
            await methods.createLottery('1000', '3').send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Deploying a lottery with at least 1 player. It should fail.', async () => {
        const methods = factory.methods;
        try {
            await methods.createLottery('1000', '1').send({
            from: accounts[0],
            gas: '1000000'
        });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });
})
