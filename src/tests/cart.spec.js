import chai from 'chai';
import { page } from '../po/index.js';

chai.should(); 

describe('Shopping Cart Functionality', () => {

    it('Add multiple quantities of a tool to the shopping cart', async () => {
        const homePage = page('home');
        const productDetailsPage = page('productDetails');

        await homePage.open();
        
        await homePage.selectFirstProduct();
        
        await productDetailsPage.setQuantity(3);
        await productDetailsPage.addToCart();
        
        const cartBadge = homePage.header.cartQuantityBadge;

        let badgeText = '';
        await browser.waitUntil(async () => {
            if (!(await cartBadge.isExisting())) return false;
            badgeText = await cartBadge.getText();
            return badgeText !== '';
        }, {
            timeout: 10000,
            timeoutMsg: 'Cart badge text did not populate'
        });

        badgeText.should.equal('3');
    });

    it('Enforce maximum item quantity restriction in the cart', async () => {
        const homePage = page('home');
        const checkoutPage = page('checkout');

        await homePage.header.openCart();

        const quantityField = await checkoutPage.productQuantityInput;
        await quantityField.waitForDisplayed({ timeout: 10000 });
        
        await quantityField.setValue(100);
        
        await browser.keys('Tab'); 
        
        await browser.pause(1000); 
        const adjustedQuantity = await quantityField.getValue();

        adjustedQuantity.should.equal('99');
    });
});
