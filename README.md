Make sure Docker is running for contract compilation.

```
yarn
yarn compile
node index.js EthToGodwokenAddr.json
```

Result:
```
➜  eth-to-godwoken-address git:(master) ✗ node index.js EthToGodwokenAddr.json 
Found file: ./build/contracts/EthToGodwokenAddr.json
{ shortAddressExpected: '0x8016dcd1af7c8cceda53e4d2d2cd4e2924e245b6' }
Deploying contract...
Deployed contract address: 0xAe2A293A0E7eF59560A655B08101c34b57C29fc9
{ result: '0xF2FDEc7Bb197CA750193611628Af43CA7E679FA0' }
/home/kuzi/projects/eth-to-godwoken-address/index.js:80
        throw new Error(`Contract returns incorrect address. Expected: "${shortAddressExpected}". Received: "${result}".`);
              ^

Error: Contract returns incorrect address. Expected: "0x8016dcd1af7c8cceda53e4d2d2cd4e2924e245b6". Received: "0xF2FDEc7Bb197CA750193611628Af43CA7E679FA0".
    at /home/kuzi/projects/eth-to-godwoken-address/index.js:80:15
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```