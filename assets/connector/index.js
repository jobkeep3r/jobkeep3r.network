connectwallet = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    isEthereum = true;
    try {
      await window.ethereum.enable();
    } catch (error) {}
    try {
      await web3.eth.getAccounts(function (error, result) {
        if (!error) {
          currentAccount = result[0];
          if (currentAccount) {
            isConnected = true;
          }
        } else console.error(error);
      });
      net = await web3.eth.net.getNetworkType();
    } catch {}
  } else if (window.web3) {
    isEthereum = true;
    window.web3 = new Web3(web3.currentProvider);
    try {
      await window.ethereum.enable();
    } catch (error) {}
    try {
      await web3.eth.getAccounts(function (error, result) {
        if (!error) {
          currentAccount = result[0];
          if (currentAccount) {
            isConnected = true;
          }
        } else console.error(error);
      });
      chainId = await web3.eth.net.getNetworkType();
    } catch {}
  } else {
  }
};

copyAddress = () => {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(currentAccount).select();
  document.execCommand("copy");
  $temp.remove();
};

walletUpdate = async () => {
  try {
    if (currentAccount != undefined) {
      isConnected = true;
      $(".wallet-btn").hide();
      $(".wallet-btn-connected").show();

      $("#currentAccountClass").text(
        `${currentAccount.slice(0, 7)}...${currentAccount.slice(
          currentAccount.length - 5,
          currentAccount.length
        )}`
      );

      $(".VeiwLink").attr(
        "href",
        `http://etherscan.io/address/${currentAccount}`
      );

      //   var str = "2547898.32585";
      //   var res = str.split(".");
      $(".isConnected").html(
        ` <i class="fas fa-circle icon-color">&nbsp;</i>Connected`
      );
    } else {
      $(".wallet-btn").show();
      $(".wallet-btn-connected").hide();
    }
  } catch {
    alert("please install Metamask");
  }
};

if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (currentAccount) {
    let isConnected = document.getElementById("wallet-btn");
    // var walletAddress = document.getElementById("walletAddress");
    // isConnected.innerHTML =
    //   '<i class="fa fa-circle text-danger"></i> Connect Wallet (Web3)';
    // walletAddress.innerHTML = "";
    //genrate request for wallet connection
    appReload();
  });
  ethereum.on("chainChanged", (chainId) => {
    // window.location.reload();
  });
}
