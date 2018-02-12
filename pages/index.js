import React, { Component} from 'react';
import { Button, Container, Divider, Icon, Statistic, Image } from 'semantic-ui-react';
import Layout from '../components/Layout';
import LotteryStats from '../components/LotteryStats';
import HomeInfo from '../components/HomeInfo';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';

class AppIndex extends Component {

    static async getInitialProps() {
        const lotteries = await factory.methods.getLotteries().call();        
        const stats = await factory.methods.getLotteriesStats().call();        
        return {
            totalLotteries: lotteries.length,
            totalAmount: stats[0],
            totalPlayers: stats[1],
            total: stats[0] * stats[1]
        };
    }

    render() {
        const factoryStats = {
            totalLotteries: this.props.totalLotteries,
            totalAmount: this.props.totalAmount,
            totalPlayers: this.props.totalPlayers,
            total: this.props.total
        };

        return (
            <Layout title="Home Lottery">
                <HomeInfo/>
                <Divider />
                <LotteryStats factoryStats={factoryStats}/>
            </Layout>
        );
    }
}

export default AppIndex;