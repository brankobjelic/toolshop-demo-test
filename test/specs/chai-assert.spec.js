import { assert } from 'chai';

describe('Catalog Filtering and Sorting (Assert Style)', () => {

    beforeEach(async () => {
        await browser.url('/');
    });

    it('Successfully remove an item from favorites', async () => {

            const favoriteSelector = '[data-test^="favorite-"]';

        await browser.url('/');
        await browser.deleteCookies();
        await browser.execute(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
    
        await browser.url('/auth/login');
        await $('[data-test="email"]').setValue('customer@practicesoftwaretesting.com'); 
        await $('[data-test="password"]').setValue('welcome01');
        await $('[data-test="login-submit"]').click();
        
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('/account');
        }, { timeout: 7000, timeoutMsg: 'Login redirect timed out.' });

        await browser.url('/account/favorites');
        await browser.pause(2000);
        let favoriteItems = await $$(favoriteSelector);

        if (favoriteItems.length === 0) {
            await browser.url('/'); 
            await $('[data-test^="product-"]').waitForDisplayed({ timeout: 5000 });
            
            const firstProduct = await $('[data-test^="product-"]');
            await firstProduct.click();
            
            const addToFavoritesBtn = await $('[data-test="add-to-favorites"]');
            await addToFavoritesBtn.waitForDisplayed({ timeout: 5000 });
            await addToFavoritesBtn.click();
            
            await browser.url('/account/favorites');
            await $(favoriteSelector).waitForDisplayed({ timeout: 5000 });
            
            favoriteItems = await $$(favoriteSelector);
        }
        
        if (favoriteItems.length === 0) {
            throw new Error('Test aborted: No favorite cards were found on the page using ' + favoriteSelector);
        }

        const initialCount = favoriteItems.length;

        const removeFavoriteBtn = await favoriteItems[0].$('[data-test="delete"]');
        await removeFavoriteBtn.waitForClickable({ timeout: 5000 });
        await removeFavoriteBtn.click();

        await browser.waitUntil(async () => {
            const favoriteItemsAfter = await $$(favoriteSelector);
            return favoriteItemsAfter.length === initialCount - 1;
        }, {
            timeout: 5000,
            timeoutMsg: 'The tool was not successfully removed from the favorites list view.'
        });

        const finalFavoriteItems = await $$(favoriteSelector);
        assert.equal(finalFavoriteItems.length, initialCount - 1, 'The favorite item count did not decrease by 1');
    });

    it('Scenario: Filter products by category', async () => {

        const handToolsLabel = await $('//label[contains(text(), "Hand Tools")]');
        await handToolsLabel.waitForExist({ timeout: 5000 });
        
        const handToolsCheckbox = await handToolsLabel.$('input[type="checkbox"]');
        await handToolsCheckbox.scrollIntoView();
        await handToolsCheckbox.click();

        await browser.pause(1000); 

        const productCards = await $$('[data-test="product-name"]');
        assert.isAbove(productCards.length, 0, 'No products were displayed after filtering');
        
        const hammerProduct = await $('div=Hammer');
        assert.isTrue(await hammerProduct.isDisplayed(), 'Expected hand tools like "Hammer" to be visible');
    });

    it('Scenario: Sort hand tools by price ascending', async () => {
        const handToolsLabel = await $('//label[contains(text(), "Hand Tools")]');
        await handToolsLabel.waitForExist({ timeout: 5000 });
        
        const handToolsCheckbox = await handToolsLabel.$('input[type="checkbox"]');
        await handToolsCheckbox.scrollIntoView();
        await handToolsCheckbox.click();
        
        await browser.pause(1000);

        const sortDropdown = await $('[data-test="sort"]');
        await sortDropdown.selectByAttribute('value', 'price,asc');

        let UIFields = [];
        
        await browser.waitUntil(async () => {
            const priceElements = await $$('[data-test="product-price"]');
            if (priceElements.length === 0) return false;
            UIFields = [];
            for (const element of priceElements) {
                const priceText = await element.getText(); 
                const numericPrice = parseFloat(priceText.replace('$', ''));
                UIFields.push(numericPrice);
            }

            return UIFields.every((val, i, arr) => !i || val >= arr[i - 1]);
        }, {
            timeout: 7000,
            timeoutMsg: () => `Prices failed to sort ascending within 7s. Final UI state captured: [${UIFields.join(', ')}]`
        });

        assert.isTrue(true);
    });

});