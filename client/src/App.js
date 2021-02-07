import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CreditDelegation from "./contracts/CreditDelegation.json";
import getWeb3 from "./getWeb3";
import Steps from "./components/Steps";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const deployedNetworkCredit = CreditDelegation.networks[networkId];
      const instanceCred = new web3.eth.Contract(
        CreditDelegation.abi,
        deployedNetworkCredit && deployedNetworkCredit.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        { web3, accounts, contract: instance, instanceCred },
        this.runExample
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: null });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div>
        <div
          style={{
            background: "blue",
            padding: "20px 40px",
            color: "white",
            textAlign: "center",
            textTransform: "uppercase",
            fontWeight: "bold",
            marginBottom: 40,
          }}
        >
          Credit delegation
        </div>
        <div style={{ width: 940, margin: "auto" }}>
          <Steps
            instanceCred={this.state.instanceCred}
            accounts={this.state.accounts}
            contract={this.state.contract}
          />
        </div>
      </div>
    );
  }
}

export default App;
