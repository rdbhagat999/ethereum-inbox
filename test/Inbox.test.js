const assert = require("assert");
const ganache = require("ganache-cli");
const WEB3 = require("web3");

const { abi, evm } = require("../compile");

const web3 = new WEB3(ganache.provider());
const INITIAL_STRING = "Hello World";

let accounts = [];
let defaultAccount = null;
let inbox = null;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // Set the default account
  defaultAccount = web3.eth.defaultAccount = accounts[0];

  // Use the default account to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [INITIAL_STRING],
    })
    .send({ from: defaultAccount, gas: "1000000" });
});

describe("Inbox", () => {
  it("should deploy a contract", () => {
    // console.log(inbox.options.address);
    // the contract address should be defined
    assert.ok(inbox.options.address);
  });

  it("should have a default message", async () => {
    const message = await inbox.methods.getMessage().call();
    // console.log(message);
    // assert.ok(message);
    assert.equal(INITIAL_STRING, message);
  });

  it("should change the message", async () => {
    const newMessage = "Ramandeep";

    await inbox.methods.setMessage(newMessage).send({
      from: defaultAccount,
      // gas: "1000000",
    });

    const message = await inbox.methods.getMessage().call();
    assert.equal(newMessage, message);
  });
});
