resetFunction = () => {
  $(".if-Activate-Time-done").hide();
  $(".if-Activate-Time-Pending").hide();
  $(".bondActivation-Panel").hide();
  $(".bondActivation-Panel-btn").hide();
  $(".isbondenable").css("display", "none");
  $(".isbonddisable").css("display", "flex");
  $(".input-value-bond").val("");
};

appReload = () => {
  connectwallet()
    .then(resetFunction)
    .then(() => {
      walletUpdate();
    })
    .then(async () => {
      if (chainId == undefined && isEthereum) {
        chainId = await web3.eth.net.getNetworkType();
      }
      if (chainId == "main" && isEthereum) {
        tokenContract = await JobKeep3rContact(tokenABI, tokenAdd);
        presaleContract = await JobKeep3rContact(presaleABI, presaleAdd);
      } else if (chainId == "ropsten" && isEthereum) {
        msgPopupControl(
          "show",
          "Wrong Network",
          "",
          "Please Switch to Main Network",
          "no",
          `Close`
        );
        tokenContract = await JobKeep3rContact(tokenABI_R, tokenAdd_R);
        presaleContract = await JobKeep3rContact(presaleABI_R, presaleAdd_R);
      } else {
        msgPopupControl(
          "show",
          "Wrong Network",
          "",
          "Please Switch to Main Network",
          "no",
          `Close`
        );
      }
    })
    .then(async () => {
      if (isEthereum) {
        await loadTokenContractDefaultValues();
        await loadPresaleContractDefaultValues();
      }
    })
    .then(getBlockNoAndDetails)
    .then(loadTokenContractUserValues);
};
