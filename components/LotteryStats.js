import React from 'react';
import { Button, Icon, Container, Statistic, Header} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import KEYS from '../conf/keys';
import {Link} from '../routes';

const MAX_AMOUNT = 9999999;

export default (props) => {
    const { totalLotteries, totalAmount, totalPlayers, total } = props.factoryStats;

    let totalAmountValue = parseInt( totalAmount);
    let totalAmountDef = 'wei';
    if(totalAmount > MAX_AMOUNT) {
      totalAmountValue = web3.utils.fromWei(totalAmount, 'ether');
      totalAmountDef = 'ether';
    }

    let totalValue = parseInt(total);
    let totalDef = 'wei';
    if(total > MAX_AMOUNT) {
      totalValue = web3.utils.fromWei( total.toString(), 'ether');
      totalDef = 'ether';
    }
    return (
    <Container textAlign="center">
        <Header as="h3">Lottery Game Stats</Header>
        <Statistic.Group>
        <Statistic>
          <Statistic.Value>
            <Icon name='play' />
            {totalLotteries}
          </Statistic.Value>
          <Statistic.Label>Total Games</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='btc' />
            {totalAmountValue}
          </Statistic.Value>
          <Statistic.Label>Total Minimum Amount ({totalAmountDef})</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='users' />
            {totalPlayers}
          </Statistic.Value>
          <Statistic.Label>Total Players</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='btc' />
            {totalValue}
          </Statistic.Value>
          <Statistic.Label>Total Amount ({totalDef})</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='eye'></Icon>
          </Statistic.Value>
          <Statistic.Label>
            <a href={KEYS.contractExplorerUrl} target="_blank">
            View Contract
            </a>
          </Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='code'></Icon>
          </Statistic.Value>
          <Statistic.Label>
            <a href="https://github.com/nacioncripto/solidity_lottery" target="_blank">
            View Source Code
            </a>
          </Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </Container>
    );
};