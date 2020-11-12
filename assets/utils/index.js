getBlockNoAndDetails = async () => {
  await web3.eth.getBlockNumber(async (error, bkNo) => {
    if (!error) {
      blockNo = bkNo;
      web3.eth.getBlock(blockNo, false, (err, blockHashR) => {
        if (!err) {
          blockHash = blockHashR;
          blocktimeStamp = blockHash.timestamp;
          currentDate = blocktimeStamp - (blocktimeStamp % 86400);
        } else console.error(err);
      });
    } else console.error(error);
  });
};

datetimeformat = (miliseconds) => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(miliseconds);
  let t2 =
    t.getFullYear() +
    "/" +
    [t.getMonth()] +
    "/" +
    t.getDate() +
    "  " +
    (t.getHours() < 10 ? "0" : "") +
    t.getHours() +
    ":" +
    (t.getMinutes() < 10 ? "0" : "") +
    t.getMinutes() +
    " UTC";
  return t2;
};
