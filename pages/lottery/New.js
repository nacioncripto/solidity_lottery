import React, {Component} from 'react';
import {Header, Divider, Button, Icon, Form, Input} from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory';
import KEYS from '../../conf/keys';

class LotteryNew extends Component {
  
  state = {
    loading: false,
    errorMessage: '',
    amountPerPlayer: 1000,
    minimumPlayers: 2
  };

  onCreateSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const {amountPerPlayer, minimumPlayers} = this.state;

        await factory.methods.createLottery(amountPerPlayer, minimumPlayers)
            .send({
                from: account
            });
        Router.pushRoute('/lottery/list');
    } catch (err) {
        this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };

  onCloseMessage = () => this.setState({errorMessage: ''});

  render() {
    return (
      <Layout title="Lottery Form" >
        <Header as='h3'>Lottery Form</Header>
        <Divider/>
        <Form onSubmit={this.onCreateSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
                <label>Amount per Player (wei)</label>
                <Input
                    type="number"
                    icon={<Icon name='btc' inverted circular link />}
                    value={this.state.amountPerPlayer}
                    onChange={event => this.setState({amountPerPlayer: event.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <label>Minimum Players</label>
                <Input
                    type="number"
                    icon={<Icon name='users' inverted circular link />}
                    value={this.state.minimumPlayers}
                    onChange={event => this.setState({minimumPlayers: event.target.value})}
                />
            </Form.Field>
            <Button primary loading={this.state.loading}>Create</Button>
        </Form>        
        <Message open={this.state.errorMessage != ''} message={this.state.errorMessage} title="Error Message" onClose={this.onCloseMessage}/>
        <Loader open={this.state.loading}/>
      </Layout>
    );
  }
};

export default LotteryNew;