import React, {Component} from 'react';
import {Label, Header, Divider, Button, Icon, Form, Input} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import web3 from '../../ethereum/web3';
import Lottery from '../../ethereum/lottery';
import KEYS from '../../conf/keys';

const DEFAULT_EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

class LotteryParticipate extends Component {
  
  state = {
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const address = props.query.address;
    let lotteryData = {};
    try {
        const lotteryContract = Lottery(address);
        const summary = await lotteryContract.methods.getSummary().call();        
        lotteryData = {
        address: address,
        amountPerPlayer: summary[0],
        minimumPlayers: summary[1],
        winnerAmount: summary[2],
        winnerAddress: summary[3],
        managerAddress: summary[4],
        ownerAddress: summary[5],
        players: summary[6]
        };
        return {lotteryData};
    } catch (err) {
        return {lotteryData};
    }
  }

  onParticipateSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    try {
        const {lotteryData} = this.props;
        const lottery = Lottery(lotteryData.address);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        await lottery.methods.enter()
            .send({
                from: account,
                value: lotteryData.amountPerPlayer
            });
        Router.pushRoute(`/lottery/details/${lotteryData.address}`);
    } catch (err) {
        console.log(err);
        this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };

  onCloseMessage = () => this.setState({errorMessage: ''});

  renderForm(lotteryData) {
    const lotteryFinished = lotteryData.winnerAddress != DEFAULT_EMPTY_ADDRESS;
    return (
        <Form onSubmit={this.onParticipateSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
                <label>Amount per Player (wei)</label>
                <Input
                    type="number"
                    icon={<Icon name='btc' inverted circular link />}
                    value={lotteryData.amountPerPlayer}
                    disabled
                />
            </Form.Field>
            <Button primary loading={this.state.loading} disabled={lotteryFinished}>
            {lotteryFinished ? 'Lottery is Finished': 'Participate'}
            </Button>
        </Form>
    );
  }

  renderInvalidAddress() {
      return (
          <div>
              <p>The address {this.props.address} is not valid.</p>
              <Link
                route={`/lottery/list`}>
                <a>
                    <Button primary style={{marginBottom: 10}}>Lottery List</Button>
                </a>
            </Link>
          </div>
      );
  }

  render() {
    const {lotteryData} = this.props;
    let content = this.renderInvalidAddress();
    if(typeof lotteryData.address !== 'undefined' && lotteryData.address) {
        content = this.renderForm(lotteryData);
    }
    return (
      <Layout title="Lottery Participation" >
        <Header as='h3'>Participate in Lottery</Header>
        <Divider/>
        {content}
        <Message open={this.state.errorMessage != ''} message={this.state.errorMessage} title="Error Message" onClose={this.onCloseMessage}/>
        <Loader open={this.state.loading}/>
      </Layout>
    );
  }
};

export default LotteryParticipate;