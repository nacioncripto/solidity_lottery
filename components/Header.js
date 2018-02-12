import React, {Component} from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {Link} from '../routes';
import web3 from '../ethereum/web3';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

class Header extends Component {
    
    static async getInitialProps() {
        return {};
    }

    render() {
        return (
            <Menu style={{marginTop: '10px'}}>
                <Menu.Item>
                    
                </Menu.Item>
                <Link route="/">
                    <a className="item">LotteryGame</a>
                </Link>
                <Menu.Item>
                    A lottery game based on a Smart Contract on Ethereum.
                    <Label color="green">Rinkeby Network</Label>
                </Menu.Item>
                <Menu.Menu position="right">
                    <a  className="item"
                        href="https://github.com/nacioncripto/solidity_lottery/blob/master/README.md"
                        target="_blank">Help
                    </a>
                    <Link route="/lottery/list">
                        <a className="item">Lotteries</a>
                    </Link>
                    <Link route="/lottery/new">
                    <a className="item">+</a>
                </Link>
                </Menu.Menu>
            </Menu>
        );
    };
}

export default Header;