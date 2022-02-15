const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const dotenv = require("dotenv");

const { abi, evm } = require("./compile");

dotenv.config();

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: `${process.env.YOUR_MNEMONIC}`,
  },
  providerOrUrl: `${process.env.YOUR_INFURA_URL}`,
  pollingInterval: 8000,
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  let defaultAccount = accounts[0];

  console.log("Attempting to deploy from account", defaultAccount);
  console.log("\n \n \n \n");

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ["Hello World!"] })
    .send({ gas: "1000000", from: defaultAccount });

  console.log("Contract deployed to", result.options.address);
  console.log("\n \n \n \n");

  // to prevent hanging deployment
  provider.engine.stop();
};

deploy();
