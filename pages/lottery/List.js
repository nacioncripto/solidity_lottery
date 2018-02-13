import React, {Component} from 'react';
import {Grid, Divider, Item, Button, Header, Container, List} from 'semantic-ui-react';
import LotteryItem from '../../components/LotteryItem';
import {Link} from '../../routes';
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
        <Grid columns='2' divided>
          <Grid.Row>
            <Grid.Column width={13}>
              <Item.Group>
              {lotteries}
              </Item.Group>
            </Grid.Column>
            <Grid.Column width={3}>
              <Link route={`/lottery/new`}>
                  <a>
                  <Button primary>
                    Create Lottery
                  </Button>
                  </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        <p style={{textAlign: 'center'}}>{this.props.lotteries.length} Item(s) found.</p>
      </Layout>
    );
  }
};

export default LotteryItemsList;