JobKeep3rContact = async (ABI, Address) => {
  if (chainId == undefined) {
    chainId = await web3.eth.net.getNetworkType();
  }

  if (chainId == "main") {
    trans_URL = "https://etherscan.io";
  } else if (chainId == "ropsten") {
    trans_URL = "https://ropsten.etherscan.io";
  }
  return new web3.eth.Contract(ABI, Address);
};
