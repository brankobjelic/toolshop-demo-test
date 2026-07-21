import BasePage from './base.page.js';

export class ProfilePage extends BasePage {
    get lastNameInput() { return $('[data-test="last-name"]'); }
    get updateProfileBtn() { return $('[data-test="update-profile-submit"]'); }
    get successAlert() { return $('.alert'); }

    async open() {
        await super.open('/account/profile');
    }

    async updateLastName(newLastName) {
        await this.lastNameInput.waitForDisplayed({ timeout: 5000 });
        await this.lastNameInput.click();
        await this.lastNameInput.clearValue();
        await this.lastNameInput.setValue(newLastName);
        await browser.keys(['Tab']);
        await browser.pause(300);
        await this.updateProfileBtn.click();
    }
}
