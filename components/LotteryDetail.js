import React, {Component} from 'react';
import {Button, Label, Item, Icon } from 'semantic-ui-react'
import {Link} from '../routes';

class LotteryDetail extends Component {

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

  render() {
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
  };

};

export default LotteryDetail;