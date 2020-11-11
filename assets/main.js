$(async () => {
  $(".wallet-btn-connected").hide();
});

$(".isbondenable").css("display", "none");
$(".isbonddisable").css("display", "flex");
$(".input-value-bond").val("");

$("#wallet-btn").click(appReload);

$(".copyAddress").click(copyAddress);

$(".buy-token-from-presale").click(buyPresaleToken);

$(document).on("keydown", "input[pattern]", function (e) {
  var input = $(this);
  var oldVal = input.val();
  var regex = new RegExp(input.attr("pattern"), "g");

  setTimeout(function () {
    var newVal = input.val();
    if (!regex.test(newVal)) {
      input.val(oldVal);
    }
  }, 0);
});

$("#presale_eth_value").on("input", () => {
  if (presale_token_Rate != undefined) {
    $(".calculate-eth-token").text(
      `You will receive ${
        $("#presale_eth_value").val() * presale_token_Rate
      } ${tokenSymbol}`
    );
  }
});

window.addEventListener("load", function () {
  // $(".trigger_popup_fricc").click(function () {
  //   $(".hover_bkgr_fricc").show();
  // });
  // $(".hover_bkgr_fricc").click(function () {
  //   $(".hover_bkgr_fricc").hide();
  // });
  $(".popupCloseButton").click(function () {
    $(".trans-popup").hide();
  });
  $(".TransPopupAction").click(() => {
    if ($(".TransPopupAction").text() == "Close") {
      $(".trans-popup").hide();
    }
  });
});

$(".bondEnable").click(() => {
  $(".bondtype").text("Bond:");
  $(".isbondenable").css("display", "flex");
  $(".isbonddisable").css("display", "none");
});
$(".unbondEnable").click(() => {
  $(".bondtype").text("Unbond:");
  $(".isbondenable").css("display", "flex");
  $(".isbonddisable").css("display", "none");
});
$(".input-submit-cancel").click(() => {
  $(".isbondenable").css("display", "none");
  $(".isbonddisable").css("display", "flex");
  $(".input-value-bond").val("");
});

// $(".bondEnable").click(addBond);
// $(".unbondEnable").click(addUnbond);
$(".input-submit-bond").click(addUnbond);
