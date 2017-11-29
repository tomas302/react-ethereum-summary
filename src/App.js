import React, { Component } from 'react';
import './App.css';
import Api from '@parity/api';

const provider = new Api.Provider.Http('https://kovan.infura.io/'); // or Api.Provider.Ws('ws://localhost:8546')
const api = new Api(provider);

function Details(props) {
  return (
    <div>
      <h3>Address Summary</h3>
        <ul>
          <li>Address: {props.address}</li>
          <li>Account type: </li>
          <li>Balance: </li>
          <li>Transaction count: </li>
          <li><h3>TODO add more</h3></li>
        </ul>
    </div>
  );
}

class Option1 extends Component {
  render() {
    return (
      <div>
        <h2>I'm the first option</h2>
        <Details address={this.props.address}/>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAddress: '0x0000000000000000000000000000000000000000',
    };
  }

  render() {
    return (
      <div>
        <Option1 address={this.state.currentAddress}/>
      </div>
    );
  }
}

export default App;
