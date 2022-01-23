const { existsSync } = require('fs');
const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");

const contractName = process.argv.slice(2)[0];

if (!contractName) {
    throw new Error(`No compiled contract specified to deploy. Please put it in "src/examples/2-deploy-contract/build/contracts" directory and provide its name as an argument to this program, eg.: "node index.js SimpleStorage.json"`);
}

let compiledContractArtifact = null;
const filenames = [`./build/contracts/${contractName}`, `./${contractName}`];
for(const filename of filenames)
{
    if(existsSync(filename))
    {
        console.log(`Found file: ${filename}`);
        compiledContractArtifact = require(filename);
        break;
    }
    else
        console.log(`Checking for file: ${filename}`);
}

if(compiledContractArtifact === null)
    throw new Error(`Unable to find contract file: ${contractName}`);

const DEPLOYER_PRIVATE_KEY = '0xd9066ff9f753a1898709b568119055660a77d9aae4d7a4ad677b8fb3d2a571e5'; // Replace this with your Ethereum private key with funds on Layer 2.
const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev',
};
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
const deployerAccount = web3.eth.accounts.wallet.add(DEPLOYER_PRIVATE_KEY);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

(async () => {
    const balanceSender = BigInt(await web3.eth.getBalance(deployerAccount.address));

    if (balanceSender === 0n) {
        console.log({ balanceSender });
        console.log(`Insufficient balance. Can't deploy contract. Please deposit funds to your Ethereum address: ${deployerAccount.address}`);
        return;
    }

    const shortAddressExpected = (await provider.godwoker.getShortAddressByAllTypeEthAddress('0xD173313A51f8fc37BcF67569b463abd89d81844f')).value;

    console.log({
        shortAddressExpected
    });

    console.log(`Deploying contract...`);

    const deployTx = new web3.eth.Contract(compiledContractArtifact.abi).deploy({
        data: getBytecodeFromArtifact(compiledContractArtifact),
        arguments: []
    }).send({
        from: deployerAccount.address,
        gas: 6000000,
    });

    const contract = await deployTx;

    console.log(`Deployed contract address: ${contract.options.address}`);
    
    const result = await contract.methods.convert('0xD173313A51f8fc37BcF67569b463abd89d81844f').call();

    console.log({
        result
    });

    if (result !== shortAddressExpected) {
        throw new Error(`Contract returns incorrect address. Expected: "${shortAddressExpected}". Received: "${result}".`);
    }
})();

function getBytecodeFromArtifact(contractArtifact) {
    return contractArtifact.bytecode || contractArtifact.data?.bytecode?.object
}
