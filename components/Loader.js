import React, {Component} from 'react';

import { Icon, Button, Modal} from 'semantic-ui-react'

class Loader extends Component {

  state = { open: false }

  open = () => this.setState({ open: true })

  componentWillReceiveProps(newProps) {
    this.setState({open: newProps.open});
  }

  render() {
      return (
      <Modal size='tiny' open={this.state.open} basic>
        <Modal.Content style={{textAlign: 'center'}}>
            <Icon loading size="huge" name="clock"/>
            <p>Processing...</p>
        </Modal.Content>
      </Modal>
      );
  };
}

export default Loader;