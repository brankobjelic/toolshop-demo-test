import { expect } from 'chai';
import { page } from '../po/index.js';

describe('Authentication & Profile Management', () => {

    let testEmail = ''; 
    const testPassword = 'XyZ_792!@#aB_Testing';

    it('Successful user registration with valid details', async () => {
        const homePage = page('home');
        const registerPage = page('register');
        const loginPage = page('login');

        await homePage.open();
        await homePage.header.openSignIn();
        
        await loginPage.registerLink.waitForClickable({ timeout: 5000 });
        await loginPage.registerLink.click();
        
        testEmail = `testuser_${Date.now()}@example.com`;
        
        await registerPage.register({
            firstName: 'Test',
            lastName: 'User',
            dob: '1990-01-01',
            street: 'Main Street',
            houseNumber: '123',
            postalCode: '11000',
            city: 'Belgrade',
            state: 'Serbia',
            countryCode: 'RS',
            phone: '123456789',
            email: testEmail,
            password: testPassword
        });
        
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('/auth/login');
        }, { timeout: 15000 });
        
        await loginPage.emailInput.waitForDisplayed({ timeout: 3000 }); 
        expect(await loginPage.emailInput.isDisplayed()).to.be.true;
    });

    it('Successful profile update', async () => {
        const loginPage = page('login');
        const profilePage = page('profile');
        const homePage = page('home'); // for header

        await loginPage.open();
        await loginPage.login(testEmail, testPassword);
        
        await homePage.header.navMenu.waitForClickable({ timeout: 5000 });
        await homePage.header.openProfile();
        
        await browser.waitUntil(async () => {
            return (await profilePage.lastNameInput.getValue()) !== '';
        }, { timeout: 5000 });
        
        const currentLastName = await profilePage.lastNameInput.getValue();
        const updatedLastName = currentLastName === 'User' ? 'Updated' : 'User';
        
        await profilePage.updateLastName(updatedLastName);
        
        await profilePage.successAlert.waitForDisplayed({ timeout: 5000 });
        
        await browser.refresh();
        
        await browser.waitUntil(async () => {
            return (await profilePage.lastNameInput.getValue()) !== '';
        }, { timeout: 5000 });
        
        const displayedLastName = await profilePage.lastNameInput.getValue();
        expect(displayedLastName).to.equal(updatedLastName);

        await homePage.header.signOut();
        
        await homePage.header.navSignIn.waitForDisplayed({ timeout: 5000 });
    });
});
