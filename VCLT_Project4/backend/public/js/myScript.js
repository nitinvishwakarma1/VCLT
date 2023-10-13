const form = document.getElementById("myForm");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const cpassword = document.getElementById("cpassword");
const birthyear = document.getElementById("birthyear");

form.addEventListener("submit", (e) => {
    let valid = true;

    if (!validateUsername(username.value)) {
        valid = false;
    }

    if (!validateEmail(email.value)) {
        valid = false;
    }

    if (!validatePassword(password.value)) {
        valid = false;
    }

    if (!validateConfirmPassword(password.value, cpassword.value)) {
        valid = false;
    }

    if (!validateBirthYear(birthyear.value)) {
        valid = false;
    }

    if (!valid) {
        e.preventDefault(); // Prevent form submission if validation fails
        alert("Please fix the validation errors before submitting.");
    }
    else {
        swal("Good job!", "product Add successfully!", "success");
    }
});

function validateUsername(username) {
    const namePattern = /^[A-Za-z\s]+$/;
    const usernamewarning = document.getElementById("usernamewarning");

    if (username.trim === "" || !namePattern.test(username)) {
        usernamewarning.textContent = "*Username is not valid.";
        usernamewarning.style.color = "red";
        return false;
    } else {
        usernamewarning.textContent = "";
        return true;
    }
}

function validateEmail(email) {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const emailwarning = document.getElementById("emailwarning");

    if (!emailPattern.test(email)) {
        emailwarning.textContent = "*Email address is not valid.";
        emailwarning.style.color = "red";
        return false;
    } else {
        emailwarning.textContent = "";
        return true;
    }
}

function validatePassword(password) {
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const passwordwarning = document.getElementById("passwordwarning");

    if (!passwordPattern.test(password)) {
        passwordwarning.textContent = "Password must be at least 8 ";
        passwordwarning.style.color = "red";
        return false;
    } else {
        passwordwarning.textContent = "";
        return true;
    }
}

function validateConfirmPassword(password, cpassword) {
    const cpasswordwarning = document.getElementById("cpasswordwarning");

    if (password !== cpassword) {
        cpasswordwarning.textContent = "Passwords do not match.";
        cpasswordwarning.style.color = "red";
        return false;
    } else {
        cpasswordwarning.textContent = "";
        return true;
    }
}

function validateBirthYear(birthyear) {
    const yearPattern = /^(19|20)\d{2}$/;
    const birthyearwarning = document.getElementById("birthyearwarning");

    if (!yearPattern.test(birthyear)) {
        birthyearwarning.textContent = "Please enter a valid four-digit birth year (e.g., 1985).";
        birthyearwarning.style.color = "red";
        return false;
    } else {
        birthyearwarning.textContent = "";
        return true;
    }
}


