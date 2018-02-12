import React from 'react';

import {Button, Label, Image as ImageComponent, Item, Icon } from 'semantic-ui-react'
import {Link} from '../routes';

export default (props) => {
    const {lottery} = props;

    return (
    <Item style={{padding: '5px', margin: '5px'}}>
      <Item.Content style={{padding: '5px'}}>
        <Item.Header>
          Address: {lottery.address}
        </Item.Header>
        <Item.Extra>
          <Link route={`/lottery/participate/${lottery.address}`}>
              <a>
              <Button primary floated='right'>
                Participate
              </Button>
              </a>
          </Link>
          <Link route={`/lottery/details/${lottery.address}`}>
              <a>
              <Button secondary floated='right'>
                View details
              </Button>
              </a>
          </Link>
        </Item.Extra>
      </Item.Content>
    </Item>
    );
};