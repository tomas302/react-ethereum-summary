import React, { Component } from 'react';
import './App.css';
import Api from '@parity/api';
import Option1 from './Option1';

const provider = new Api.Provider.Http('https://kovan.infura.io/'); // or Api.Provider.Ws('ws://localhost:8546')
const api = new Api(provider);

class App extends Component {
  
  render() {
    return (
      <div>
        <Option1
        api={api}
        />
      </div>
    );
  }
}

export default App;
