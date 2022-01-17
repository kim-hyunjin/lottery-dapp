import React from "react";
import "./App.css";
import Web3 from "web3";

declare global {
    interface Window {
        web3: any;
        ethereum: any;
    }
}

class App extends React.Component {
    web3!: Web3;

    async componentDidMount() {
        await this.initWeb3();
    }

    async initWeb3() {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            console.log(this.web3);
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
        }
    }

    render(): React.ReactNode {
        return (
            <div>
                <h1>HELLO!</h1>
            </div>
        );
    }
}

export default App;
