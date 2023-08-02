var idleTime = timeConstants.resetIdleTime;
window.addEventListener("load", (event) => {
  $("#initLoader").show();
  // Initialization of wink login with callback functions
  winkLogin.initWinkClient({
    onFailure: onFailure,
    getUserProfile: getUserProfile,
  });
  // Initialization of login button onclick function
});
function LoginToWink() {
  winkLogin.winkLogin();
}

async function getAPi(url, accessToken = "") {
  let authorization =
    accessToken == ""
      ? `Basic ${btoa(`${winkPayAPIKey}:`)}`
      : `Bearer ${accessToken}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });
    return response;
  } catch (error) {
    document.getElementById("pay-error").innerHTML = error;
  }
}
function onFailure(error) {
  console.log("onFailure");
  console.log(error);
  $("#initLoader").hide();
  $("#signinButton").removeClass("disabled");
}
async function getUserProfile(profile) {
  if (Object.keys(profile).length > 0) {
    $("#initLoader").show();
    let userResp = await getAPi(LoginUserData.userProfileData, winkLogin.token);
    let result;
    if (userResp?.status == 200) {
      $("#initLoader").hide();
      result = await userResp.json();
      const userInfo = {
        id: winkLogin.idToken,
        username: profile.username,
        name: result.firstName,
        surname: result.lastName,
        phone: result.contactNo,
        email: result.email,
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
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("tokenExpiry", userInfo.id_token_expire_date)
      $("#signinButton").hide();
      $("#userProfile").html("Hi, " + userInfo.name + " " + userInfo.surname);
      callMarkVerify(userInfo);
    } else {
      $("#initLoader").hide();
      showErrorToast("Sorry some error occured, please try again!");
    }
    $("#initLoader").hide();
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
  }, 100000);
}

const queryParam = new URLSearchParams(window.location.search);
const sessionId = queryParam.get("sessionId");

async function callMarkVerify(userInfo) {
  $("#initLoader").show();
  let authorization = `Bearer ${userInfo.access_token}`;
  try {
    const response = await fetch(
      mobileDemo.callMarkVerify.replace("{sessionId}", sessionId),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      }
    );
    $("#initLoader").hide();
    if (response.status == 200) {
      const result = await response.json();
      if (result?.verificationStatus == "Pending") {
        showErrorToast("Your mobile number verification is Pending!");
      } else if (result?.verificationStatus == "Failed") {
        showErrorToast("Your mobile number is not verified!");
      } else if (result?.verificationStatus == "Verified") {
        showSuccessToast("Your mobile number is now verified!")
      }
    }
    return response;
  } catch (error) {
    showErrorToast("Some error occured, please try again.");
  }
  $("#initLoader").hide();
}
$(document).ready(function () {
  var idleInterval = setInterval(timerIncrement, timeConstants.millisecondsBeforeExpiry);
  var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(function (name) {
    document.addEventListener(name, resetTimer, true);
  });
});
function resetTimer() {
  idleTime = timeConstants.resetIdleTime;
  var curtime = new Date().getTime();
  var exptime = new Date(localStorage.getItem('tokenExpiry')).getTime()
  if (winkLogin?.authenticated && (exptime - timeConstants.millisecondsBeforeExpiry) < curtime) {
    winkLogin.updateToken(timeConstants.resetIdleTime).then(function (refreshed) {
      if (refreshed) {
        //console.log(refreshed)
      }
    });
  }
}
function timerIncrement() {
  if (winkLogin?.authenticated) {
    idleTime++;
    if (idleTime >= timeConstants.maxIdleTime) {
      showErrorToast("You have been logged out.");
      winkLogin.logout();
      localStorage.removeItem('userInfo');
    }
  }
}