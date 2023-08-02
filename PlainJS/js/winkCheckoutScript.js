//functions for guest checkout
let fullnameFlag = 0;
let addressFlag = 0;
let cityFlag = 0;
let stateFlag = 0;
let zipFlag = 0;
let emailFlag = 0;
let phoneFlag = 0;
$('#user-amount').text(`$${localStorage.getItem('amount')}`);
function onContactFieldChange(e) {
  let emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (e.target.name === 'phone') {
    e.target.value = formatPhoneNumber(e.target.value);
  } else if (e.target.name == 'email') {
    if (e.target.value.length <= 5 || !emailValidation.test(e.target.value)) {
      $('#email').css({ color: 'red' });
      emailFlag = 0;
    } else {
      $('#email').css({ color: 'black' });
      emailFlag = 1;
    }
  }
  disableContactContinue();
}
function disableContactContinue() {
  if (emailFlag == 1 && phoneFlag == 1) {
    $('#contactContinueButton').css({
      'pointer-events': 'all',
      backgroundColor: '#1AA7B0',
    });
  } else {
    $('#contactContinueButton').css({
      'pointer-events': 'none',
      backgroundColor: 'grey',
    });
  }
}
//On continue  after felling contact details
function onContactContinue() {
  var userContactInfo = {
    WinkID: $('#WinkID').val(),
    PhoneNo: $('#phone').val(),
    Email: $('#email').val(),
  };
  localStorage.setItem('UserContactInfo', JSON.stringify(userContactInfo));
  emailFlag = 0;
  phoneFlag = 0;
  $('#user-contact-no').text($('#phone').val());
  $('#user-contact-email').text($('#email').val());
  $('#contact-screen').css('display', 'none');
  $('#footer-shipping').css('display', 'none');
  $('#Shipping-screen').css('display', 'block');
}

function formatPhoneNumber(phoneNumberString) {
  const match = this.checkIsMatch(phoneNumberString);
  phoneFlag = 0;
  $('#phone').css('color', 'red');
  if (match) {
    phoneFlag = 1;
    $('#phone').css('color', 'black');
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return phoneNumberString;
}
function checkIsMatch(phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  return cleaned.match(/^(1)?(\d{3})(\d{3})(\d{4})$/);
}
function disableShippingContinue() {
  if (
    fullnameFlag == 1 &&
    addressFlag == 1 &&
    cityFlag == 1 &&
    stateFlag == 1 &&
    zipFlag == 1 &&
    phoneFlag == 1
  ) {
    $('#shippingContinueButton').css({
      'pointer-events': 'all',
      backgroundColor: '#1AA7B0',
    });
  } else {
    $('#shippingContinueButton').css({
      'pointer-events': 'none',
      backgroundColor: 'grey',
    });
  }
}
function onShippingChange(e) {
  let letters = /^[a-zA-Z\s]*$/;
  if (e.target.name === 'fullName') {
    if (e.target.value.length <= 3 || e.target.value.match(letters) === null) {
      fullnameFlag = 0;
      $('#fullname').css({
        color: 'red',
      });
    } else {
      fullnameFlag = 1;
      $('#fullname').css({
        color: 'black',
      });
    }
  } else if (e.target.name === 'address') {
    let addressValidation = /^[a-zA-Z0-9_@&.*()":;#\s\,\'\/-]*$/;
    if (
      e.target.value.length <= 3 ||
      e.target.value.match(addressValidation) === null
    ) {
      addressFlag = 0;
      $('#address').css({ color: 'red' });
    } else {
      addressFlag = 1;
      address;
      $('#address').css({ color: 'black' });
    }
  } else if (e.target.name === 'city') {
    if (e.target.value.length <= 3 || e.target.value.match(letters) === null) {
      cityFlag = 0;
      $('#city').css({ color: 'red' });
    } else {
      cityFlag = 1;
      $('#city').css({ color: 'black' });
    }
  } else if (e.target.name === 'state') {
    $('#state').css({
      textTransform: 'uppercase',
    });
    if (e.target.value.length <= 1 || e.target.value.match(letters) === null) {
      stateFlag = 0;
      $('#state').css({ color: 'red' });
    } else {
      stateFlag = 1;
      $('#state').css({ color: 'black' });
    }
  } else if (e.target.name === 'zip') {
    let numberExp = /^\d*$/;
    if (
      e.target.value.length !== 5 ||
      e.target.value.match(numberExp) === null
    ) {
      zipFlag = 0;
      $('#zip').css({ color: 'red' });
    } else {
      zipFlag = 1;
      $('#zip').css({ color: 'black' });
    }
  } else if (e.target.name === 'phone') {
    e.target.value = formatPhoneNumber(e.target.value);
  }
  disableShippingContinue();
}

function onShippingContinue() {
  var userShippingInfo = {
    fullName: $('#fullname').val(),
    address: $('#address').val(),
    city: $('#city').val(),
    state: $('#state').val(),
    zipCode: $('#zip').val(),
    phone: $('#phone').val(),
  };
  localStorage.setItem('userShippingInfo', userShippingInfo);
  const userinfo = localStorage.getItem('UserContactInfo');
  const parseUserInfo = JSON.parse(userinfo);
  //contact info
  $('#user-finalContact-no').text(parseUserInfo.PhoneNo);
  $('#user-finalContact-email').text(parseUserInfo.Email);
  //shipping info
  $('#user-shipping-fullname').text(userShippingInfo.fullName);
  $('#user-shipping-address').text(userShippingInfo.address);
  $('#user-shipping-city').text(
    `${userShippingInfo.city},${userShippingInfo.state},${userShippingInfo.zipCode}`
  );
  //enable payment option
  $('#deliveryContinueButton').css({
    pointerEvents: 'all',
    backgroundColor: '#1AA7B0',
  });
  $('#footer-Delivery,#Shipping-screen').css({ display: 'none' });
  $('#delivery-screen').css({ display: 'block' });
  $('#deliveryContinueButton,#footer-container').css({ display: 'block' });
}

async function initWinkPayment() {
  const userInfoLocalData = localStorage.getItem('userInfo');
  let userInfo =
    userInfoLocalData != '' && JSON.parse(localStorage.getItem('userInfo'));
  const params = {
    sessionId: localStorage.getItem('sessionID'),
    selectedOption: `${localStorage.getItem('SelectedOption')}`,
    mode:
      localStorage.getItem('mode') === undefined
        ? Modes.redirect
        : localStorage.getItem('mode'),
    merchantClientId: (`${localStorage.getItem('SelectedOption')}` === checkoutMode.checkout)
      ? window.winkEnvValues.clientIdOfCheckoutMerchant
      : window.winkEnvValues.clientIdOfPaymentMerchant,
    env: window.winkEnvValues.environment,
  };
  if (localStorage.getItem('SelectedOption') === checkoutMode.guest) {
    params.guestCheckout = true;
  }
  if (params.sessionId != undefined) {
    WinkPaymentJS.init(params);
  }
}
function onDeliveryContinue() {
  initWinkPayment();
  localStorage.getItem('mode') == Modes.iFrameEmbedded
    ? ($('#iframe-container').css({ display: 'block' }),
      $('#deliveryContinueButton,#footer-container').css({ display: 'none' }))
    : $('#overlayiFrame').css({ display: 'block' });
}
function handleBackContactClick() {
  $('#Shipping-screen,#delivery-screen,#iframe-container').css({
    display: 'none',
  });
  $('#contact-screen,#footer-container').css({ display: 'block' });
}
function handleBackShippingClick() {
  $('#contact-screen,#delivery-screen,#iframe-container').css({
    display: 'none',
  });
  $('#Shipping-screen,#footer-container').css({ display: 'block' });
}
