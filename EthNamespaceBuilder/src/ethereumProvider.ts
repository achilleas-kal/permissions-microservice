import { ethers } from 'ethers';

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const JSONRPCURL = "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID;
const provider = new ethers.JsonRpcProvider(JSONRPCURL);

export default provider;
