import React from 'react';
import { Button, Container, Header } from 'semantic-ui-react';
import {Link} from '../routes';

export default (props) => {
    return (
        <Container textAlign="center" style={{fontSize: '15px'}}>
            <Header as='h2'>Welcome to the LotteryGame!</Header>
            <p>
            LotteryGame is an educational game based on the Ethereum network.
This game is running over the Rinkeby Test Network in order you can play with it without needing pay real money.
            </p>
            <p>
            The LotteryGame's rules are very simple:
            </p>
            <ul>
                <li>A player defines an amount per player, and a count of minimum players, and creates a lottery.</li>
                <li>The rest of players can participate in any lottery they want paying the amount per player defined in it.</li>
                <li>Once the lottery reaches out the minimum players, the manager (or creator) will be able to pick up a winner randomly.</li>
            </ul>
            
            <p>
            That's all! Let started to play! Click on the button to view all the lotteries:
            </p>
            <p>
            <Link
                route={`/lottery/list`}>
                <a>
                    <Button primary style={{marginBottom: 10}}>View all</Button>
                </a>
            </Link>
            </p>
            <p>
                <i>
                <strong>Important Note:</strong>                
                The process to pick up a winner randomly in the lottery is only for educational purposes. We do NOT advice to implement it in a production environment. It could be easily hacked by a malicious player.
                </i>
            </p>
            <p>
                <i>
                It requires adding an extension to your browser to interact with the blockchain. You can add it in this <a href="https://metamask.io/" target="_blank">URL
                </a>.
                </i>
            </p>
        </Container>
    );
};