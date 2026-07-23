import BasePage from './base.page.js';

export class RegisterPage extends BasePage {
    get firstNameInput() { return $('[data-test="first-name"]'); }
    get lastNameInput() { return $('[data-test="last-name"]'); }
    get dobInput() { return $('[data-test="dob"]'); }
    get streetInput() { return $('[data-test="street"]'); }
    get houseNumberInput() { return $('[data-test="house_number"]'); }
    get postalCodeInput() { return $('[data-test="postal_code"]'); }
    get cityInput() { return $('[data-test="city"]'); }
    get stateInput() { return $('[data-test="state"]'); }
    get countrySelect() { return $('[data-test="country"]'); }
    get phoneInput() { return $('[data-test="phone"]'); }
    get emailInput() { return $('[data-test="email"]'); }
    get passwordInput() { return $('[data-test="password"]'); }
    get registerSubmitBtn() { return $('[data-test="register-submit"]'); }

    async register(user) {
        await this.firstNameInput.waitForDisplayed({ timeout: 5000 });
        await this.firstNameInput.setValue(user.firstName);
        await this.lastNameInput.setValue(user.lastName);
        await this.dobInput.setValue(user.dob);
        await this.streetInput.setValue(user.street);
        await this.houseNumberInput.setValue(user.houseNumber);
        await this.postalCodeInput.setValue(user.postalCode);
        await this.cityInput.setValue(user.city);
        await this.stateInput.setValue(user.state);
        await this.countrySelect.selectByAttribute('value', user.countryCode);
        await this.phoneInput.setValue(user.phone);
        await this.emailInput.setValue(user.email);
        await this.passwordInput.setValue(user.password);
        await this.registerSubmitBtn.scrollIntoView();
        await this.registerSubmitBtn.waitForClickable({ timeout: 5000 });
        await this.registerSubmitBtn.click();
    }
}
