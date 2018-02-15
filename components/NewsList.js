import React, {Component} from 'react';
import {Icon, Label, Transition, List, Divider, Message, Container } from 'semantic-ui-react'
import {Link} from '../routes';
import KEYS from '../conf/keys';

class NewsList extends Component {
  state = {
    news: [] 
  };

  componentWillReceiveProps(newProps) {
    if(newProps.news.length > 0) {
      this.setState({news: this.state.news.concat(newProps.news[0])});
    }
  }

  renderLotteryInfo(item) {
    return (
      <div>
        <Label>Amount Per Player: {item.returnValues.amountPerPlayer} wei</Label>
        <Label>Minimum Players: {item.returnValues.minimumPlayers}</Label>
        <Label>Creator Address: {item.returnValues.creator}</Label>
      </div>
    );
  }

  renderEnterInfo(item) {
    return (
      <div>
        <Label>Amount: {item.returnValues.amount} wei</Label>
        <Label>Player: {item.returnValues.player}</Label>
      </div>
    );
  }

  renderWinnerInfo(item) {
    return (
      <div>
        <Label>Amount: {item.returnValues.winnerAmount} wei</Label>
        <Label>Winner: {item.returnValues.winner}</Label>
      </div>
    );
  }

  render() {
    const news = this.state.news;
    if(news.length == 0) {
      return null;
    }

    console.log('NewsList Render: ');
    console.log(news);

    const newsContent = news.map((item) => {
        console.log('Item ');
        console.log(item);
        return (
          <Transition.Group
            as={Message}
            duration={1000}
            size='tiny'
            key={item.transactionHash}
          >
            <Message.Header>
            {item.name} found!
            </Message.Header>
            <Message.Content>
              <Label>Address: {item.address}
              </Label>
              <a href={KEYS.explorerUrl+item.address} target="_blank">
                <Icon name="external" color="black"></Icon>
              </a>
              <Label>Block Number: {item.blockNumber}</Label>
              <a href={KEYS.blockExplorer+item.blockNumber} target="_blank">
                <Icon name="external" color="black"></Icon>
              </a>
              <Label>Transaction Hash: {item.transactionHash}</Label>
              <a href={KEYS.txExplorer+item.transactionHash} target="_blank">
                <Icon name="external" color="black"></Icon>
              </a>
              <Label>Block Hash: {item.blockHash}</Label>
              <Label>Signature: {item.signature}</Label>
              <br/>
              {item.name == 'Lottery' ? this.renderLotteryInfo(item): null }
              {item.name == 'New Player' ? this.renderEnterInfo(item): null }
              {item.name == 'Lottery Winner' ? this.renderWinnerInfo(item): null }
            </Message.Content>
          </Transition.Group>
          );
    });

    setTimeout(() => {
      this.setState({
        news: news.slice(1,-1)
      });
    }, 25000);

    return (
      <Container style={{position:'absolute', bottom:'0', right:'0'}}>
          {newsContent}
      </Container>
    );
  };

};

export default NewsList;