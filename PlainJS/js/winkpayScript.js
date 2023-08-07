/* step 1 Enter Amount staer */
/* query param*/
const testAppUrl =
  window.winkEnvValues.testAppURL + window.winkEnvValues.basePath;
const queryParam = new URLSearchParams(window.location.search);
const extractParam = Object.fromEntries(queryParam.entries());
let winkPayAPIKey = window.winkEnvValues.paymentMerchantAuthKey;
var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
if (Object.keys(extractParam).length == 0) {
  clearStorage();
}
validateMITForm();

window.addEventListener('load', (event) => {
  $('#signinButton').addClass('disabled');
  const selectBox = $('#merchantOption')[0];
  const merchantSelectedIndex = localStorage.getItem('merchantIndex');
  if (
    (merchantSelectedIndex === 0 || merchantSelectedIndex === '') &&
    merchantSelectedIndex !== undefined
  ) {
    disableButton();
  }
  if (
    merchantSelectedIndex !== 0 &&
    merchantSelectedIndex !== undefined &&
    merchantSelectedIndex !== '' &&
    merchantSelectedIndex !== null
  ) {
    selectBox.selectedIndex = merchantSelectedIndex;
    $('#signinButton').removeClass('disabled');
    $('#checkout-amount').removeClass('disabled');
  }
  const clientId = getClientId();
  $('#initLoader').hide();
  // Initialization of wink login with callback functions
  if (clientId !== undefined) {
    // Client's configuration
    var config = {
      url: window.winkEnvValues.winkLoginAuthURL,
      realm: window.winkEnvValues.winkLoginRealm,
      clientId: getClientId(),
      onAuthErrorFailure: (error) => console.error(error),
      loggingEnabled: true,
    };
    $('#initLoader').show();

    winkLogin = getWinkLoginClient(config);
    winkLogin.winkInit({
      onFailure: onFailure,
      onSuccess: getUserProfile,
    });
  }
  $('#initLoader').hide();

  // Initialization of login button onclick function
});

function onFailure() {
  console.log('error');
  clearStorage();
  $('#initLoader').hide();
}

async function getUserProfile() {
  if (localStorage.getItem('amount') != '') {
    document.getElementById('checkout-amount').placeholder =
      localStorage.getItem('amount');
  } else {
    document.getElementById('checkout-amount').placeholder = 'Enter amount';
  }
  $('#checkout-amount').removeClass('disabled ');
  if (Object.keys(winkLogin).length > 0) {
    $('#initLoader').show();
    const userData = localStorage.getItem('userInfo');
    const userInfo = userData != '' && JSON.parse(userData);

    if (loadUserProfile()) {
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
    } else {
      $('#initLoader').hide();
      showErrorToast('Sorry some error occured, please try again!');
    }
    $('#initLoader').hide();
    $('#logoutButton').removeClass('disabled');
  }
}

loadUserProfile = async () => {
  let userResp = await getAPi(LoginUserData.userProfileData, winkLogin.token);
  const data = parseJwt(winkLogin.token);

  let result;
  if (userResp?.status == 200) {
    $('#initLoader').hide();
    result = await userResp.json();
    const userInfo = {
      id: winkLogin.idToken,
      username: data.username ?? data.preferred_username,
      name: result.firstName,
      surname: result.lastName,
      phone: result.contactNo,
      email: result.email,
      session: winkLogin.session_state,
      access_token: winkLogin.token,
      refresh_token: winkLogin.refreshToken,
      id_token: winkLogin.idToken,
      refresh_token_parsed: winkLogin.refreshTokenParsed,
      // refresh_token_expire_date: winkLogin.getFormattedTime(
      //   winkLogin.refreshTokenParsed.exp
      // ),
      id_token_parsed: winkLogin.idTokenParsed,
      // id_token_expire_date: winkLogin.getFormattedTime(
      //   winkLogin.idTokenParsed.exp
      // ),
    };
    //console.log('userInfo', userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    checkLoginStatus();
    return true;
  } else {
    return false;
  }
};

/* function call when input change in amount*/
/* Checkout Input */
/* Click Event for Checkout*/

function login(btn) {
  localStorage.setItem('SelectedOption', btn);
  if (btn === checkoutMode.checkout) {
    winkPayAPIKey = getKey();
  } else if (btn === checkoutMode.subscribe) {
    winkPayAPIKey = getKey();
  }
  document.getElementById('embeddediFrame').innerHTML = '';
  if (validate_amount()) {
    localStorage.setItem(
      'amount',
      document.getElementById('checkout-amount').value
    );
  }
  redirectToWinkPayment();
}

function signOut() {
  winkLogin &&
    winkLogin.winkLogout({
      onFailure: (error) => console.error(error),
    });
  localStorage.setItem('userInfo', '');
  localStorage.setItem('merchantIndex', '');
  localStorage.setItem('merchantOption', '');
}

function refreshToken() {
  winkLogin
    .updateToken(0)
    .then(function (refreshed) {
      if (refreshed) {
        loadUserProfile();
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
    document.getElementById('checkout').style.color = '#fff';
    $('.wink-pay-testapp-redirect .subscribe').removeClass('disabled');
    document.getElementById('subscribe').style.color = '#fff';
    $('.wink-pay-testapp-redirect .guestCheckOut').removeClass('disabled ');
    document.getElementById('guestCheckOut').style.color = '#fff';
    if (document.getElementById('checkout-amount').value < 1) {
      $('.wink-pay-testapp-redirect .checkout').addClass('disabled ');
      document.getElementById('checkout').style.backgroundColor = '#e0e0e0';
      document.getElementById('checkout').style.color = '#adb0b3';

      $('.wink-pay-testapp-redirect .guestCheckOut').addClass('disabled ');
      document.getElementById('guestCheckOut').style.backgroundColor =
        '#e0e0e0';
      document.getElementById('guestCheckOut').style.color = '#adb0b3';
    }
  } else {
    $('.wink-pay-testapp-redirect .checkout').addClass('disabled ');
    document.getElementById('checkout').style.backgroundColor = '#e0e0e0';
    document.getElementById('checkout').style.color = '#adb0b3';
    $('.wink-pay-testapp-redirect .subscribe').addClass('disabled');
    document.getElementById('subscribe').style.backgroundColor = '#e0e0e0';
    document.getElementById('subscribe').style.color = '#adb0b3';
    $('.wink-pay-testapp-redirect .guestCheckOut').addClass('disabled ');
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
    if (
      checkoutOpt === checkoutMode.checkout ||
      checkoutOpt === checkoutMode.guest
    ) {
      initWinkPayment();
    } else {
      const userData = localStorage.getItem('userInfo');
      const userInfo = userData != '' && JSON.parse(userData);
      if (userData === '' || userInfo === undefined || userInfo === null) {
        /* send user for login into Wi */

        winkLogin.redirectUri = `${testAppUrl}?id=1`;
        winkLogin.winkLogin();
        if (localStorage.getItem('amount') != '') {
          $('#checkout-amount').val(localStorage.getItem('amount'));
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
        Authorization: `Basic ${btoa(`${getKey()}:`)}`,
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
  localStorage.setItem(
    'customerConsentId',
    queryParam.get('customerConsentId')
  );
  const amt = localStorage.getItem('amount');
  if (amt !== '') {
    document.getElementById('mit-amount').value =
      localStorage.getItem('amount');
  }
  if (
    queryParam.get('winkCardTokenMIT') !== null &&
    queryParam.get('customerConsentId') !== null
  ) {
    validate_MIT();
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('mit-section').style.display = 'block';
    document.getElementById('mit-winkPayAPIKey').value = getKey();
    document.getElementById('winkCardTokenMIT-value').value =
      queryParam.get('winkCardTokenMIT');
    document.getElementById('loginSection').style.display = 'none';
    //code for successful consent
    if (
      localStorage.getItem('customerConsentId') !== null &&
      localStorage.getItem('customerConsentId') !== undefined
    ) {
      showSuccessToast('Card has been subscribed successfully!');
      setTimeout(function () {
        localStorage.setItem('customerConsentId', null);
      }, 3000);
    }
  }
}

/* check MIT amount value*/
function validate_MIT() {
  if (localStorage.getItem('SelectedOption') === checkoutMode.subscribe) {
    winkPayAPIKey;
  } else if (localStorage.getItem('SelectedOption') === checkoutMode.checkout) {
    winkPayAPIKey;
  } else if (localStorage.getItem('SelectedOption') === checkoutMode.guest) {
    winkPayAPIKey;
  }
  var amountValue = document.getElementById('mit-amount').value;
  var winkPayAPI = winkPayAPIKey;
  var description = document.getElementById('mit-description').value;
  if (
    amountValue >= 1 &&
    amountValue <= Transactions.maxAmount &&
    amountValue != ''
  ) {
    flag1 = 1;
  } else {
    flag1 = 0;
    if (amountValue < 0) {
      document.getElementById('pay-error').innerHTML =
        'Negative amount is not allowed';
    } else {
      document.getElementById('pay-error').innerHTML =
        'Please enter a valid $ amount';
    }
  }
  if (winkPayAPI != '') {
    flag2 = 1;
  } else {
    flag2 = 0;
    document.getElementById('wink-pay-error').innerHTML =
      'Please enter a valid Wink Pay API Key';
  }
  if (description.length >= 5) {
    flag3 = 1;
  } else {
    flag3 = 0;
    document.getElementById('description-error').innerHTML =
      'Please enter the valid description.';
  }
  if (flag1 !== 0 && flag2 !== 0 && flag3 !== 0) {
    $('.wink-pay-testapp-redirect .mit-call').removeClass('disabled');
    document.getElementById('mit-call').style.backgroundColor = '#007bff';
    document.getElementById('mit-call').style.color = '#fff';
  } else {
    $('.wink-pay-testapp-redirect .mit-call').addClass('disabled');
    document.getElementById('mit-call').style.backgroundColor = '#e0e0e0';
    document.getElementById('mit-call').style.color = '#adb0b3';
  }
}
function onChangeMIT(e) {
  if (e.target.name == 'winkPayAPIKey') {
    winkPayAPIKey = e.target.value;
    if (e.target.value != '') {
      document.getElementById('wink-pay-error').innerHTML = '';
    } else {
      document.getElementById('wink-pay-error').innerHTML =
        'Please enter valid Wink Pay API Key.';
    }
    validate_MIT();
  }
  if (e.target.name == 'amount') {
    validate_MIT();
    if (
      e.target.value >= 1 &&
      e.target.value <= Transactions.maxAmount &&
      e.target.value !== ''
    ) {
      document.getElementById('pay-error').innerHTML = '';
    } else {
      if (e.target.value < 0) {
        document.getElementById('pay-error').innerHTML =
          'Negative $ amount is not allowed';
      } else {
        if (e.target.value > Transactions.maxAmount) {
          document.getElementById(
            'pay-error'
          ).innerHTML = `Value greater than $ ${Transactions.maxAmount} is not allowed`;
        } else {
          document.getElementById('pay-error').innerHTML =
            'Please enter a valid $ amount';
        }
      }
    }
  }
  if (e.target.name == 'description') {
    if (e.target.value.length >= 5) {
      document.getElementById('mit-description').style.color = 'black';
      document.getElementById('description-error').innerHTML = '';
    } else {
      document.getElementById('mit-description').style.color = 'red';
      document.getElementById('description-error').innerHTML =
        'Please enter the valid description.';
    }
    validate_MIT();
  }
}

/* call for MIT Purchase */
async function purchaseCall() {
  winkPayAPIKey = document.getElementById('mit-winkPayAPIKey').value;
  if (
    document.getElementById('mit-amount').value !== '' &&
    document.getElementById('mit-winkPayAPIKey').value !== '' &&
    document.getElementById('showLoader').style.display !== 'block'
  ) {
    document.getElementById('showLoader').style.display = 'block';
    document.getElementById('mit-call').style.pointerEvents = 'none';
    $('.wink-pay-testapp-redirect .mit-call').removeClass('btn-primary');
    document.getElementById('mit-call').style.backgroundColor = '#e0e0e0';
    document.getElementById('mit-call').style.color = '#adb0b3';
    const params = {
      winkCardToken: document.getElementById('winkCardTokenMIT-value').value,
      amount: ISOFormat(document.getElementById('mit-amount').value),
      currencyCode: Transactions.currencyCode,
      description: document.getElementById('mit-description').value,
    };
    let response = await postAPi(Transactions.Purchase, params);
    //handle unauthorized api key
    if (response.status == 401) {
      showErrorToast('Please enter a valid Wink Pay API Key and try again!');
      document.getElementById('showLoader').style.display = 'none';
      document.getElementById('mit-call').style.pointerEvents = '';
      document.getElementById('mit-call').style.backgroundColor = '#007bff';
      document.getElementById('mit-call').style.color = '#fff';
      setTimeout(function () {
        response = '';
      }, 5000);
    }
    const result = await response.json();
    if (!response.ok) {
      document.getElementById('showLoader').style.display = 'none';
      document.getElementById('mit-call').style.pointerEvents = '';
      showErrorToast(result.Message);
      $('.wink-pay-testapp-redirect .mit-call').removeClass('disabled');
      $('.wink-pay-testapp-redirect .mit-call').addClass('btn-primary');
      document.getElementById('mit-call').style.backgroundColor = '#007bff';
      document.getElementById('mit-call').style.color = '#fff';
      document.getElementById('pay-error').innerHTML = '';
      setTimeout(function () {
        response = '';
      }, 5000);
    } else {
      document.getElementById('showLoader').style.display = 'none';
      document.getElementById('mit-call').style.pointerEvents = '';
      window.location.href = `${testAppUrl}/ordercompleted.html?transactionId=${result?.transactionId}&amount=${result?.amount}&currencyCode=${result?.currencyCode}`;
    }
  } else {
    if (document.getElementById('showLoader').style.display === '') {
      if ($('#mit-amount').value === '')
        document.getElementById('pay-error').innerHTML = 'Enter a valid amount';
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
  $('#checkout-amount').val('');
}

async function createSessionId() {
  let integrationType;
  let integrationMode;
  document.getElementById('initLoader').style.display = 'block';
  if (localStorage.getItem('SelectedOption') === checkoutMode.subscribe) {
    winkPayAPIKey = getKey();
    integrationType = integrationTypes.MIT;
  } else if (localStorage.getItem('SelectedOption') === checkoutMode.checkout) {
    winkPayAPIKey = getKey();
    integrationType = integrationTypes.checkout;
  } else if (localStorage.getItem('SelectedOption') === checkoutMode.guest) {
    winkPayAPIKey = getKey();
    integrationType = integrationTypes.payment;
  }

  if (localStorage.getItem('mode') === Modes.redirect) {
    integrationMode = integrationModes.redirect;
  } else if (localStorage.getItem('mode') === Modes.iFrameEmbedded) {
    integrationMode = integrationModes.iFrameEmbedded;
  } else if (localStorage.getItem('mode') === Modes.iFrameOverlay) {
    integrationMode = integrationModes.iFrameOverlay;
  }
  const params = {
    paymentId: window.winkEnvValues.paymentId,
    amount: ISOFormat(`${localStorage.getItem('amount')}`),
    currencyCode: Transactions.currencyCode,
    returnUrl: `${testAppUrl}/ordercompleted.html`,
    cancelUrl: `${testAppUrl}/ordercancelled.html`,
    description: 'this is dummy description for payment given by merchant',
    integrationType: integrationType,
    integrationMode: integrationMode,
  };
  if (localStorage.getItem('SelectedOption') === checkoutMode.checkout) {
    // for magento integration
    params.integrationToken = window.winkEnvValues.integrationToken;
  }
  let response = await postAPi(Transactions.Session, params);
  if (response?.status == 200) {
    document.getElementById('initLoader').style.display = 'none';
    let result = await response.json();
    return result.sessionId;
  } else {
    document.getElementById('initLoader').style.display = 'none';
    showErrorToast('Sorry some error occured, please try again!');
  }
}
async function initWinkPayment() {
  const userInfoLocalData = localStorage.getItem('userInfo');
  const merchantType = localStorage.getItem('SelectedOption'); // payment, checkout & subscribe
  let userInfo =
    userInfoLocalData != '' && JSON.parse(localStorage.getItem('userInfo'));
  const params = {
    sessionId: await createSessionId(),
    mode:
      localStorage.getItem('mode') === undefined ||
      localStorage.getItem('mode') === null ||
      localStorage.getItem('mode') === ''
        ? Modes.redirect
        : localStorage.getItem('mode'),
    env: getEnvironment(),
  };
  if (merchantType === checkoutMode.checkout) {
    params.merchantClientId = window.winkEnvValues.clientIdOfCheckoutMerchant;
  }
  if (params.sessionId != undefined) {
    WinkPaymentJS.init(params);
  }
}
function showErrorToast(errorMessage) {
  $(
    '.wink-pay-testapp-redirect .alert .alert-danger .d-flex .align-items-center .toastMessage'
  ).addClass('active-toast');
  document.getElementById('alertError').style.display = 'block !important';
  document.getElementById('alertSection').style.display = 'flex';
  document.getElementById('alertError').style.zIndex = 1;
  document.getElementById('displayErrorToastMessage').style.fontSize = '14px';
  document.getElementById('displayErrorToastMessage').innerHTML += errorMessage;
  setTimeout(function () {
    document.getElementById('alertError').style.display = 'none !important;';
    document.getElementById('alertSection').style.display = 'none';
    document.getElementById('displayErrorToastMessage').innerHTML = '';
  }, 5000);
}
function showSuccessToast(sucessMessage) {
  $(
    '.wink-pay-testapp-redirect .alert .alert-success .d-flex .align-items-center .toastMessage'
  ).addClass('active-toast');
  document.getElementById('alertSuccess').style.display = 'block !important';
  document.getElementById('alertSection').style.display = 'flex';
  document.getElementById('alertSuccess').style.zIndex = 1;
  document.getElementById('displayToastMessage').innerHTML += sucessMessage;
  setTimeout(function () {
    document.getElementById('alertSuccess').style.display = 'none !important;';
    document.getElementById('alertSection').style.display = 'none';
    document.getElementById('displayToastMessage').innerHTML = '';
    document.getElementById('displayErrorToastMessage').innerHTML = '';
  }, 5000);
}

function ISOFormat(amount) {
  return amount * 100;
}

function disableButton() {
  $('#signinButton').addClass('disabled');
  $('.wink-pay-testapp-redirect .checkout').addClass('disabled ');
  $('#checkout').css('background-color', '#e0e0e0');
  $('#checkout').css('color', '#adb0b3');
  $('.wink-pay-testapp-redirect .subscribe').addClass('disabled');
  $('#subscribe').css('background-color', '#e0e0e0');
  $('#subscribe').css('color', '#adb0b3');
  $('.wink-pay-testapp-redirect .guestCheckOut').addClass('disabled ');
  $('#guestCheckOut').css('background-color', '#e0e0e0');
  $('#guestCheckOut').css('color', '#adb0b3');

  $('#checkout-amount').addClass('disabled ');
  $('#amountError').html('');
  $('#checkout-amount').eq(0).attr('tabindex', '-1');
}

// function will be active on select merchant.
function selectMerchant(event) {
  const selectedMerchantIndex = $('#merchantOption')[0];
  localStorage.setItem('merchantIndex', selectedMerchantIndex.selectedIndex);
  localStorage.setItem('merchantOption', $('#merchantOption')[0].value);
  if (event.target.value === 'selectMerchant') {
    disableButton();
  } else {
    const clientId = getClientId();
    if (clientId !== undefined) {
      // Client's configuration
      var config = {
        url: window.winkEnvValues.winkLoginAuthURL,
        realm: window.winkEnvValues.winkLoginRealm,
        clientId: getClientId(),
        onAuthErrorFailure: (error) => console.error(error),
        loggingEnabled: true,
      };
      winkLogin = getWinkLoginClient(config);
      winkLogin.winkInit({
        onFailure: onFailure,
        onSuccess: getUserProfile,
      });
    }
    $('#signinButton').removeClass('disabled');
    $('#checkout-amount').removeClass('disabled ');
    $('#checkout-amount').eq(0).removeAttr('tabindex');
  }
}

function selectMode(e) {
  localStorage.setItem('mode', e.target.value);
  if (e.target.value !== Modes.iFrameEmbedded) {
    document.getElementById(Modes.iFrameEmbedded).innerHTML = '';
  }
}
$('.allow-two-decimals').on('keypress', function (evt) {
  var $amount = $(this);
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
    return false;
  else {
    var len = $amount.val().length;
    var index = $amount.val().indexOf('.');
    if (index > 0 && charCode == 46) {
      return false;
    }
    if (index > 0) {
      var charAfterdot = len + 1 - index;
      if (charAfterdot > 3) {
        return false;
      }
    }
  }
  return $amount;
});

function getClientId() {
  let clientId = '';
  switch (window.winkEnvValues.environment) {
    case 'local':
      clientId = merchant.local[$('#merchantOption')[0].value];
      break;
    case 'qa':
      clientId = merchant.qa[$('#merchantOption')[0].value];
      break;
    case 'develop':
      clientId = merchant.develop[$('#merchantOption')[0].value];
      break;
    case 'staging':
      clientId = merchant.staging[$('#merchantOption')[0].value];
      break;
    case 'sandbox':
      clientId = merchant.sandbox[$('#merchantOption')[0].value];
      break;
    case 'prod':
      clientId = merchant.prod[$('#merchantOption')[0].value];
      break;
  }
  return clientId;
}

function LoginToWink() {
  winkLogin.winkLogin();
}
function logoutFromWink() {
  winkLogin.logout();
}
function checkLoginStatus() {
  const userInfo = localStorage.getItem('userInfo');
  if (Object.keys(userInfo).length > 0) {
    document.getElementById('signinButton').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'flex';
    const merchant = localStorage.getItem('merchantIndex');
    document.getElementById('merchantOption').selectedIndex = merchant;
    $('#merchantOption').addClass('disabled');
  }
}
/*Http Get Call */
async function getAPi(url, accessToken = '') {
  let authorization =
    accessToken == ''
      ? `Basic ${btoa(`${getKey()}:`)}`
      : `Bearer ${accessToken}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    });
    return response;
  } catch (error) {
    document.getElementById('pay-error').innerHTML = error;
  }
}

// Function to get merchant auth key for specific env and selected merchant
function getKey() {
  let key = '';
  switch (window.winkEnvValues.environment) {
    case 'local':
      if (
        merchant.local[localStorage.getItem('merchantOption')] ===
        'stage-winkdemostore'
      ) {
        key = merchant.local.winkDemoStoreMerchantAuthKey;
      } else if (
        merchant.local[localStorage.getItem('merchantOption')] === 'qa-phoenix'
      ) {
        key = merchant.local.phonixGateMerchantAuthKey;
      }
      break;
    case 'qa':
      if (
        merchant.qa[localStorage.getItem('merchantOption')] ===
        'qa-winkdemostore'
      ) {
        key = merchant.qa.winkDemoStoreMerchantAuthKey;
      } else if (
        merchant.qa[localStorage.getItem('merchantOption')] === 'qa-phoenix'
      ) {
        key = merchant.qa.phonixGateMerchantAuthKey;
      }
      break;
    case 'develop':
      if (
        merchant.develop[localStorage.getItem('merchantOption')] ===
        'qa-winkdemostore'
      ) {
        key = merchant.develop.winkDemoStoreMerchantAuthKey;
      } else if (
        merchant.develop[localStorage.getItem('merchantOption')] ===
        'qa-phoenix'
      ) {
        key = merchant.develop.phonixGateMerchantAuthKey;
      }
      break;
    case 'staging':
      if (
        merchant.staging[localStorage.getItem('merchantOption')] ===
        'qa-winkdemostore'
      ) {
        key = merchant.staging.winkDemoStoreMerchantAuthKey;
      } else if (
        merchant.staging[localStorage.getItem('merchantOption')] ===
        'qa-phoenix'
      ) {
        key = merchant.staging.phonixGateMerchantAuthKey;
      }
      break;
    case 'sandbox':
      if (
        merchant.sandbox[localStorage.getItem('merchantOption')] ===
        'stage-winkdemostore'
      ) {
        key = merchant.sandbox.winkDemoStoreMerchantAuthKey;
      } else if (
        merchant.sandbox[localStorage.getItem('merchantOption')] ===
        'stage-phoenix'
      ) {
        key = merchant.sandbox.phonixGateMerchantAuthKey;
      }
      break;
    case 'prod':
      if (
        merchant.prod[localStorage.getItem('merchantOption')] ===
        'qa-winkdemostore'
      ) {
        key = merchant.prod.winkDemoStoreMerchantAuthKey;
      } else if (
        merchant.prod[localStorage.getItem('merchantOption')] === 'qa-phoenix'
      ) {
        key = merchant.prod.phonixGateMerchantAuthKey;
      }
      break;
  }

  return key;
}
function getEnvironment() {
  if (window.winkEnvValues.environment == 'prod') {
    return 'live';
  } else {
    return window.winkEnvValues.environment;
  }
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}
