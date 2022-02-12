const https = require("https");
/*
 * import checksum generation utility
 * You can get this utility from https://developer.paytm.com/docs/checksum/
 */
const PaytmChecksum = require("paytmchecksum");

var paytmParams = {};
let ORDERID = "ORDERID_98769";
let MID = "YOUR_MID_HERE";
let MERCHANT_KEY = "YOUR_MERCHANT_KEY_HERE";

paytmParams.body = {
  requestType: "Payment",
  mid: MID,
  websiteName: "WEBSTAGING",
  orderId: ORDERID,
  callbackUrl:
    "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=" + ORDERID,
  txnAmount: {
    value: "10.00",
    currency: "INR",
  },
  userInfo: {
    custId: "CUST_001",
  },
};

/*
 * Generate checksum by parameters we have in body
 * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
 */

const mainModule = () => {
  PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    MERCHANT_KEY
  ).then(function (checksum) {
    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {
      /* for Staging */
      hostname: "securegw-stage.paytm.in" /* for Production */, // hostname: 'securegw.paytm.in',

      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${ORDERID}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    var response = "";
    var post_req = https.request(options, function (post_res) {
      post_res.on("data", function (chunk) {
        response += chunk;
      });

      post_res.on("end", function () {
        console.log("Response: ", JSON.parse(response));
      });
    });

    post_req.write(post_data);
    post_req.end();
  });
};
mainModule();
