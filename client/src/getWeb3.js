import Web3 from 'web3';

const getWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      return window.web3;
    } catch (error) {
      throw new Error('User denied account access');
    }
  } else if (window.web3) {
    return window.web3;
  } else {
    throw new Error('No web3 instance detected');
  }
};

export default getWeb3;
