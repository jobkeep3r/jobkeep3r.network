appReload = () => {
  connectwallet().then(async () => {
    if (currentAccount) {
      isConnected = true;
      $(".wallet-btn").hide();
      $(".wallet-btn-connected").show();

      $("#currentAccount").text(
        `${currentAccount.slice(0, 6)}...${currentAccount.slice(
          currentAccount.length - 4,
          currentAccount.length
        )}`
      );
      //   <i class="fas fa-circle icon-color-two">Disconnected</i>
      $(".isConnected").html(
        ` <i class="fas fa-circle icon-color">&nbsp;</i>Connected`
      );
    } else {
      $(".wallet-btn").show();
      $(".wallet-btn-connected").hide();
    }
    chainId = await web3.eth.net.getNetworkType();
  });
};
