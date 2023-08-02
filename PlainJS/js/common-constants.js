Transactions = {
  maxAmount: 999999.99,
  currencyCode: "USD",
  Purchase: `${window.winkEnvValues.apiEndPoint}/payment/purchase`,
  Session: `${window.winkEnvValues.apiEndPoint}/payment/session`,
};
LoginUserData = {
  userProfileData: `${window.winkEnvValues.apiEndPoint}/wallet/user`,
};
Modes = {
  redirect: "redirect",
  iFrameOverlay: "overlayiFrame",
  iFrameEmbedded: "embeddediFrame",
};

checkoutMode = {
  checkout: "checkout",
  guest: "guest",
  subscribe: "subscribe",
};
integrationTypes = {
  payment: "Payment",
  checkout: "Checkout",
  MIT: "MIT",
};
integrationModes = {
  redirect: 1,
  iFrameEmbedded: 2,
  iFrameOverlay: 3,
};
mobileDemo = {
  verifyMobileNumber: `${window.winkEnvValues.apiEndPoint}`.replace(
    "/v1",
    "/mobile-demo/verify-mobile?mobile={mobileNumber}"
  ),
  isVerified: `${window.winkEnvValues.apiEndPoint}`.replace(
    "/v1",
    "/mobile-demo/is-verified?sessionId={sessionId}"
  ),
  callMarkVerify: `${window.winkEnvValues.apiEndPoint}`.replace(
    "/v1",
    "/mobile-demo/mark-verified?sessionId={sessionId}"
  ),
};
timeConstants = {
  maxIdleTime: 5,
  millisecondsBeforeExpiry: 60000,
  resetIdleTime: 0,
}

merchant = {
  local: {
    WinkDemoStore: 'qa-winkdemostore',
    PhoenixGate: 'qa-phoenix',
    winkDemoStoreMerchantAuthKey: 'wink_Test_1B8xPauHT4XI3614k3z',
    phonixGateMerchantAuthKey: 'wink_Test_sar763J4OEpMkBDjHpz'
  },
  qa: {
    WinkDemoStore: 'qa-winkdemostore',
    PhoenixGate: 'qa-phoenix',
    winkDemoStoreMerchantAuthKey: 'wink_Test_UZHZjXshiKWichFlQGU',
    phonixGateMerchantAuthKey: 'wink_Test_AP5n9vkGgeR7n2PoN4I'
  },
  develop: {
    WinkDemoStore: 'qa-winkdemostore',
    PhoenixGate: 'qa-phoenix',
    winkDemoStoreMerchantAuthKey: 'wink_Test_1B8xPauHT4XI3614k3z',
    phonixGateMerchantAuthKey: 'wink_Test_sar763J4OEpMkBDjHpz'
  },
  staging: {
    WinkDemoStore: 'qa-winkdemostore',
    PhoenixGate: 'qa-phoenix',
    winkDemoStoreMerchantAuthKey: 'wink_Test_ABtKtVYVulzjSToTloT',
    phonixGateMerchantAuthKey: 'wink_Test_kqwrGl1ibZtNDfxVsxT'
  },
  sandbox: {
    WinkDemoStore: 'stage-winkdemostore',
    PhoenixGate: 'stage-phoenix',
    winkDemoStoreMerchantAuthKey: 'wink_Test_ABtKtVYVulzjSToTloT',
    phonixGateMerchantAuthKey: 'wink_Test_kqwrGl1ibZtNDfxVsxT'
  },
  prod: {
    WinkDemoStore: 'qa-winkdemostore',
    PhoenixGate: 'qa-phoenix',
    winkDemoStoreMerchantAuthKey: '',
    phonixGateMerchantAuthKey: ''
  }
}
