import React, { Component} from 'react';
import {Container, Divider } from 'semantic-ui-react';
import Layout from '../components/Layout';
import LotteryStats from '../components/LotteryStats';
import HomeInfo from '../components/HomeInfo';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import factoryws from '../ethereum/factoryws';
import Lotteryws from '../ethereum/lotteryws';

class AppIndex extends Component {

    state = {
        news: [],
        factoryStats: {
            totalAmount: 0,
            totalPlayers: 0,
            lotteries: []
        }
    };

    static async getInitialProps() {
        const stats = await factory.methods.getLotteriesStats().call();
        return {
            totalAmount: parseInt(stats[0]),
            totalPlayers: parseInt(stats[1]),
            lotteries: stats[2]
        };
    }

    componentDidMount() {
        this.updateStats(
            this.props.lotteries,
            this.props.totalAmount,
            this.props.totalPlayers
        );
    }

    updateStats(lotteries, totalAmount, totalPlayers) {
        const factoryStats = {
            lotteries: lotteries,
            totalAmount: this.state.factoryStats.totalAmount + totalAmount,
            totalPlayers: this.state.factoryStats.totalPlayers + totalPlayers
        };
        this.setState({
            factoryStats: factoryStats 
        });
    }

    componentWillReceiveProps(newProps) {
        this.updateStats(
            newProps.lotteries,
            newProps.totalAmount,
            newProps.totalPlayers
        );
    }
    
    addCreateLotteryEvent() {
        const createLotteryEvent = factoryws.events.CreateLottery({},function(error, event){})
        .on('data', (event) => {
            const items = [
                {
                    type: event.event,
                    name: 'Lottery',
                    blockNumber: event.blockNumber,
                    transactionHash: event.transactionHash,
                    blockHash: event.blockHash,
                    returnValues: {
                        amountPerPlayer: event.returnValues.amountPerPlayer,
                        minimumPlayers: event.returnValues.minimumPlayers,
                        creator: event.returnValues.creator
                    },
                    address: event.address,
                    signature: event.signature
                }
            ];
            const factoryStats = {
                lotteries: this.state.factoryStats.lotteries.concat(event.address),
                totalAmount: this.state.factoryStats.totalAmount + parseInt(event.returnValues.amountPerPlayer),
                totalPlayers: this.state.factoryStats.totalPlayers + parseInt(event.returnValues.minimumPlayers)
            };
            this.setState({
                news: items,
                factoryStats: factoryStats
            });
        });
    }

    addEnterLotteryEvent(item) {
        const lottery = Lotteryws(item);
        const enterLotteryEvent = lottery.events.Enter({},function(error, event){})
        .on('data', (event) => {
            const items = [
                {
                    type: event.event,
                    name: 'New Player',
                    blockNumber: event.blockNumber,
                    transactionHash: event.transactionHash,
                    blockHash: event.blockHash,
                    returnValues: {
                        amount: event.returnValues.amount,
                        player: event.returnValues.player
                    },
                    address: event.address,
                    signature: event.signature
                }
            ];
            this.setState({
                news: items
            });
        }); 
    }

    addPickupWinnerEvent(item) {
        const lottery = Lotteryws(item);
        const enterLotteryEvent = lottery.events.PickWinner({},function(error, event){})
        .on('data', (event) => {
            const items = [
                {
                    type: event.event,
                    name: 'Lottery Winner',
                    blockNumber: event.blockNumber,
                    transactionHash: event.transactionHash,
                    blockHash: event.blockHash,
                    returnValues: {
                        winnerAmount: event.returnValues.winnerAmount,
                        winner: event.returnValues.winner
                    },
                    address: event.address,
                    signature: event.signature
                }
            ];
            this.setState({
                news: items
            });
        });
    }

    componentWillMount() {
        this.addCreateLotteryEvent();
        const {lotteries} = this.props;

        lotteries.map((item) => {
            this.addEnterLotteryEvent(item);
            this.addPickupWinnerEvent(item);
        });
    }

    render() {
        return (
            <Layout title="Home Lottery" news={this.state.news}>
                <HomeInfo/>
                <Divider />
                <LotteryStats factoryStats={this.state.factoryStats}/>
            </Layout>
        );
    }
}

export default AppIndex;