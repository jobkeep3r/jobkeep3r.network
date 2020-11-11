loadTokenContractDefaultValues = async () => {
  if (isEthereum) {
    tokenContract.methods
      .name()
      .call()
      .then((_tokenName) => {
        tokenName = _tokenName;
      });

    tokenContract.methods
      .symbol()
      .call()
      .then((_tokenSymbol) => {
        tokenSymbol = _tokenSymbol;
        // $(".wallet-balance").text(`0 ${tokenSymbol}`);
        if (isEthereum && currentAccount) {
          tokenContract.methods
            .balanceOf(currentAccount)
            .call()
            .then((_userJKP3RBalance) => {
              userJKP3RBalance = _userJKP3RBalance;
              $(".wallet-balance").text(
                `${web3.utils.fromWei(
                  userJKP3RBalance,
                  "ether"
                )} ${tokenSymbol}`
              );
            });
        }

        tokenContract.methods
          .totalSupply()
          .call()
          .then((_totalSupply) => {
            totalSupply = _totalSupply;

            presaleContract.methods
              .rate()
              .call()
              .then((_presale_token_Rate) => {
                presale_token_Rate = _presale_token_Rate;

                tokenContract.methods
                  .balanceOf(presaleAdd_R)
                  .call()
                  .then((_remainingBalance) => {
                    remainingBalance = _remainingBalance;

                    loadpresalevalues();
                  });
              });
          });
      });
  }
};

loadPresaleContractDefaultValues = async () => {
  if (isEthereum) {
    presaleContract.methods
      .rate()
      .call()
      .then((_presale_token_Rate) => {
        presale_token_Rate = _presale_token_Rate;
      });
    presaleContract.methods
      .weiRaised()
      .call()
      .then((_presale_weiRaised) => {
        presale_weiRaised = _presale_weiRaised;
      });
  }
};

msgPopupControl = (visibility, headerMsg, bodyMsg, error, load, action) => {
  if (visibility == "show") {
    $(".trans-popup").css("display", "flex");
  } else {
    $(".trans-popup").css("display", "none");
  }
  $(".popup-header").text(headerMsg);
  $(".popup-body").text(bodyMsg);
  $(".popup-body").css("color", "inherit");
  if (error == "none") {
  } else {
    $(".popup-body").text(error);
    $(".popup-body").css("color", "red");
  }
  if (load == "load") {
    $(".loader").show();
  } else {
    $(".loader").hide();
  }
  $(".TransPopupAction").html(action);
};
buyPresaleToken = async () => {
  let Ether_Value = $("#presale_eth_value ").val();
  // msgPopupControl(
  //   "show",
  //   "Transaction processing",
  //   "Please confirm this transaction by your metamask wallet",
  //   "none",
  //   "load",
  //   "Waiting for confirmation..."
  // );
  msgPopupControl(
    "show",
    "Work in Progress...",
    "Work in Progress...",
    "none",
    "none",
    "Close"
  );
  if (isConnected) {
    presaleContract.methods
      .buyTokens_hdd()
      .send({
        from: currentAccount,
        value: web3.utils.toWei(Ether_Value, "ether"),
      })
      .on("transactionHash", (hash) => {
        // console.log("Hash" + hash);
        msgPopupControl(
          "show",
          "Transaction processing",
          "Please wait while we complete your transaction",
          "none",
          "load",
          `<a  href="http://etherscan.io/tx/${hash}" target="_blank" rel="noopener noreferrer">View on EtherScan</a>`
        );
      })
      .on("error", function (error) {
        // console.log("error" + error.message);
        msgPopupControl(
          "show",
          "Transaction processing",
          "Transaction failed",
          error.message,
          "no",
          `Close`
        );
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        msgPopupControl(
          "show",
          "Transaction Completed",
          `Congratulation, your transaction has be successfully Completed, ${
            Ether_Value * presale_token_Rate
          } ${tokenSymbol} has been successfully added in your wallet`,
          "none",
          "no",
          `Close`
        );
        appReload();
      });
  }
};

addBond = async () => {
  msgPopupControl(
    "show",
    "Work in Progress...",
    "Work in Progress...",
    "none",
    "none",
    "Close"
  );
};
addUnbond = async () => {
  msgPopupControl(
    "show",
    "Work in Progress...",
    "Work in Progress...",
    "none",
    "none",
    "Close"
  );
};

loadTokenContractUserValues = async () => {
  if (isEthereum && currentAccount) {
    tokenContract.methods
      .balanceOf(currentAccount)
      .call()
      .then((_userJKP3RBalance) => {
        userJKP3RBalance = _userJKP3RBalance;
        // $(".wallet-balance").text(
        //   `${web3.utils.fromWei(userJKP3RBalance, "ether")} ${tokenSymbol}`
        // );
      });
  }
};

loadpresalevalues = () => {
  $(".TokenForSale").text(
    `${web3.utils.fromWei(totalSupply, "ether") / 3} ${tokenSymbol}`
  );
  $(".PresaleTokenRate").text(`${presale_token_Rate} ${tokenSymbol} = 1 ETH`);
  $(".PresaleTarget").text(
    `${web3.utils.fromWei(totalSupply, "ether") / (3 * presale_token_Rate)} ETH`
  );
  $(".RemainingToken").text(
    `${web3.utils.fromWei(remainingBalance, "ether")} ${tokenSymbol}`
  );
};
