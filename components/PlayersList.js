import React, {Component} from 'react';
import {Divider, Header, Popup, List, Container, Button, Label } from 'semantic-ui-react'
import {Link} from '../routes';
import KEYS from '../conf/keys';

class PlayersList extends Component {
  state = {
    loading: false 
  };

  render() {
    const {lottery} = this.props;
    const players = lottery.players.map((player, index) => {
        return <List.Item key={index + ' ' + player}>
              <a href={KEYS.explorerUrl + player} target="_blank">
              {index + 1}- {player}
              </a>
        </List.Item>
    });
    return (
      <Container>
        <Header as='h2'>Players ({lottery.players.length} players) </Header>
        <List divided size="small">
          {players}
        </List>
      </Container>
    );
  };

};

export default PlayersList;