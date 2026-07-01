import { expect } from 'chai';

describe('Authentication & Profile Management', () => {

    let testEmail = ''; 
    const testPassword = 'XyZ_792!@#aB_Testing';

    it('Successful user registration with valid details', async () => {
        await browser.url('/');
        
        await $('[data-test="nav-sign-in"]').click();
        await $('[data-test="register-link"]').click();
        
        await $('[data-test="first-name"]').setValue('Test');
        await $('[data-test="last-name"]').setValue('User');
        await $('[data-test="dob"]').setValue('1990-01-01');
        await $('[data-test="street"]').setValue('Main Street');
        await $('[data-test="house_number"]').setValue('123'); 
        await $('[data-test="postal_code"]').setValue('11000'); 
        await $('[data-test="city"]').setValue('Belgrade');
        await $('[data-test="state"]').setValue('Serbia');
        await $('[data-test="country"]').selectByAttribute('value', 'RS');
        await $('[data-test="phone"]').setValue('123456789');
        
        testEmail = `testuser_${Date.now()}@example.com`;
        
        await $('[data-test="email"]').setValue(testEmail);
        await $('[data-test="password"]').setValue(testPassword);     
        await $('[data-test="register-submit"]').click();
        
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('/auth/login');
        }, { timeout: 5000 });
        
        const emailInput = await $('[data-test="email"]');
        await emailInput.waitForDisplayed({ timeout: 3000 }); 
        expect(await emailInput.isDisplayed()).to.be.true;
    });

    it('Successful profile update', async () => {
        await browser.url('/auth/login');
        
        await $('[data-test="email"]').setValue(testEmail);
        await $('[data-test="password"]').setValue(testPassword);
        await $('[data-test="login-submit"]').click();
        
        await $('[data-test="nav-menu"]').click();
        await $('[data-test="nav-profile"]').click();
        
        const currentLastNameInput = await $('[data-test="last-name"]');
        
        await browser.waitUntil(async () => {
            return (await currentLastNameInput.getValue()) !== '';
        }, { timeout: 5000 });
        
        const currentLastName = await currentLastNameInput.getValue();
        const updatedLastName = currentLastName === 'User' ? 'Updated' : 'User';
        
        await currentLastNameInput.click();
        await currentLastNameInput.clearValue();
        await currentLastNameInput.setValue(updatedLastName);
        await browser.keys(['Tab']);
        await browser.pause(300);
        
        await $('[data-test="update-profile-submit"]').click(); 
        
        const successAlert = await $('.alert');
        await successAlert.waitForDisplayed({ timeout: 5000 });
        
        await browser.refresh();
        
        const displayedLastNameInput = await $('[data-test="last-name"]');
        await browser.waitUntil(async () => {
            return (await displayedLastNameInput.getValue()) !== '';
        }, { timeout: 5000 });
        
        const displayedLastName = await displayedLastNameInput.getValue();
        expect(displayedLastName).to.equal(updatedLastName);

        await $('[data-test="nav-menu"]').click();
        await $('[data-test="nav-sign-out"]').click();
        
        const signInNav = await $('[data-test="nav-sign-in"]');
        await signInNav.waitForDisplayed({ timeout: 5000 });
    });


    it('Scenario: Successful end-to-end checkout as a returning user', async () => {
        await browser.url('/');
        
        await $('[data-test^="product-"]').waitForDisplayed({ timeout: 7000 });
        
        const productCards = await $$('[data-test^="product-"]');
        let targetProductImage = null;

        for (const card of productCards) {
            const cardText = await card.getText();
            if (!cardText.includes('Out of stock')) {
                targetProductImage = await card.$('img');
                break; 
            }
        }

        expect(targetProductImage).to.not.be.null;

        await targetProductImage.scrollIntoView();
        await targetProductImage.waitForClickable({ timeout: 5000 });
        await targetProductImage.click();
        
        const addToCartBtn = await $('[data-test="add-to-cart"]');
        await addToCartBtn.waitForDisplayed({ timeout: 5000 });
        await addToCartBtn.waitForClickable({ timeout: 5000 });
        await addToCartBtn.click();
        
        const cartBadge = await $('[data-test="cart-quantity"]');
        await browser.waitUntil(async () => {
            const count = await cartBadge.getText();
            return count.trim() === '1';
        }, { timeout: 6000, timeoutMsg: 'Item framework synchronization failed.' });
        
        await $('[data-test="nav-cart"]').click();
        
        const proceedToCheckoutBtn = await $('[data-test="proceed-1"]');
        await proceedToCheckoutBtn.waitForDisplayed({ timeout: 5000 });
        await proceedToCheckoutBtn.click();

        const emailInput = await $('[data-test="email"]');
        await emailInput.waitForDisplayed({ timeout: 5000 });
        await emailInput.setValue(testEmail);
        await $('[data-test="password"]').setValue(testPassword);
        await $('[data-test="login-submit"]').click();

        const proceedAddressBtn = await $('[data-test="proceed-2"]');
        await proceedAddressBtn.waitForClickable({ timeout: 5000 });
        await proceedAddressBtn.click();

        const countryDropdown = await $('[data-test="country"]');
        await countryDropdown.waitForDisplayed({ timeout: 5000 });
        await countryDropdown.selectByAttribute('value', 'RS'); 
        const postalCodeInput = await $('[data-test="postal_code"]');
        await postalCodeInput.waitForDisplayed({ timeout: 5000 });
        
        await postalCodeInput.click();
        await browser.keys(['Control', 'a']); // Use 'Command' if you are on a Mac
        await browser.keys(['Backspace']);
        
        await browser.keys('21000');
        await browser.keys(['Tab']);
        const houseNumberInput = await $('[data-test="house_number"]');
        await houseNumberInput.waitForDisplayed({ timeout: 5000 });
        await browser.waitUntil(async () => {
            const currentValue = await houseNumberInput.getValue();
            return currentValue.trim() !== '';
        }, { 
            timeout: 5000, 
            timeoutMsg: 'Application background address data failed to load in time.' 
        });

        await houseNumberInput.clearValue();
        await houseNumberInput.setValue('55');
        await browser.keys(['Tab']);

        const paymentMethodDropdown = await $('[data-test="payment-method"]');
        await paymentMethodDropdown.waitForDisplayed({ timeout: 5000 });
        await paymentMethodDropdown.selectByAttribute('value', '3: Credit Card');

        await $('[data-test="account-name"]').setValue('Automation Tester');
        await $('[data-test="account-number"]').setValue('1111222233334444');
        
        const finishBtn = await $('[data-test="finish"]');
        await finishBtn.waitForClickable({ timeout: 5000 });
        await finishBtn.click();

        const confirmationMessage = await $('[data-test="payment-success"]');
        await confirmationMessage.waitForDisplayed({ timeout: 10000 });
        
        const confirmationText = await confirmationMessage.getText();

        expect(confirmationText).to.include('Payment successful');
    });
});