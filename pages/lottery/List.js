import React, {Component} from 'react';
import {Divider, Item, Header, Container, List} from 'semantic-ui-react';
import LotteryItem from '../../components/LotteryItem';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';

class LotteryItemsList extends Component {

  static async getInitialProps(props) {
    const lotteries = await factory.methods.getLotteries().call();        
    
    return { lotteries };
  }

  renderLotteries() {
    return this.props.lotteries.map((lotteryItem, index) => {
        const lottery = {
          id: index + 1,
          address: lotteryItem
        };

        return <LotteryItem
            key={index}
            lottery={lottery}
        />
    });
  }

  render() {
    const lotteries = this.renderLotteries();

    return (
      <Layout title="Lotteries List">
        <Header as='h2'>Lotteries List</Header>
        <Divider/>
        <Item.Group>
        {lotteries}
        </Item.Group>
        <Divider/>
        <p style={{textAlign: 'center'}}>{this.props.lotteries.length} Item(s) found.</p>
      </Layout>
    );
  }
};

export default LotteryItemsList;