import React, {Component} from 'react';
import {Container, List, Image, Header, Grid, Divider, Button, Icon, Item} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Lottery from '../../ethereum/lottery';
import web3 from '../../ethereum/web3';
import KEYS from '../../conf/keys';
import LotteryDetails from '../../components/LotteryDetail';
import LotteryActions from '../../components/LotteryActions';
import PlayersList from '../../components/PlayersList';

const DEFAULT_EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

class Show extends Component {
  
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
      players: summary[6],
      paused: summary[7]
     };

     return {lottery};
  }

  onPauseSubmit = async (event) => {
    event.preventDefault();
    const {lottery} = this.props;
    
    const lotteryContract = Lottery(lottery.address);
    
    this.setState({loading: true, errorMessage: ''});
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        if(account != lottery.ownerAddress) {
          this.setState({
            errorMessage: 'Current address is not the owner.',
            loading: false
          });
          return;
        }
        await lotteryContract.methods.pause()
            .send({
                from: account
            });
        Router.pushRoute(`/lottery/details/${lottery.address}`);
    } catch (err) {
        this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };

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

  render() {
    const {lottery} = this.props;
    const finished = (<Header as="p"><Icon name="close" color='red' size="huge"/>Finished</Header>);
    const inProgress = (<Header as="p"><Icon name='eye' color="green" size="huge"/>In Progress</Header>);
    const isInProgress = lottery.winnerAddress == '0x0000000000000000000000000000000000000000';
    return (
      <Layout title="Lottery Details" >
        <Header as='h3'>Lottery Details</Header>
        <Divider/>
        <Grid columns='2' divided>
          <Grid.Row>
            <Grid.Column width={10}>
              <LotteryDetails lottery={lottery}/>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as='h2'>Status</Header>
              {isInProgress ? inProgress : finished}
              <Divider />
              <LotteryActions
                lottery={lottery}
                onPickWinnerSubmit={this.onPickWinnerSubmit}
                onUnpauseSubmit={this.onUnpauseSubmit}
                onPauseSubmit={this.onPauseSubmit}
              />
              <Divider />
              <PlayersList lottery={lottery}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Message open={this.state.errorMessage != ''} message={this.state.errorMessage} title="Error Message" onClose={this.onCloseMessage}/>
        <Loader open={this.state.loading}/>
      </Layout>
    );
  }
};

export default Show;