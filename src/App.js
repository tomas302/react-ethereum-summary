import React, { Component } from 'react';
import './App.css';
import Api from '@parity/api';
import Option1 from './Option1';

// We init the parity API and connect to the Infura Koven Testnet node

const provider = new Api.Provider.Http('https://kovan.infura.io/'); // or Api.Provider.Ws('ws://localhost:8546')
const api = new Api(provider);


// The only purpose of this class is to invoke the options.
class App extends Component {
  
  render() {
    return (
      <div>
        <Option1
        api={api} // We pass the Parity API
        />
      </div>
    );
  }
}

export default App;
