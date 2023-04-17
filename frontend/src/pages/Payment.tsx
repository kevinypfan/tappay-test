import { useEffect, useState } from "react";
import "../style.css";
import $ from "jquery";
import { useRecoilState } from "recoil";
import { orderState } from "../store/order";

declare var TPDirect: any;

var statusTable = {
  "0": "欄位已填好，並且沒有問題",
  "1": "欄位還沒有填寫",
  "2": "欄位有錯誤，此時在 CardView 裡面會用顯示 errorColor",
  "3": "使用者正在輸入中",
};
var defaultCardViewStyle = {
  color: "rgb(0,0,0)",
  fontSize: "15px",
  lineHeight: "24px",
  fontWeight: "300",
  errorColor: "red",
  placeholderColor: "",
};
var config = {
  isUsedCcv: false,
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
};

export const PaymentPage = () => {
  const [order, setOrder] = useRecoilState(orderState);
  const getTotalPrice = () => {
    return order.map((o) => o.total).reduce((a, b) => a + b, 0);
  };

  const cardSubmitHandler = () => {
    TPDirect.card.getPrime(function (result: any) {
      var command = `
              Use following command to send to server \n\n
              curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
              -H 'content-type: application/json' \\
              -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
              -d '{
                  "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
                  "prime": "${result.card.prime}",
                  "amount": "1",
                  "merchant_id": "GlobalTesting_CTBC",
                  "details": "Some item",
                  "cardholder": {
                      "phone_number": "+886923456789",
                      "name": "王小明",
                      "email": "LittleMing@Wang.com",
                      "zip_code": "100",
                      "address": "台北市天龍區芝麻街1號1樓",
                      "national_id": "A123456789"
                  }
              }'`.replace(/                /g, "");

      console.log(command);
    });
  };

  const getTapOptions = () => {
    var data = {
      supportedNetworks: ["MASTERCARD", "DISCOVER", "VISA"],
      supportedMethods: ["card", "pay_with_google", "apple_pay"],
      displayItems: [
        {
          label: "iPhone8",
          amount: {
            currency: "TWD",
            value: "1.00",
          },
        },
      ],
      total: {
        label: "付給 TapPay",
        amount: {
          currency: "TWD",
          value: "1.00",
        },
      },
      // optional
      options: {
        requestPayerEmail: false,
        requestPayerName: false,
        requestPayerPhone: false,
        requestShipping: false,
      },
    };

    data.displayItems = order.map((o) => {
      return {
        label: o.name,
        amount: {
          currency: "TWD",
          value: o.total.toString(),
        },
      };
    });

    data.total.amount.value = getTotalPrice().toString();
    return data;
  };

  useEffect(() => {
    TPDirect.setupSDK(
      128381,
      "app_oz8g9fBTnjXqJRRIdfizWZ6fuMbvBa3zp3iHHu09KFq0FJX5ARimn8ZF8XI6",
      "sandbox"
    );

    TPDirect.paymentRequestApi.setupApplePay({
      // required, your apple merchant id
      merchantIdentifier: "merchant.tech.cherri.global.test",
      // defaults to 'TW'
      countryCode: "TW",
    });
    TPDirect.paymentRequestApi.setupPayWithGoogle({
      // defaults to ['CARD', 'TOKENIZED_CARD']
      allowedPaymentMethods: ["CARD", "TOKENIZED_CARD"],

      // Indicates whether or not you allow prepaid debit cards as a form of payment.
      // Set to true to allow prepaid debit cards. Otherwise, set to false.
      // defaults to true
      allowPrepaidCards: true,

      // defaults to false
      billingAddressRequired: false,
      // defaults to  'MIN'
      billingAddressFormat: "MIN", // FULL, MIN

      // Set the ISO 3166-1 alpha-2 formatted country codes of the countries to which shipping is allowed.
      // If not specified, all countries are allowed.
      // defaults to undefined (allow all shipping address)
      // allowedCountryCodes: ['TW']
    });
    TPDirect.paymentRequestApi.setupPaymentRequest(
      getTapOptions(),
      function (result: any) {
        // result.browserSupportPaymentRequest
        // result.canMakePaymentWithActiveCard
        if (!result.browserSupportPaymentRequest) {
          $("#pr-button").css("display", "none");
          $("#browser-no-support-message").removeClass("hidden");
          return;
        }

        var pay_button = document.getElementById("pay-button");
        pay_button?.addEventListener("click", function (event) {
          TPDirect.paymentRequestApi.getPrime(function (getPrimeResult: any) {
            $("#get-prime-result").removeClass("hidden");
            $("#get-prime-result pre code").text(
              JSON.stringify(getPrimeResult, null, 2)
            );
            $(".get-prime-status").addClass("hidden");
            console.log(getPrimeResult);
            if (getPrimeResult.status !== 0) {
              console.log("getPrime failed: " + getPrimeResult.msg);
              $("#get-prime-failed-message").removeClass("hidden");
              return;
            }
            // send prime to server
            console.log("prime: " + getPrimeResult.prime);
            $("#get-prime-success-message").removeClass("hidden");
            $("#get-prime-success-message p").text(getPrimeResult.prime);

            var command = `
                curl -X POST https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime \\
                -H 'content-type: application/json' \\
                -H 'x-api-key: partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM' \\
                -d '{
                    "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
                    "prime": "${getPrimeResult.prime}",
                    "amount": "${parseInt(getPrimeResult.total_amount)}",
                    "merchant_id": "GlobalTesting_CTBC",
                    "details": "Some item",
                    "cardholder": {
                        "phone_number": "${getPrimeResult.payer.phone || ""} ",
                        "name": "${getPrimeResult.payer.name || ""}",
                        "email": "${getPrimeResult.payer.email || ""}",
                        "zip_code": "123",
                        "address": "台北市天龍區芝麻街1號1樓",
                        "national_id": "A123456789"
                    }
                }'`.replace(/                /g, "");

            $("#curl").removeClass("hidden");
            $("#curl pre code").text(command);
          });
        });
      }
    );

    // Card

    TPDirect.card.setup("#tappay-iframe", defaultCardViewStyle, config);
    TPDirect.card.onUpdate(function (update: any) {
      var submitButton = document.querySelector("#submit");
      var cardViewContainer = document.querySelector("#tappay-iframe");

      if (update.canGetPrime) {
        submitButton?.removeAttribute("disabled");
      } else {
        submitButton?.setAttribute("disabled", "true");
      }

      var message = document.querySelector("#message");
      if (!message) return;
      //   message.innerHTML = `
      //             canGetPrime: ${update.canGetPrime} \n
      //             cardNumberStatus: ${statusTable[update.status.number]} \n
      //             cardExpiryStatus: ${statusTable[update.status.expiry]} \n
      //             ccvStatus: ${statusTable[update.status.ccv]}
      //         `.replace(/    /g, "");

      if (update.hasError) {
        message.classList.add("error");
        message.classList.remove("info");
      } else {
        message.classList.remove("error");
        message.classList.add("info");
      }
    });
  }, []);
  return (
    <>
      <div className="ui grid centered doubling stackable">
        <div className="six wide column">
          <div className="ui segment">
            <h1 className="ui header">Direct Pay - iframe</h1>

            <form className="ui form">
              <div className="field">
                <label>信用卡</label>
                <div id="tappay-iframe"></div>
              </div>
            </form>

            <div className="ui button" id="submit" onClick={cardSubmitHandler}>
              Get Prime
            </div>
            <pre
              className="ui error message"
              id="message"
              style={{ overflowX: "auto" }}
            ></pre>
            <pre
              className="ui info message"
              id="result"
              style={{ overflowX: "auto" }}
            ></pre>
            <pre
              className="ui info message"
              id="curl"
              style={{ overflowX: "auto" }}
            ></pre>
          </div>
        </div>
      </div>
      <div className="ui grid container">
        <div className="column">
          <h1>TapPay PaymentRequest Button Demo</h1>
          <div>
            <button className="ui button" id="pay-button">
              Custom Payment Button
            </button>
          </div>
          <div
            className="ui negative message hidden"
            id="browser-no-support-message"
          >
            <div className="header">瀏覽器不支援 PaymentRequest</div>
          </div>

          <div
            className="ui negative message hidden get-prime-status"
            id="get-prime-failed-message"
          >
            <div className="header">get prime failed</div>
            <p></p>
          </div>

          <div
            className="ui success message hidden get-prime-status"
            id="get-prime-success-message"
          >
            <div className="header">get prime success</div>
            <p></p>
          </div>

          <div className="hidden" id="get-prime-result">
            <h2 className="ui top attached header">getPrimeResult</h2>
            <div className="ui buttom attached segment">
              <pre>
                <code></code>
              </pre>
            </div>
          </div>

          <div className="hidden" id="curl">
            <h2 className="ui top attached header">
              Use following data to send to server.
            </h2>
            <div className="ui buttom attached segment">
              <pre>
                <code></code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
