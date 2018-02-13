import React, {Component} from 'react';
import {Divider, Header, Popup, List, Container, Button, Label } from 'semantic-ui-react'
import {Link} from '../routes';

class LotteryActions extends Component {
  state = {
    loading: false 
  };

  renderItems(item) {
    const trigger = item.content;
    return (
      item.visible ?
      <List.Item key={item.key} >
        <List.Content>
        {item.content}
        <Popup
          trigger={<List.Icon name="help circle" size='large' color={item.color} verticalAlign='middle' />}
          flowing
          hoverable
        >
        {item.helpText}
        </Popup>
        </List.Content>
      </List.Item>
      : null
    );
  }

  componentWillReceiveProps(newProps) {
    this.setState({loading: newProps.loading});
  }

  render() {
    const {lottery} = this.props;
    const isInProgress = lottery.winnerAddress == '0x0000000000000000000000000000000000000000';
    const items = [
      {
        content:<Link route={`/lottery/list`}>
                  <a><Button color="linkedin">Lotteries list</Button></a>
                </Link>,
        key: 'lotteryList',
        visible: true,
        helpText: 'Shows all the lotteries.',
        color: 'blue'
      },
      {
        content:<Link route={`/lottery/participate/${lottery.address}`}>
                  <a><Button secondary loading={this.state.loading}>Participate</Button></a>
                </Link>,
        key: 'lotteryParticipate',
        visible: isInProgress,
        helpText: 'Allow an user to be part of the current lottery. It means the user has possibilities to win the current lottery.',
        color: 'blue'
      },
      {
        content:<Button secondary onClick={this.props.onPickWinnerSubmit} loading={this.state.loading}>Pickup Winner (Only Manager)</Button>,
        key: 'lotteryPickWinner',
        visible: true,
        helpText: 'Picks up only one winner of the lottery players list randomly. This action can be taken by the manager ONLY.',
        color: 'blue'
      },
      {
        content:<Button secondary onClick={this.props.onPauseSubmit} loading={this.state.loading}>Pause (Only Owner)</Button>,
        key: 'lotteryPause',
        visible: !lottery.paused,
        helpText: 'Pauses the current lottery. It means nobody can participate neither win the current lottery. This action can be taken by the creator ONLY.',
        color: 'blue'
      },
      {
        content:<Button secondary onClick={this.props.onUnpauseSubmit} loading={this.state.loading}>Unpause (Only Owner)</Button>,
        key: 'lotteryUnpause',
        visible: lottery.paused,
        helpText: 'Unpauses the current lottery. It allows to anybody to be part of this lottery',
        color: 'blue'
      }
    ];

    const content = items.map((item, index) => {
      return this.renderItems(item);
    });

    return (
      <Container>
        <Header as='h2'>Actions</Header>
        <List divided size="mini">
          {content}
        </List>
      </Container>
    );
  };

};

export default LotteryActions;