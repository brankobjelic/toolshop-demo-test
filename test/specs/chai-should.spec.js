import chai from 'chai';

chai.should(); 

describe('Shopping Cart Functionality', () => {

    it('Add multiple quantities of a tool to the shopping cart', async () => {
        await browser.url('/');
        
        const firstProduct = await $('.card-img-top');
        await firstProduct.waitForDisplayed({ timeout: 5000 });
        await firstProduct.click();
        
        const quantityInput = await $('[data-test="quantity"]');
        await quantityInput.waitForDisplayed({ timeout: 3000 });
        
        await quantityInput.setValue(3);
        await $('[data-test="add-to-cart"]').click();
        
        const cartBadge = await $('[data-test="cart-quantity"]');

        let badgeText = '';
        await browser.waitUntil(async () => {
            badgeText = await cartBadge.getText();
            return badgeText !== '';
        }, {
            timeout: 5000,
            timeoutMsg: 'Cart badge text did not populate'
        });

        badgeText.should.equal('3');
    });

    it('Enforce maximum item quantity restriction in the cart', async () => {

        await browser.url('/checkout');

        const quantityField = await $('[data-test="product-quantity"]');
        await quantityField.waitForDisplayed();
        
        await quantityField.setValue(100);
        
        await browser.keys('Tab'); 
        
        await browser.pause(1000); 
        const adjustedQuantity = await quantityField.getValue();

        adjustedQuantity.should.equal('99');
    });
});