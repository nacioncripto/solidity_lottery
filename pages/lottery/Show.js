import React, {Component} from 'react';
import {Container, List, Image, Header, Grid, Divider, Button, Icon, Item} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Lottery from '../../ethereum/lottery';
import web3 from '../../ethereum/web3';
import KEYS from '../../conf/keys';

const DEFAULT_EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

class LotteryDetail extends Component {
  
  state = {
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const address = props.query.address;
    const lotteryContract = Lottery(address);
    const summary = await lotteryContract.methods.getSummary().call();        
    const lottery = {
      address: address,
      amountPerPlayer: summary[0],
      minimumPlayers: summary[1],
      winnerAmount: summary[2],
      winnerAddress: summary[3],
      managerAddress: summary[4],
      ownerAddress: summary[5],
      players: summary[6]
     };

     return {lottery};
  }

  renderItem(iconName, title, value, description) {
    return (<Item>
      <Item.Image style={{width: '10%'}}>
        <Icon name={iconName} size="huge"></Icon>
      </Item.Image>

      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Meta>
          <span className='price'>{value}</span>
        </Item.Meta>
        <Item.Description>{description}</Item.Description>
      </Item.Content>
    </Item>
    );
  }

  renderLotteryDetails() {
    const {lottery} = this.props;
    return (
      <Item.Group>
          {
            this.renderItem('address book', 'Manager Address', lottery.managerAddress, 'The address which manages the current lottery.')
          }
          {
            this.renderItem('btc', 'Amount per Player', lottery.amountPerPlayer + ' wei', 'The amount in WEI which a player needs to be part of this lottery.')
          }
          {
            this.renderItem('users', 'Minimum Players', lottery.minimumPlayers + ' players', 'The count of players needed to can pick up a winner.')
          }
          {
            this.renderItem('address card', 'Owner Address', lottery.ownerAddress, '')
          }
          {
            this.renderItem('address card outline', 'Winner Address', lottery.winnerAddress, 'The address which won the current lottery.')
          }
          {
            this.renderItem('btc', 'Winner Amount', (lottery.players.length * lottery.amountPerPlayer) + ' wei', 'The amount in wei for the winner of the current lottery.')
          }
        </Item.Group>
    );
  }

  renderPlayerAddress() {
    const {lottery} = this.props;
    return lottery.players.map((player, index) => {
        return <List.Item key={player}>
              <a href={KEYS.explorerUrl + player} target="_blank">
              {index + 1}- {player}
              </a>
        </List.Item>
    });
  }

  onPickWinnerSubmit = async (event) => {
    event.preventDefault();
    const {lottery} = this.props;
    
    const lotteryContract = Lottery(lottery.address);
    
    this.setState({loading: true, errorMessage: ''});
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        if(account != lottery.managerAddress) {
          this.setState({
            errorMessage: 'Current address is not the manager.',
            loading: false
          });
          return;
        }
        if(lottery.minimumPlayers != lottery.players.length) {
          this.setState({
            errorMessage: 'Lottery needs more players in order to pick up a winner.',
            loading: false
          });
          return;
        }

        await lotteryContract.methods.pickWinner()
            .send({
                from: account
            });
        Router.pushRoute(`/lottery/details/${lottery.address}`);
    } catch (err) {
        this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };

  onCloseMessage = () => this.setState({errorMessage: ''});

  renderActions(lottery, isInProgress) {
    return (
      <Container>
        <Link route={`/lottery/list`}>
          <a><Button color="linkedin">Lotteries list</Button></a>
        </Link>
        {isInProgress ? 
          <div>
            <Link route={`/lottery/participate/${lottery.address}`}>
              <a><Button secondary loading={this.state.loading}>Participate</Button></a>
            </Link>
            <Link route={`/lottery/details/${lottery.address}`}>
              <a><Button secondary onClick={this.onPickWinnerSubmit} loading={this.state.loading}>Pickup Winner (Only Manager)</Button></a>
            </Link>
          </div>
          :
        null}   
      </Container>);
  };

  render() {
    const {lottery} = this.props;
    const finished = (<Header as="p"><Icon name="close" color='red' size="huge"/>Finished</Header>);
    const inProgress = (<Header as="p"><Icon name='eye' color="green" size="huge"/>In Progress</Header>);
    const isInProgress = lottery.winnerAddress == '0x0000000000000000000000000000000000000000';
    return (
      <Layout title="Lottery Details" >
        <Header as='h3'>Lottery Details
        </Header>
        <Divider/>
        <Grid columns='2' divided>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderLotteryDetails()}
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as='h2'>Status</Header>
              {isInProgress ? inProgress : finished}
              <Divider />
              <Header as='h2'>Actions</Header>
                {this.renderActions(lottery, isInProgress)}
              <Divider />
              <Header as='h2'>Players ({lottery.players.length} players) </Header>
              
              <List items={this.renderPlayerAddress()}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Message open={this.state.errorMessage != ''} message={this.state.errorMessage} title="Error Message" onClose={this.onCloseMessage}/>
        <Loader open={this.state.loading}/>
      </Layout>
    );
  }
};

export default LotteryDetail;