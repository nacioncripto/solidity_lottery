import React, {Component} from 'react';
import {Container} from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import NewsList from './NewsList';

class Layout extends Component {

    state = {
        news: []
    }

    componentWillReceiveProps(newProps) {
        this.setState({news: newProps.news});
    }

    render() {
        return (
            <Container>
                <Head>
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
                    <title>{this.props.title} | Solidity Ethereum App | NacionCripto.com</title>
                </Head>
                <Header />
                {this.props.children}
                <Footer/>
                <NewsList news={this.state.news}/>
            </Container>
        );
    };
}

export default Layout;