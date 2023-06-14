import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import dotenv from "dotenv";

dotenv.config();
const { API_KEY, PRIVATE_KEY } = process.env;

const settings = {
  apiKey: API_KEY,
  network: Network.MATIC_MUMBAI, // Replace with your network.
};
const alchemy = new Alchemy(settings);

let wallet = new Wallet(PRIVATE_KEY);

const nonce = await alchemy.core.getTransactionCount(wallet.address, "latest");

let exampleTx = {    
  to: "0xaE1f70DfD271B8be3f0122Ec291D3c43C3290d5A",
  value: Utils.parseUnits('0.01', 'ether'),    // specified in wei where 10^18 wei = 1 ETH
  gasLimit: "21000",    // Standard limit is 21000 units
  maxFeePerGas: Utils.parseUnits('20', 'gwei'), // total amount you are willing to pay per gas for the transaction to execute
  nonce: nonce, // security purposes and to prevent replay attacks
  type: 2,  // https://eips.ethereum.org/EIPS/eip-2718
  //chainId: 11155111,    // Sepolia Testnet
  chainId: 80001,   // Polygon Testnet (Mumbai) 
};

console.log("exampleTx ", exampleTx);


let rawTransaction = await wallet.signTransaction(exampleTx);

console.log("rawTransaction ", rawTransaction);

// eth_sendPrivateTransaction is not available on the ETH_SEPOLIA.
// Unsupported method: eth_sendPrivateTransaction on matic
// https://docs.alchemy.com/reference/feature-support-by-chain

const signedTx = await alchemy.transact.sendPrivateTransaction(
  rawTransaction,
  (await alchemy.core.getBlockNumber()) + 1
);

console.log("signedTx ", signedTx);
