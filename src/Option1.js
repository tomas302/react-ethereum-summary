import React, { Component } from 'react';
import './Option1.css';

class AddressField extends Component {

    render() {
        return (
            <input maxLength='42' onChange={this.props.addressChangedCallback} type='text' placeholder='Ethereum Address' className="addressInput" defaultValue={this.props.address} />
        )
    }

}

class Details extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        let etherscanLink = 'https://kovan.etherscan.io/address/' + this.props.address;

        let detailList = [
            ['Address (redirects to etherscan)', <a target="_blank" href={etherscanLink}>{this.props.address}</a>],
            ['Account type', this.props.isContract ? 'Smart Contract' : 'Normal'],
            ['Balance', this.props.balance],
            ['Transaction count', null],
            ['<h3>TODO add more</h3>', null],
        ]

        if (this.props.address === undefined || this.props.address.length !== 42) {
             detailList[0][1] = <b className="error">Insert a valid address</b>;
        }

        let detailElement = [];

        for (let i = 0; i < detailList.length; i++) {
            let data = detailList[i][1] === null ? "WIP" : detailList[i][1];
            detailElement.push(<li key={i} className='detail_item'><div><b>{detailList[i][0]}:</b></div> {data}</li>);
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

export default class Option1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAddress: '0x0000000000000000000000000000000000000000',
            balance: 0,
            isContract: false,
        };

        this.addressChangedCallback = (changed) => {
            let value = changed.target.value;
            if (value.slice(0, 1).toString() !== '0x') {
                if (value.length >= 2) {
                    value = '0x' + value.substring(2, value.length).replace(/([^ABCDEFabcdef0123456789])/g, "");
                } else if (value.length === 0) {
                    value = '0x0000000000000000000000000000000000000000';
                } else {
                    value = '0x' + value.replace(/([^ABCDEFabcdef0123456789])/g, "");
                }
            }
            this.setState({
                currentAddress: value
            })
            changed.target.value = value;
            if (value.length === 42) {
                this.refreshAddressData(value);
            }
        }

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
                    });
                });
        };
    }

    render() {
        return (
            <div className='main'>
                <h2>I'm the first option</h2>
                <Details className='details'
                    address={this.state.currentAddress}
                    balance={this.state.balance}
                    isContract={this.state.isContract}

                    addressChangedCallback={this.addressChangedCallback}
                />
            </div>
        );
    }
}
