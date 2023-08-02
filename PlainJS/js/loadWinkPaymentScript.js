let WinkPaymentJS;
const loadScript = (async = true, type = 'text/javascript') => {
  return new Promise((resolve, reject) => {
    try {
      const scriptEle = document.createElement('script');
      scriptEle.type = type;
      scriptEle.async = async;
      if (window.winkEnvValues.environment != 'local') {
        scriptEle.integrity = window.winkEnvValues.integrityHash;
      }
      scriptEle.crossOrigin = 'anonymous';
      scriptEle.src = window.winkEnvValues.winkPaymentSdkUrl;
      scriptEle.addEventListener('load', (ev) => {
        resolve({ status: true });
        WinkPaymentJS = window.WinkPaymentJS;
      });

      scriptEle.addEventListener('error', (ev) => {
        reject({
          status: false,
          message: `Failed to load the script wink payment script`,
        });
      });
      document.head.appendChild(scriptEle);
    } catch (error) {
      reject(error);
    }
  });
};
loadScript()
  .then((data) => {
    const queryParam = new URLSearchParams(window.location.search);
    if (
      queryParam.get('transactionId') !== null &&
      queryParam.get('transactionId') !== undefined
    ) {
      WinkPaymentJS.paymentDoneHandler();
    }
  })
  .catch((err) => {
    console.error(err);
  });
