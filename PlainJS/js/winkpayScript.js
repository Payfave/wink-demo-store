/* step 1 Enter Amount staer */
/* query param*/
const testAppUrl =
  window.winkEnvValues.testAppURL + window.winkEnvValues.basePath;
const queryParam = new URLSearchParams(window.location.search);
const extractParam = Object.fromEntries(queryParam.entries());
let winkPayAPIKey = window.winkEnvValues.merchantAuthKey.winkApiUsername;
var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
if (Object.keys(extractParam).length == 0) {
  clearStorage();
}
validateMITForm();

/*winkLogin*/
// Client's configuration
var config = {
  url: window.winkEnvValues.winkLoginAuthURL,
  realm: window.winkEnvValues.winkLoginRealm,
  clientId: window.winkEnvValues.winkLoginClientId,
};
const winkLogin = new WinkLogin(config);

const WinkPaymentJS = window.WinkPaymentJS;
window.addEventListener('load', (event) => {
  // Initialization of wink login with callback functions
  winkLogin.initWinkClient({
    onFailure: onFailure,
    getUserProfile: getUserProfile,
  });

  // Initialization of login button onclick function
});

function onFailure(error) {
  console.log('onFailure');
  clearStorage();
  console.log(error);
}

function getUserProfile(profile) {
  if (localStorage.getItem('amount') != '') {
    document.getElementById('checkout-amount').placeholder =
      localStorage.getItem('amount');
  } else {
    document.getElementById('checkout-amount').placeholder = 'Enter amount';
  }
  if (Object.keys(profile).length > 0) {
    const userInfo = {
      id: winkLogin.idToken,
      username: profile.username,
      name: winkLogin.idTokenParsed.given_name,
      surname: winkLogin.idTokenParsed.family_name,
      phone: winkLogin.idTokenParsed.phone_number,
      email: winkLogin.idTokenParsed.email,
      session: winkLogin.session_state,
      access_token: winkLogin.token,
      refresh_token: winkLogin.refreshToken,
      id_token: winkLogin.idToken,
      refresh_token_parsed: winkLogin.refreshTokenParsed,
      refresh_token_expire_date: winkLogin.getFormattedTime(
        winkLogin.refreshTokenParsed.exp
      ),
      id_token_parsed: winkLogin.idTokenParsed,
      id_token_expire_date: winkLogin.getFormattedTime(
        winkLogin.idTokenParsed.exp
      ),
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    if (
      userInfo.access_token !== undefined &&
      localStorage.getItem('amount') != 0 &&
      localStorage.getItem('SelectedOption') === 'checkout' &&
      extractParam.id === '1'
    ) {
      /* redirect to payment url */
      initWinkPayment();
    } else {
      if (
        userInfo.access_token !== undefined &&
        localStorage.getItem('amount') !== '' &&
        localStorage.getItem('SelectedOption') === 'subscribe' &&
        extractParam.id === '1'
      ) {
        initWinkPayment();
      }
    }
  }
}

/* function call when input change in amount*/
/* Checkout Input */
/* Click Event for Checkout*/
function login(btn) {
  localStorage.setItem('SelectedOption', btn);
  if (validate_amount()) {
    localStorage.setItem(
      'amount',
      document.getElementById('checkout-amount').value
    );
  }
  redirectToWinkPayment();
}

function signOut() {
  winkLogin && winkLogin.logout();
  localStorage.setItem('userInfo', '');
}

function refreshToken() {
  winkLogin
    .updateToken(0)
    .then(function (refreshed) {
      if (refreshed) {
        winkLogin.winkLoadUserProfile({
          onFailure: onFailure,
          getUserProfile: getUserProfile,
        });
      } else {
        console.log('Token is still valid');
      }
    })
    .catch(function () {
      console.log('Failed to refresh the token, or the session has expired');
    });
}
/*winkLogin*/

function validate_amount() {
  var amountValue = document.getElementById('checkout-amount').value;
  if (
    amountValue >= 0 &&
    amountValue <= Transactions.maxAmount &&
    amountValue !== ''
  ) {
    document.getElementById('amountError').innerHTML = '';
    return true;
  } else {
    if (amountValue < 0) {
      document.getElementById('amountError').innerHTML =
        'Negative amount is not allowed';
    } else {
      if (amountValue > Transactions.maxAmount) {
        document.getElementById(
          'amountError'
        ).innerHTML = `Value greater than $ ${Transactions.maxAmount} is not allowed`;
      } else {
        document.getElementById('amountError').innerHTML =
          'Please enter a valid amount';
      }
    }
    return false;
  }
}
/* function call when input change in amount*/
function onAmountChange() {
  localStorage.setItem(
    'amount',
    document.getElementById('checkout-amount').value
  );
  if (validate_amount()) {
    document.getElementById('amountError').innerHTML = '';
    $('.wink-pay-testapp-redirect .checkout').removeClass('disabled ');
    $('.wink-pay-testapp-redirect .checkout').addClass('active-background ');
    document.getElementById('checkout').style.color = '#fff';
    $('.wink-pay-testapp-redirect .subscribe').removeClass('disabled');
    $('.wink-pay-testapp-redirect .subscribe').addClass('active-background ');
    document.getElementById('subscribe').style.color = '#fff';
    $('.wink-pay-testapp-redirect .guestCheckOut').removeClass('disabled ');
    $('.wink-pay-testapp-redirect .guestCheckOut').addClass(
      'active-background '
    );
    document.getElementById('guestCheckOut').style.color = '#fff';
    if (document.getElementById('checkout-amount').value == 0) {
      $('.wink-pay-testapp-redirect .checkout').addClass('disabled ');
      $('.wink-pay-testapp-redirect .checkout').removeClass(
        'active-background '
      );
      document.getElementById('checkout').style.backgroundColor = '#e0e0e0';
      document.getElementById('checkout').style.color = '#adb0b3';

      $('.wink-pay-testapp-redirect .guestCheckOut').addClass('disabled ');
      $('.wink-pay-testapp-redirect .guestCheckOut').removeClass(
        'active-background '
      );
      document.getElementById('guestCheckOut').style.backgroundColor =
        '#e0e0e0';
      document.getElementById('guestCheckOut').style.color = '#adb0b3';
    }
  } else {
    $('.wink-pay-testapp-redirect .checkout').addClass('disabled ');
    $('.wink-pay-testapp-redirect .checkout').removeClass('active-background ');
    document.getElementById('checkout').style.backgroundColor = '#e0e0e0';
    document.getElementById('checkout').style.color = '#adb0b3';
    $('.wink-pay-testapp-redirect .subscribe').addClass('disabled');
    $('.wink-pay-testapp-redirect .subscribe').removeClass(
      'active-background '
    );
    document.getElementById('subscribe').style.backgroundColor = '#e0e0e0';
    document.getElementById('subscribe').style.color = '#adb0b3';

    $('.wink-pay-testapp-redirect .guestCheckOut').addClass('disabled ');
    $('.wink-pay-testapp-redirect .guestCheckOut').removeClass(
      'active-background '
    );
    document.getElementById('guestCheckOut').style.backgroundColor = '#e0e0e0';
    document.getElementById('guestCheckOut').style.color = '#adb0b3';
  }
}
/* function call when input change in amount*/
/* Checkout Input */
/*Subscribe Button Click Event*/
/*Validate*/
async function redirectToWinkPayment() {
  if (validate_amount()) {
    const checkoutOpt = localStorage.getItem('SelectedOption');
    if (checkoutOpt === 'guest') {
      const sessionID = await createSessionId();
      localStorage.setItem('sessionID', sessionID);
      if(sessionID != undefined)
      {
        window.location.href = `${window.winkEnvValues.testAppURL}/checkout.html`;
      }
    } else {
      const userData = localStorage.getItem('userInfo');
      const userInfo = userData != '' && JSON.parse(userData);
      if (userData === '' || userInfo === undefined || userInfo === null) {
        /* send user for login into Wi */

        winkLogin.redirectUri = `${testAppUrl}?id=1`;
        winkLogin.winkLogin();
        if (localStorage.getItem('amount') != '') {
          document.getElementById('checkout-amount').placeholder =
            localStorage.getItem('amount');
        } else {
          document.getElementById('checkout-amount').placeholder =
            'Enter amount';
        }
      } else {
        initWinkPayment();
      }
    }
  } else {
    document.getElementById('amountError').innerHTML =
      'Before checkout Enter Valid Amount';
  }
}

/*Http Post Call */
async function postAPi(url, postData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${winkPayAPIKey}:`)}`,
      },
      body: JSON.stringify(postData),
    });
    return response;
  } catch (error) {
    document.getElementById('pay-error').innerHTML = error;
  }
}

/* MIT section code */
function validateMITForm() {
  localStorage.setItem('customerConsentId', queryParam.get("customerConsentId"));
  document.getElementById("mit-amount").value = localStorage.getItem("amount")
  if (queryParam.get("winkCardTokenMIT") !== null && queryParam.get("customerConsentId") !== null) {
    validate_MIT()
    document.getElementById("home-page").style.display = "none"
    document.getElementById("mit-section").style.display = "block"
    document.getElementById("mit-winkPayAPIKey").value = winkPayAPIKey
    document.getElementById("winkCardTokenMIT-value").value = queryParam.get("winkCardTokenMIT")

    //code for successful consent
    if (localStorage.getItem('customerConsentId') !== null
      && localStorage.getItem('customerConsentId') !== undefined) {
      showSuccessToast("Card has been subscribed successfully!")
      setTimeout(function () {
        localStorage.setItem('customerConsentId', null);
      }, 3000);
    }
  }
}

/* check MIT amount value*/
function validate_MIT() {
  var amountValue = document.getElementById("mit-amount").value;
  var winkPayAPI = winkPayAPIKey;
  var description = document.getElementById("mit-description").value;
  if (amountValue >= 0 && amountValue <= Transactions.maxAmount && amountValue != '') {
    flag1 = 1;
  } else {
    flag1 = 0;
    if (amountValue < 0) {
      document.getElementById("pay-error").innerHTML = 'Negative amount is not allowed';
    } else {
      document.getElementById("pay-error").innerHTML = 'Please enter a valid $ amount';
    }
  }
  if (winkPayAPI != "") {
    flag2 = 1;
  } else {
    flag2 = 0;
    document.getElementById("wink-pay-error").innerHTML = 'Please enter a valid Wink Pay API Key';
  }
  if (description.length >= 5) {
    flag3 = 1;
  } else {
    flag3 = 0;
    document.getElementById("description-error").innerHTML = "Please enter the valid description."
  }
  if (flag1 !== 0 && flag2 !== 0 && flag3 !== 0) {
    $(".wink-pay-testapp-redirect .mit-call").removeClass("disabled");
    document.getElementById("mit-call").style.backgroundColor = "#007bff"
    document.getElementById("mit-call").style.color = "#fff"
  } else {
    $(".wink-pay-testapp-redirect .mit-call").addClass("disabled");
    document.getElementById("mit-call").style.backgroundColor = "#e0e0e0"
    document.getElementById("mit-call").style.color = "#111"
  }
}
function onChangeMIT(e) {
  if (e.target.name == "winkPayAPIKey") {
    winkPayAPIKey = e.target.value
    if (e.target.value != "") {
      document.getElementById("wink-pay-error").innerHTML = ""
    } else {
      document.getElementById("wink-pay-error").innerHTML = "Please enter valid Wink Pay API Key."
    }
    validate_MIT()
  }
  if (e.target.name == "amount") {
    validate_MIT()
    if (e.target.value > 0 && e.target.value <= Transactions.maxAmount && e.target.value !== "") {
      document.getElementById("pay-error").innerHTML = ""
    } else {
      if (e.target.value < 0) {
        document.getElementById("pay-error").innerHTML = 'Negative $ amount is not allowed';
      } else {
        if (e.target.value > Transactions.maxAmount) {
          document.getElementById("pay-error").innerHTML = `Value greater than $ ${Transactions.maxAmount} is not allowed`;
        } else {
          document.getElementById("pay-error").innerHTML = 'Please enter a valid $ amount';
        }
      }
    }
  }
  if (e.target.name == "description") {
    if (e.target.value.length >= 5) {
      document.getElementById('mit-description').style.color = 'black';
      document.getElementById("description-error").innerHTML = ""
    } else {
      document.getElementById('mit-description').style.color = 'red';
      document.getElementById("description-error").innerHTML = "Please enter the valid description."
    }
    validate_MIT()
  }
}

/* call for MIT Purchase */
async function purchaseCall() {
  winkPayAPIKey = document.getElementById("mit-winkPayAPIKey").value;
  if (document.getElementById("mit-amount").value !== "" && document.getElementById("mit-winkPayAPIKey").value !== "" && document.getElementById("showLoader").style.display !== 'block') {
    document.getElementById("showLoader").style.display = 'block'
    document.getElementById("mit-call").style.pointerEvents = 'none'
    $(".wink-pay-testapp-redirect .mit-call").removeClass("btn-primary");
    document.getElementById("mit-call").style.backgroundColor = "#e0e0e0"
    document.getElementById("mit-call").style.color = "#111"
    const params = {
      winkCardToken: document.getElementById("winkCardTokenMIT-value").value,
      amount: ISOFormat(document.getElementById("mit-amount").value),
      currencyCode: Transactions.currencyCode,
      description: document.getElementById("mit-description").value
    };
    let response = await postAPi(
      Transactions.Purchase,
      params
    );
    //handle unauthorized api key
    if (response.status == 401) {
      showErrorToast('Please enter a valid Wink Pay API Key and try again!')
      document.getElementById("showLoader").style.display = 'none';
      document.getElementById("mit-call").style.pointerEvents = ''
      document.getElementById("mit-call").style.backgroundColor = "#007bff"
      document.getElementById("mit-call").style.color = "#fff"
      setTimeout(function () {
        response = ''
      }, 5000);
    }
    const result = await response.json();
    if (!response.ok) {
      document.getElementById("showLoader").style.display = 'none';
      document.getElementById("mit-call").style.pointerEvents = ''
      showErrorToast(result.Message)
      $(".wink-pay-testapp-redirect .mit-call").removeClass("disabled");
      $(".wink-pay-testapp-redirect .mit-call").addClass("btn-primary");
      document.getElementById("mit-call").style.backgroundColor = "#007bff"
      document.getElementById("mit-call").style.color = "#fff"
      document.getElementById("pay-error").innerHTML = ""
      setTimeout(function () {
        response = ''
      }, 5000);
    } else {
      document.getElementById("showLoader").style.display = 'none';
      document.getElementById("mit-call").style.pointerEvents = ''
      window.location.href = `${testAppUrl}/ordercompleted.html?transactionId=${result?.transactionId}&amount=${result?.amount}&currencyCode=${result?.currencyCode}`;
    }
  } else {
    if (document.getElementById("showLoader").style.display === '') {
      if ($("#mit-amount").value === "")
        document.getElementById("pay-error").innerHTML = "Enter a valid amount"
    }
  }
}

function backCall() {
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo.access_token !== undefined) {
    initWinkPayment();
    userInfo = '';
  } else {
    userInfo = '';
    window.location.href = `${testAppUrl}`;
  }
}

function clearStorage() {
  localStorage.setItem('userInfo', '');
  localStorage.setItem('SelectedOption', '');
  localStorage.setItem('amount', '');
  localStorage.setItem('customerConsentId', '');
  localStorage.setItem('mode', 'redirect');
  $('#checkout-amount').val('')
}

async function createSessionId() {
  document.getElementById('initLoader').style.display = 'block';
  const params = {
    merchantId: window.winkEnvValues.winkLoginClientId,
    paymentId: "merchantSystemOrderId",
    amount: ISOFormat(`${localStorage.getItem('amount')}`),
    currencyCode: Transactions.currencyCode,
    returnUrl: `${testAppUrl}/ordercompleted.html`,
    cancelUrl: `${testAppUrl}/ordercancelled.html`,
    description: "this is dummy description for payment given by merchant"
  }
  let response = await postAPi(
    Transactions.Session,
    params
  )
  if (response.status == 200) {
    document.getElementById('initLoader').style.display = 'none';
    let result = await response.json();
    return result.sessionId;
  } else {
    document.getElementById('initLoader').style.display = 'none';
    showErrorToast('Sorry some error occured, please try again!')
  }

}
async function initWinkPayment() {
  const userInfoLocalData = localStorage.getItem('userInfo');
  let userInfo = userInfoLocalData != '' && JSON.parse(localStorage.getItem('userInfo'));
  const params = {
    redirectUrl: window.winkEnvValues.winkPaymentURL,
    sessionId: await createSessionId(),
    selectedOption: `${localStorage.getItem('SelectedOption')}`,
    mode: (localStorage.getItem('mode') === undefined
      || localStorage.getItem('mode') === null
      || localStorage.getItem('mode') === '')
      ? Modes.redirect
      : localStorage.getItem('mode'),
  };
  if (localStorage.getItem('SelectedOption') === 'guest') {
    params.guestCheckout = true;
  } else {
    params.accessToken = userInfo.access_token;
    params.name = `${encodeURIComponent(userInfo.name + ' ' + userInfo.surname)}`;
  }
  if (params.mode === Modes.iFrameEmbedded) {
    params.div = Modes.iFrameEmbedded
  }
  if (params.mode === Modes.iFrameOverlay) {
    params.div = Modes.iFrameOverlay
  }
  if (params.sessionId != undefined) {
    WinkPaymentJS.init(params);
  }
}
function showErrorToast(errorMessage) {
  $(".wink-pay-testapp-redirect .alert .alert-danger .d-flex .align-items-center .toastMessage").addClass("active-toast");
  document.getElementById("alertError").style.display = 'block !important';
  document.getElementById("alertSection").style.display = "flex"
  document.getElementById("alertError").style.zIndex = 1;
  document.getElementById("displayErrorToastMessage").style.fontSize = '14px'
  document.getElementById("displayErrorToastMessage").innerHTML += errorMessage
  setTimeout(function () {
    document.getElementById("alertError").style.display = 'none !important;';
    document.getElementById("alertSection").style.display = "none"
    document.getElementById("displayErrorToastMessage").innerHTML = ''
  }, 5000)
}
function showSuccessToast(sucessMessage) {
  $(".wink-pay-testapp-redirect .alert .alert-success .d-flex .align-items-center .toastMessage").addClass("active-toast");
  document.getElementById("alertSuccess").style.display = 'block !important';
  document.getElementById("alertSection").style.display = "flex"
  document.getElementById("alertSuccess").style.zIndex = 1;
  document.getElementById("displayToastMessage").innerHTML += sucessMessage;
  setTimeout(function () {
    document.getElementById("alertSuccess").style.display = 'none !important;';
    document.getElementById("alertSection").style.display = "none"
    document.getElementById("displayToastMessage").innerHTML = ''
    document.getElementById("displayErrorToastMessage").innerHTML = ''
  }, 5000)
}

function ISOFormat(amount) {
  return amount * 100;
}
function selectMode(e) {
  localStorage.setItem('mode', e.target.value);
}