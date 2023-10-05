import Web3 from 'web3';

const getWeb3 = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    return web3;
  } else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    const web3 = new Web3(window.web3.currentProvider);
    return web3;
  } else {
    throw new Error('No web3 instance detected');
  }
};

export default getWeb3;
