import React, {Component} from 'react';

import { Icon, Button, Modal } from 'semantic-ui-react'

class Message extends Component {

  state = { open: false }

  open = () => this.setState({ open: true })
  close = () => {
    this.setState({ open: false });
    if(this.props.onClose != 'undefined') {
      this.props.onClose();
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      open: newProps.open,
      message: newProps.message,
      title: newProps.title
    });
  }

  render() {
      const {open, title, message} = this.state;
      return (
        <Modal size='tiny' open={open} onClose={this.close}>
        <Modal.Header>
        <Icon size="big" name="chevron right" color="red"/> {title}
        </Modal.Header>
        <Modal.Content>
          <p><Icon size="huge" name="warning sign" color="red"/> {message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" icon='checkmark' labelPosition='right' content='Accept' onClick={this.close}/>
        </Modal.Actions>
      </Modal>
      );
  };
}

export default Message;