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

loadTokenContractUserValues = async () => {
  if (isEthereum && currentAccount) {
    tokenContract.methods
      .balanceOf(currentAccount)
      .call()
      .then((_userJKP3RBalance) => {
        userJKP3RBalance = _userJKP3RBalance;
      });

    tokenContract.methods
      .bonds(currentAccount, tokenAdd)
      .call()
      .then((_bondsBalance) => {
        bondsBalance = _bondsBalance;
        $(".BondBalance").text(
          `${web3.utils.fromWei(bondsBalance, "ether")} JBK3R`
        );
      });
    // keepers
    tokenContract.methods
      .keepers(currentAccount)
      .call()
      .then((_isKeeper) => {
        isKeeper = _isKeeper;
        if (isKeeper) {
          $(".isKeeperPanel").css("display", "flex");

          tokenContract.methods
            .firstSeen(currentAccount)
            .call()
            .then((_firstseen) => {
              $(".firstSeenTime").text(datetimeformat(_firstseen));
            });

          tokenContract.methods
            .lastJob(currentAccount)
            .call()
            .then((_lastseen) => {
              $(".lastSeenTime").text(datetimeformat(_lastseen));
            });

          tokenContract.methods
            .workCompleted(currentAccount)
            .call()
            .then((_workCompleted) => {
              $(".workCompletedValue").text(_workCompleted);
            });
        }
      });

    tokenContract.methods
      .bondings(currentAccount, tokenAdd)
      .call()
      .then((_bondActivationTime) => {
        bondActivationTime = _bondActivationTime;

        if (+bondActivationTime > 0) {
          tokenContract.methods
            .pendingbonds(currentAccount, tokenAdd)
            .call()
            .then((_pendingbondsValue) => {
              // pendingBondsValue
              //pendingbonds
              if (+_pendingbondsValue > 0) {
                $(".bondActivation-Panel").css("display", "flex");
                $(".pendingBondsValue").text(
                  `${web3.utils.fromWei(_pendingbondsValue, "ether")} JBK3R`
                );
                if (+bondActivationTime < +blocktimeStamp) {
                  // $(".bondActivation-Panel-btn").show();
                  $(".if-Activate-Time-done").css("display", "block");
                } else if (+bondActivationTime > +blocktimeStamp) {
                  $(".if-Activate-Time-Pending").css("display", "flex");
                  $(".pending-activate-bond-time-Value").text(
                    datetimeformat(bondActivationTime)
                  );
                }
              }
            });
        }
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
  $(".popup-body").html(bodyMsg);
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
  msgPopupControl(
    "show",
    "Transaction processing",
    "Please confirm this transaction by your metamask wallet",
    "none",
    "load",
    "Waiting for confirmation..."
  );
  // msgPopupControl(
  //   "show",
  //   "Work in Progress...",
  //   "Work in Progress...",
  //   "none",
  //   "none",
  //   "Close"
  // );
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

loadpresalevalues = () => {
  $(".TokenForSale").text("60,000 JBK3R");
  $(".PresaleTokenRate").text(`${presale_token_Rate} ${tokenSymbol} = 1 ETH`);
  $(".PresaleTarget").text(`300 ETH`);
  $(".RemainingToken").text(
    `${web3.utils.fromWei(remainingBalance, "ether")} ${tokenSymbol}`
  );
  // $(".RemainingToken").text(`60,000 ${tokenSymbol}`);
};

addBond = async () => {
  // msgPopupControl(
  //   "show",
  //   "Work in Progress...",
  //   "Work in Progress...",
  //   "none",
  //   "none",
  //   "Close"
  // );

  let bond_Value = $("#bond_JKP3R_value").val();
  msgPopupControl(
    "show",
    "Transaction processing",
    "Please confirm this transaction by your metamask wallet",
    "none",
    "load",
    "Waiting for confirmation..."
  );
  if (isConnected) {
    tokenContract.methods
      .bond(tokenAdd, web3.utils.toWei(bond_Value, "ether"))
      .send({
        from: currentAccount,
      })
      .on("transactionHash", (hash) => {
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
          `Congratulation, your transaction has be successfully Completed, There is a 2 day bonding delay before you can activate as a Keeper. Once the 2 days have passed, you can call "activate". Once activated you lastJob timestamp will be set to the current block timestamp`,
          "none",
          "no",
          `Close`
        );
        appReload();
      });
  }
};
addUnbond = async () => {
  // msgPopupControl(
  //   "show",
  //   "Work in Progress...",
  //   "Work in Progress...",
  //   "none",
  //   "none",
  //   "Close"
  // );

  let unbond_Value = $("#bond_JKP3R_value").val();
  msgPopupControl(
    "show",
    "Transaction processing",
    "Please confirm this transaction by your metamask wallet",
    "none",
    "load",
    "Waiting for confirmation..."
  );

  if (isConnected) {
    tokenContract.methods
      .unbond(tokenAdd, web3.utils.toWei(unbond_Value, "ether"))
      .send({
        from: currentAccount,
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
          `Congratulation, your transaction has be successfully Completed, You have to wait for 10 days before you can withdraw any bonded assets`,
          "none",
          "no",
          `Close`
        );
        appReload();
      });
  }
};

bondUnbondCall = () => {
  // msgPopupControl(
  //   "show",
  //   "Work in Progress...",
  //   "Work in Progress...",
  //   "none",
  //   "none",
  //   "Close"
  // );

  let bondtype = $(".bondtype").text();

  if (bondtype == "Bond:") {
    addBond();
  } else if (bondtype == "Unbond:") {
    addUnbond();
  }
};

activatePendingBond = async () => {
  msgPopupControl(
    "show",
    "Transaction processing",
    "Please confirm this transaction by your metamask wallet",
    "none",
    "load",
    "Waiting for confirmation..."
  );
  tokenContract.methods
    .activate(tokenAdd)
    .send({ from: currentAccount })
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
        `Congratulation, your transaction has be successfully Completed, Your keeper profile is activated now.`,
        "none",
        "no",
        `Close`
      );
      appReload();
    });
};

loadKeeperProfile = () => {};
let keeperProfile = [];
searchKeeperDetails = async () => {
  msgPopupControl(
    "show",
    "Work in Progress...",
    "Work in Progress...",
    "none",
    "none",
    "Close"
  );

  // let search_para = $(".input-value-isKeeper").val();
  // keeperProfile = [];
  // keeperProfile.address = search_para;
  // tokenContract.methods
  //   .keepers(search_para)
  //   .call()
  //   .then((_isSearchKeeper) => {
  //     if (_isSearchKeeper) {
  //       // $(".isKeeperPanel").css("display", "flex");
  //       keeperProfile.isKeeper = _isSearchKeeper;
  //       tokenContract.methods
  //         .firstSeen(search_para)
  //         .call()
  //         .then((_firstseen) => {
  //           // $(".firstSeenTime").text(datetimeformat(_firstseen));
  //           keeperProfile.firstSeen = _firstseen;
  //         });

  //       tokenContract.methods
  //         .lastJob(search_para)
  //         .call()
  //         .then((_lastseen) => {
  //           // $(".lastSeenTime").text(datetimeformat(_lastseen));
  //           keeperProfile.lastSeenTime = _lastseen;
  //         });

  //       tokenContract.methods
  //         .workCompleted(search_para)
  //         .call()
  //         .then((_workCompleted) => {
  //           // $(".workCompletedValue").text(_workCompleted);
  //           keeperProfile.workCompleted = _workCompleted;
  //         });
  //     }
  //   })
  //   .then(() => {
  //     tokenContract.methods
  //       .bondings(search_para, tokenAdd)
  //       .call()
  //       .then((_bondActivationTime) => {
  //         keeperProfile.bondActivationTime = _bondActivationTime;

  //         if (+bondActivationTime > 0) {
  //           tokenContract.methods
  //             .pendingbonds(search_para, tokenAdd)
  //             .call()
  //             .then((_pendingbondsValue) => {
  //               // pendingBondsValue
  //               //pendingbonds
  //               if (+_pendingbondsValue > 0) {
  //                 keeperProfile.pendingbondsValue = _pendingbondsValue;
  //               }
  //             });
  //         }
  //       });
  //   });
};
