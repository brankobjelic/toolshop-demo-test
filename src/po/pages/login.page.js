import BasePage from './base.page.js';

export class LoginPage extends BasePage {
    get emailInput() { return $('[data-test="email"]'); }
    get passwordInput() { return $('[data-test="password"]'); }
    get loginSubmitBtn() { return $('[data-test="login-submit"]'); }
    get registerLink() { return $('[data-test="register-link"]'); }

    async open() {
        await super.open('/auth/login');
    }

    async login(email, password) {
        await this.emailInput.waitForDisplayed({ timeout: 5000 });
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.loginSubmitBtn.click();
    }
}
