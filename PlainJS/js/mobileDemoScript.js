let mobileNumber;
let phoneError;
let sessionId;
function formatPhoneNumber(phoneNumberString) {
    const match = this.checkIsMatch(phoneNumberString);
    $("#verifyButton").attr("disabled", "disabled");
    $("#error").html("Please enter a valid mobile number!");
    phoneError = 0;
    $("#phone").css("color", "red");
    if (match) {
        phoneError = 1;
        $("#verifyButton").removeAttr("disabled");
        $("#error").html("");
        $("#phone").css("color", "black");
        const intlCode = match[1] ? "+1 " : "";
        return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return phoneNumberString;
}
function checkIsMatch(phoneNumberString) {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    return cleaned.match(/^(1)?(\d{3})(\d{3})(\d{4})$/);
}
function handleChange(e) {
    e.target.value = formatPhoneNumber(e.target.value);
    mobileNumber = e.target.value;
}
async function onVerify() {
    $('#initLoader').show();
    const mobile = mobileNumber.replace(/\D/g, '');
    let response;
    if (phoneError == 1) {
        response = await fetch(mobileDemo.verifyMobileNumber.replace('{mobileNumber}', mobile), {
            method: 'POST',
        });
    } else {
        $('#error').html('Please enter a valid mobile number!');
    }
    if (response.status == 200) {
        $('#verifyButton').attr('disabled', 'disabled')
        $('#initLoader').hide();
        const result = await response.json();
        sessionId = await result?.sessionId;
        showSuccessToast('A link in the SMS has been sent to your mobile number, please click on it to continue.');
        callIsVerifiedAPI();
    } else {
        showErrorToast('Some error occurred, please retry.')
    }
    $('#initLoader').hide();
}
async function callIsVerifiedAPI() {
    $("#initLoader").show();
    try {
        const response = await fetch(
            mobileDemo.isVerified.replace("{sessionId}", sessionId),
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status == 200) {
            const result = await response.json();
            $("#initLoader").hide();
            $("#verificationStatus").show();
            if (result?.verificationStatus == "Pending") {
                $("#pending").show();
                $("#verified").hide();
                $("#failed").hide();
                setTimeout(() => {
                    callIsVerifiedAPI();
                }, 10000);
            } else if (result?.verificationStatus == "Failed") {
                $("#failed").show();
                $("#pending").hide();
                $("#verified").hide();
            } else if (result?.verificationStatus == "Verified") {
                $("#verified").show();
                $("#failed").hide();
                $("#pending").hide();
            }
        } else {
            showErrorToast("Some error occurred, please retry.");
        }
        $("#initLoader").hide();
    } catch (error) {
        console.log(error);
    }
    $("#initLoader").hide();
}
