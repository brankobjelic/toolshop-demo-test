import { expect } from 'chai';
import { page } from '../po/index.js';

describe('Checkout Process', () => {

    const testEmail = 'customer@practicesoftwaretesting.com'; 
    const testPassword = 'welcome01';

    it('Scenario: Successful end-to-end checkout as a returning user', async () => {
        const homePage = page('home');
        const productDetailsPage = page('productDetails');
        const checkoutPage = page('checkout');

        await homePage.open();
        
        await homePage.selectFirstAvailableProduct();
        
        await productDetailsPage.addToCart();
        
        await browser.waitUntil(async () => {
            const badge = await homePage.header.cartQuantityBadge;
            if (!(await badge.isExisting())) return false;
            const count = await badge.getText();
            return count.trim() === '1';
        }, { timeout: 10000, timeoutMsg: 'Item framework synchronization failed.' });
        
        await homePage.header.openCart();
        
        await checkoutPage.proceedToSignIn();

        await checkoutPage.signIn(testEmail, testPassword);

        await checkoutPage.proceedToAddress();
        await checkoutPage.fillAddressAndProceed('RS', '21000', '55');

        await checkoutPage.fillPaymentAndFinish('3: Credit Card', 'Automation Tester', '1111222233334444');

        await checkoutPage.paymentSuccessMessage.waitForDisplayed({ timeout: 10000 });
        const confirmationText = await checkoutPage.paymentSuccessMessage.getText();
        expect(confirmationText).to.include('Payment successful');
    });
});
