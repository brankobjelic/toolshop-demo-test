import BasePage from './base.page.js';

export class CheckoutPage extends BasePage {

    get productQuantityInput() { return $('[data-test="product-quantity"]'); }
    get proceedToCheckoutBtn() { return $('[data-test="proceed-1"]'); }

    get emailInput() { return $('[data-test="email"]'); }
    get passwordInput() { return $('[data-test="password"]'); }
    get loginSubmitBtn() { return $('[data-test="login-submit"]'); }
    get proceedAddressBtn() { return $('[data-test="proceed-2"]'); }

    get countrySelect() { return $('[data-test="country"]'); }
    get postalCodeInput() { return $('[data-test="postal_code"]'); }
    get houseNumberInput() { return $('[data-test="house_number"]'); }
    get proceedPaymentBtn() { return $('[data-test="proceed-3"]'); }

    get paymentMethodSelect() { return $('[data-test="payment-method"]'); }
    get accountNameInput() { return $('[data-test="account-name"]'); }
    get accountNumberInput() { return $('[data-test="account-number"]'); }
    get finishBtn() { return $('[data-test="finish"]'); }
    
    get paymentSuccessMessage() { return $('[data-test="payment-success"]'); }

    async open() {
        await super.open('/checkout');
    }

    async proceedToSignIn() {
        await this.proceedToCheckoutBtn.waitForDisplayed({ timeout: 5000 });
        await this.proceedToCheckoutBtn.click();
    }

    async signIn(email, password) {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.loginSubmitBtn.click();
    }

    async proceedToAddress() {
        await this.proceedAddressBtn.waitForClickable({ timeout: 5000 });
        await this.proceedAddressBtn.click();
    }

    async fillAddressAndProceed(countryValue, postalCode, houseNumber) {
        await this.countrySelect.waitForDisplayed({ timeout: 5000 });
        await this.countrySelect.selectByAttribute('value', countryValue);
        
        await this.postalCodeInput.waitForDisplayed({ timeout: 5000 });
        await this.postalCodeInput.click();
        await browser.keys(['Control', 'a']);
        await browser.keys(['Backspace']);
        await browser.keys(postalCode);
        await browser.keys(['Tab']);

        await this.houseNumberInput.waitForDisplayed({ timeout: 5000 });
        await browser.waitUntil(async () => {
            const currentValue = await this.houseNumberInput.getValue();
            return currentValue.trim() !== '';
        }, { timeout: 5000 });

        await this.houseNumberInput.clearValue();
        await this.houseNumberInput.setValue(houseNumber);
        await browser.keys(['Tab']);

        if (await this.proceedPaymentBtn.isExisting()) {
            await this.proceedPaymentBtn.waitForClickable({ timeout: 5000 });
            await this.proceedPaymentBtn.click();
        }
    }

    async fillPaymentAndFinish(paymentMethodValue, accountName, accountNumber) {
        await this.paymentMethodSelect.waitForDisplayed({ timeout: 5000 });
        await this.paymentMethodSelect.selectByAttribute('value', paymentMethodValue);
        await this.accountNameInput.setValue(accountName);
        await this.accountNumberInput.setValue(accountNumber);
        
        await this.finishBtn.waitForClickable({ timeout: 5000 });
        await this.finishBtn.click();
    }
}
