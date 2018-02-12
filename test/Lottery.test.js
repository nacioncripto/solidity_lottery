const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledLottery = require('../ethereum/build/Lottery.json');

let accounts;
let lottery;

beforeEach( async ()=> {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(compiledLottery.interface))
        .deploy({ 
            arguments:['1000','2', accounts[0]],
            data: compiledLottery.bytecode
        })
        .send({ from: accounts[0], gas: '1000000' });

    lottery.setProvider(provider);
});

describe('Lottery', () => {

    it('Deploys a lottery contract', () => {
        assert.ok(lottery.options.address);
    });

    it('Deploys a lottery contract with 1 player. It should fail', async () => {
        try {
            await new web3.eth.Contract(JSON.parse(compiledLottery.interface))
            .deploy({ 
                arguments:['1000','1', accounts[0]],
                data: compiledLottery.bytecode
            })
            .send({ from: accounts[0], gas: '1000000' });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Enter into a lottery', async () => {
        await lottery.methods.enter()
        .send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });

        const balance = await lottery.methods.getBalance().call();
        assert.equal(1000, balance);

        const players = await lottery.methods.getPlayers().call();
        assert.equal(1, players.length);
    });

    it('Enter into a lottery twice. It is valid.', async () => {
        await lottery.methods.enter()
        .send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });

        await lottery.methods.enter()
        .send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });

        const balance = await lottery.methods.getBalance().call();
        assert.equal(2000, balance);

        const players = await lottery.methods.getPlayers().call();
        assert.equal(2, players.length);
    });

    it('Enter into a lottery without money. It should fail.', async () => {
        try {
            await lottery.methods.enter()
            .send({
                from: accounts[0],
                gas: '1000000',
                value: '0'
            });
            asser(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Enter into a lottery using more money than it needs. It should fail.', async () => {
        try {
            await lottery.methods.enter()
            .send({
                from: accounts[0],
                gas: '1000000',
                value: '4000'
            });
            asser(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Enter into a lottery when it is paused. It should fail.', async () => {
        await lottery.methods.pause().call();
        try {
            await lottery.methods.enter()
            .send({
                from: accounts[0],
                gas: '1000000',
                value: '3000'
            });
            asser(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Picks a winner using a non owner. It should fail.', async () => {
        const methods = lottery.methods;
        await methods.enter().send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });
        await methods.enter().send({
            from: accounts[1],
            gas: '1000000',
            value: '1000'
        });

        try {
            await methods.pickWinner().send({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Picks a winner.', async () => {
        const methods = lottery.methods;
        await methods.enter().send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });
        await methods.enter().send({
            from: accounts[1],
            gas: '1000000',
            value: '1000'
        });

        await methods.pickWinner().send({
            from: accounts[0],
            gas: '1000000'
        });

        const winner = await methods.winner().call();
        const winnerAmount = await methods.winnerAmount().call();

        assert.ok(accounts[0] == winner || accounts[1] == winner);
        assert.equal(2000, winnerAmount);
    });

    it('Picks a winner twice. It should fail.', async () => {
        const methods = lottery.methods;
        await methods.enter().send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });
        await methods.enter().send({
            from: accounts[1],
            gas: '1000000',
            value: '1000'
        });

        await methods.pickWinner().send({
            from: accounts[0],
            gas: '1000000'
        });

        try {
            await methods.pickWinner().send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Picks a winner when it is paused. It should fail.', async () => {
        const methods = lottery.methods;
        await methods.enter().send({
            from: accounts[0],
            gas: '1000000',
            value: '1000'
        });
        await methods.enter().send({
            from: accounts[1],
            gas: '1000000',
            value: '1000'
        });

        await methods.pause().call();

        try {
            await methods.pickWinner().send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Pauses using a non owner account. It should fail.', async () => {
        const methods = lottery.methods;

        try {
            await methods.pause().call({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }        
    });

})
