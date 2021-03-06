import React, { RefObject } from "react";
import "./App.css";
import Web3 from "web3";
import { lotteryAbi } from "./abi/Lottery";
import { Contract } from "web3-eth-contract";
import EventTable from "./components/EventTable";

declare global {
    interface Window {
        web3: any;
        ethereum: any;
    }
}

type AppState = {
    pot: string;
    challenges: [string, string];
};

const lotteryAddress = "0xffD4c5BfB668874534d12f9D9bE0A98CdA59FdcD";

class App extends React.Component<any, AppState> {
    web3!: Web3;
    account!: string;
    lotteryContract!: Contract;
    firstWordInput: RefObject<HTMLInputElement>;
    secondWordInput: RefObject<HTMLInputElement>;
    interval?: NodeJS.Timer;

    constructor(props: any) {
        super(props);

        this.state = {
            pot: "0",
            challenges: ["", ""],
        };
        this.firstWordInput = React.createRef<HTMLInputElement>();
        this.secondWordInput = React.createRef<HTMLInputElement>();
    }

    async componentDidMount() {
        await this.initWeb3();

        this.getPot();
        setInterval(this.getPot, 3000);
        this.firstWordInput.current?.focus();
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    initWeb3 = async () => {
        this.web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        this.account = accounts[0];
        this.lotteryContract = new this.web3.eth.Contract(lotteryAbi, lotteryAddress);
    };

    bet = () => {
        // const nonce = await this.web3.eth.getTransactionCount(this.account); // λΆνμ..
        const challenges =
            "0x" + this.state.challenges[0].toLowerCase() + this.state.challenges[1].toLowerCase();

        this.lotteryContract.methods
            .betAndDistribute(challenges)
            .send({
                from: this.account,
                value: 5 * 10 ** 15,
                gas: 300000,
                // nonce, // ignored by MetaMask
            })
            .on("transactionHash", (hash: any) => {
                alert(`λ² ν μ±κ³΅!\nλ² ν κΈμ: '${challenges}'\ntransaction hash: ${hash}`);
            });

        this.clearInput("first");
        this.clearInput("second");
    };

    getPot = async () => {
        // μ€λ§νΈ μ»¨νΈλνΈμ μνλ₯Ό λ³κ²½νμ§ μκ³ , κ°λ§ μ½μ΄μ¬ λ call() νΈμΆ
        const pot = await this.lotteryContract.methods.getPot().call();
        this.setState({ pot: this.web3.utils.fromWei(pot) });
    };

    handleInputChange = (position: "first" | "second", value: string) => {
        if (value.length > 0 && !value.match(/[0-9]|[a-f]|[A-F]/)) {
            alert(`λ² νκΈμλ 0-9 λλ a-f μ€μμλ§ μ νν  μ μμ΅λλ€. νμ¬ μλ ₯κ°: ${value}`);
            this.clearInput(position);
        }
        if (position === "first") {
            this.setState({
                challenges: [value, this.state.challenges[1]],
            });
        }
        if (position === "second") {
            this.setState({
                challenges: [this.state.challenges[0], value],
            });
        }
    };

    clearInput = (position: "first" | "second") => {
        if (position === "first" && this.firstWordInput.current) {
            this.firstWordInput.current.value = "";
        }

        if (position === "second" && this.secondWordInput.current) {
            this.secondWordInput.current.value = "";
        }
    };

    render(): React.ReactNode {
        return (
            <main>
                <section className="py-5 text-center container">
                    <div className="row py-lg-5">
                        <div className="col-lg-6 col-md-8 mx-auto">
                            <h1 className="fw-bold">Lottery</h1>
                            <h2>Current Pot: {this.state.pot} ETH</h2>
                        </div>
                    </div>
                </section>
                <section className="container text-center">
                    <h2>λ² ννκΈ°</h2>
                    <p>0~9 a~f (λμλ¬Έμ κ΅¬λΆ μμ) μ€ κ°μ μλ ₯ν΄μ£ΌμΈμ.</p>
                    <div className="row d-flex justify-content-center mb-3">
                        <input
                            ref={this.firstWordInput}
                            type="text"
                            className="col-lg-3 col-md-6"
                            id="firstWord"
                            placeholder="μ²«λ²μ§Έ κΈμ"
                            maxLength={1}
                            onChange={(e) => {
                                this.handleInputChange("first", e.target.value);
                            }}
                        />
                        <input
                            ref={this.secondWordInput}
                            type="text"
                            className="col-lg-3 col-md-6"
                            id="secondWord"
                            placeholder="λλ²μ§Έ κΈμ"
                            maxLength={1}
                            onChange={(e) => {
                                this.handleInputChange("second", e.target.value);
                            }}
                        />
                    </div>
                    <button className="btn btn-danger btn-lg" onClick={this.bet}>
                        λ² ν
                    </button>
                </section>
                <EventTable web3={this.web3} lotteryContract={this.lotteryContract} />
            </main>
        );
    }
}

export default App;
