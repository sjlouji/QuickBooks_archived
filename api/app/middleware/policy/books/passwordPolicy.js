
const passwordPolicy = data => {
    const { password, first_name, last_name, email } = data
    var passwordUpperCaseRegex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLowerCaseRegex = "abcdefghijklmnopqrstuvwxyz";
    var passwordNumberRegex = "0123456789";
    var passwordSpecialRegex = "!@#$%^&*?_~";

    var nUpperCount = countContain(password, passwordUpperCaseRegex);
    var nLowerCount = countContain(password, passwordLowerCaseRegex);
    var nNumberCount = countContain(password, passwordNumberRegex);
    var nSpecialCount = countContain(password, passwordSpecialRegex);
    var validateAccrossName = isValidPassword({first_name, last_name, password});
    var validateAccrossEmail = isValidPasswordAccrossEmail({email, password});

    if(password.length < 6) {
       return {error: "Password must contain atleast 6 characters"}
    }
    if(nUpperCount === 0 ) {
        return {error: 'Password must have atleast one uppercase letter'}
    }
    if(nLowerCount === 0) {
        return {error: 'Password must have atleast one lowercase letter'}
    }
    if(nNumberCount === 0) {
        return {error: 'Password must have atleast one number letter'}
    }
    if(nSpecialCount === 0) {
        return {error: 'Password must have atleast one special case letter'}
    }
    if(!validateAccrossName) {
        return {error: 'Password can not contain first name and last name'}
    }
    if(!validateAccrossEmail) {
        return {error: 'Password can not contain name in Email'}
    }
    return null;
}

function isValidPasswordAccrossEmail(data) {
    const { email, password } = data
    const emailName = email.split('@')
    if(password.includes(emailName[0])) {
        return false
    }
    return true;
}

function isValidPassword(data) {
    const { first_name, last_name, password } = data
    if(password.includes(first_name)) {
        return false;
    }
    if(password.includes(last_name)) {
        return false;
    }
    return true;
}

function countContain(strPassword, strCheck)
{ 
    var nCount = 0;
    for (var i = 0; i < strPassword.length; i++) 
    {
        if (strCheck.indexOf(strPassword.charAt(i)) > -1) 
        { 
                nCount++;
        } 
    } 
    return nCount; 
} 

module.exports.passwordPolicy = passwordPolicy
