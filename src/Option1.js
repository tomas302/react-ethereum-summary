import React, { Component } from 'react';
import './Option1.css';
import CookieHelper from './CookieHelper'


const zeroAddress = '0x0000000000000000000000000000000000000000';
const cookieHelper = new CookieHelper();

// Input component that calls the callback of Option1 class
class AddressField extends Component {

    render() {
        return (
            <input maxLength='42' onChange={this.props.addressChangedCallback} type='text' placeholder='Ethereum Address' className="addressInput" defaultValue={this.props.address} />
        )
    }

}

// Component that does all the detail printing
class Details extends Component {

    render() {
        let etherscanLink = 'https://kovan.etherscan.io/address/' + this.props.address;

        let detailList = [
            ['Address (redirects to etherscan)', <a target="_blank" href={etherscanLink}>{this.props.address}</a>],
            ['Account type', this.props.isContract ? 'Smart Contract' : 'Normal'],
            ['Balance', this.props.balance + " ETH"],
            ['Transaction count', this.props.transactionCount],
            ['Code', this.props.contractCode],
        ]

        if (this.props.address === undefined || this.props.address.length !== 42) {
             detailList[0][1] = <b className="error">Insert a valid address</b>;
        }

        let detailElement = [];

        for (let i = 0; i < detailList.length; i++) {
            let data;
            if (i === 4) { // If it's the 'Code' section
                // Return if is a normal account
                if (detailList[i][1] === null) break;
                // or print the contract code if not
                data = detailList[i][1];
                detailElement.push(<li key={i} className='detail_item'><div><b>{detailList[i][0]}:</b></div> <textarea value={data} readOnly className="contract_code"></textarea></li>);
            } else {
                data = detailList[i][1] === null ? "WIP" : detailList[i][1];
                detailElement.push(<li key={i} className='detail_item'><div><b>{detailList[i][0]}:</b></div> {data}</li>);
            }
        }

        return (
            <div className='details'>
                <h3>Address Summary of</h3>
                <AddressField
                    address={this.props.address}

                    addressChangedCallback={this.props.addressChangedCallback}
                />
                <ul className='detail_ul'>
                    {detailElement}
                </ul>
            </div>
        );
    }
}

// Main class that has all the data of the state
export default class Option1 extends Component {
    constructor(props) {
        super(props);
        let defaultAddress = cookieHelper.readCookie('lastAddress');
        if (defaultAddress === null) {
            defaultAddress = zeroAddress;
        }
        this.state = {
            currentAddress: defaultAddress,
            balance: 0,
            isContract: false,
            contractCode: null,
            transactionCount: 0,
        };

        this.addressChangedCallback = (changed) => {
            let value = changed.target.value;
            if (value.slice(0, 1).toString() !== '0x') {
                if (value.length >= 2) { 
                    value = '0x' + value.substring(2, value.length).replace(/([^ABCDEFabcdef0123456789])/g, ""); // Using regex to be sure of that is an hex address
                    value = value.slice(0, 42);
                } else if (value.length === 0) { //
                    value = zeroAddress;
                } else {
                    value = '0x' + value.replace(/([^ABCDEFabcdef0123456789])/g, "");
                }
            }
            this.setState({
                currentAddress: value
            })
            changed.target.value = value;
            cookieHelper.createCookie('lastAddress',value, 50*365);
            if (value.length === 42) {
                this.refreshAddressData(value);
            }
        }


        // Function that interacts with the API and updates the state
        this.refreshAddressData = (address) => {
            let api = this.props.api;
            api.eth.getBalance(address)
                .then((newBalance) => {
                    this.setState({
                        balance: api.util.fromWei(newBalance, "ether").toString()
                    });
                });

            api.eth.getCode(address)
                .then((code) => {
                    this.setState({
                        isContract: (code !== '0x' ? true : false),
                        contractCode: (code !== '0x' ? code : null)
                    });
                });

            api.eth.getTransactionCount(address)
                .then((transactions) => {
                    this.setState({
                        transactionCount: transactions.toString()
                    });
                });
        };

        this.refreshAddressData(this.state.currentAddress);
    }
    
    // Just heading and details
    render() {
        return (
            <div className='main'>
                <h2>I'm the first option</h2>
                <Details className='details'
                    address={this.state.currentAddress}
                    balance={this.state.balance}
                    isContract={this.state.isContract}
                    contractCode={this.state.contractCode}
                    transactionCount={this.state.transactionCount}


                    addressChangedCallback={this.addressChangedCallback}
                />
            </div>
        );
    }
}
