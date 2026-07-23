import { assert } from 'chai';
import { page } from '../po/index.js';

describe('Catalog Filtering and Sorting (Assert Style)', () => {

    beforeEach(async () => {
        const homePage = page('home');
        await homePage.open();
    });

    it('Scenario: Filter products by category', async () => {
        const homePage = page('home');

        await homePage.filterByHandTools();

        const productCards = await homePage.productNames;
        assert.isAbove(productCards.length, 0, 'No products were displayed after filtering');
        
        const hammerProduct = await $('div=Hammer');
        assert.isTrue(await hammerProduct.isDisplayed(), 'Expected hand tools like "Hammer" to be visible');
    });

    it('Scenario: Sort hand tools by price ascending', async () => {
        const homePage = page('home');

        await homePage.filterByHandTools();
        await homePage.sortByPriceAsc();

        let UIFields = [];
        
        await browser.waitUntil(async () => {
            const priceElements = await homePage.productPrices;
            if (priceElements.length === 0) return false;
            UIFields = [];
            for (const element of priceElements) {
                const priceText = await element.getText(); 
                const numericPrice = parseFloat(priceText.replace('$', ''));
                UIFields.push(numericPrice);
            }

            return UIFields.every((val, i, arr) => !i || val >= arr[i - 1]);
        }, {
            timeout: 15000,
            timeoutMsg: () => `Prices failed to sort ascending within 15s. Final UI state captured: [${UIFields.join(', ')}]`
        });

        assert.isTrue(true);
    });

});
