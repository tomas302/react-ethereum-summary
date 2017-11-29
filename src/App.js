import React, { Component } from 'react';
import './App.css';
import Api from '@parity/api';

const provider = new Api.Provider.Http('https://kovan.infura.io/'); // or Api.Provider.Ws('ws://localhost:8546')
const api = new Api(provider);

function Details(props) {
  let detailList = [
    'Address',
    'Account type',
    'Balance',
    'Transaction count',
    '<h3>TODO add more</h3>',
  ];

  let etherscanLink = 'https://kovan.etherscan.io/address/' + props.address;

  let detailListData = [
    <a target="_blank" href={etherscanLink}>{props.address}</a>,
    props.isContract ? 'Smart Contract' : 'Normal',
    props.balance,
    null,
    null,
  ];
  
  let detailElement = [];

  for (let i = 0; i < detailList.length; i++) {
    let data = detailListData[i] === null ? "WIP" : detailListData[i];
    detailElement.push(<li key={i} className='detail_item'><div><b>{detailList[i]}:</b></div> {data}</li>);
  }
  
  return (
    <div className='details'>
      <h3>Address Summary</h3>
        <ul className='detail_ul'>
          {detailElement}
        </ul>
    </div>
  );
}

class Option1 extends Component {
  render() {
    return (
      <div>
        <h2>I'm the first option</h2>
        <Details className='details'
          address={this.props.address}
          balance={this.props.balance}
          isContract={this.props.isContract}
          />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAddress: '0x0000000000000000000000000000000000000000',
      balance: 0,
      isContract: false,
    };

    api.eth.getBalance(this.state.currentAddress)
      .then((newBalance) => {
        this.setState({
          balance: api.util.fromWei(newBalance, "ether").toString()
        });
    });

    api.eth.getCode(this.state.currentAddress)
    .then((code) => {
      this.setState({
        isContract: (code !== '0x' ? true : false),
      });
  });
  }


  render() {
    return (
      <div>
        <Option1
          address={this.state.currentAddress}
          balance={this.state.balance}
          isContract={this.state.isContract}
          />
      </div>
    );
  }
}

export default App;
