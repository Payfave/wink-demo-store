(function ($, $w) {
  idleTime = 0;

  //Increment the idle time counter every second.
  var idleInterval = setInterval(timerIncrement, 1000);

  function timerIncrement() {
    idleTime++;    
    const curTime = new Date();
    const expTime = new Date(winkLogin.tokenParsed?.exp * 1000);
    const refreshTokenParsedTime = new Date(winkLogin.refreshTokenParsed?.exp * 1000);
   // console.log('time in mili', idleTime * 1000)
    //console.log('refreshTokenParsedTime', refreshTokenParsedTime)
    if (expTime < curTime && (idleTime * 1000) < refreshTokenParsedTime) {
        refreshToken();
    }
    if (idleTime >= 20) {
      refreshToken();
    }
  }

  //Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });

  function doPreload() {
    console.log("logout called");
  }

})(window.jQuery, window.jQuery(window));
