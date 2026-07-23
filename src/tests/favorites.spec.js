import { assert } from 'chai';
import { page } from '../po/index.js';

describe('Favorites Functionality (Assert Style)', () => {

    it('Successfully remove an item from favorites', async () => {
        const homePage = page('home');
        const loginPage = page('login');
        const favoritesPage = page('favorites');
        const productDetailsPage = page('productDetails');

        await homePage.open();
        await browser.deleteCookies();
        await browser.execute(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
    
        await loginPage.open();
        await loginPage.login('customer@practicesoftwaretesting.com', 'welcome01');
        
        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('/account');
        }, { timeout: 15000, timeoutMsg: 'Login redirect timed out.' });

        await favoritesPage.open();
        await browser.pause(2000);
        let favoriteItems = await favoritesPage.favoriteItems;

        if (favoriteItems.length === 0) {
            await homePage.open(); 
            await homePage.selectFirstProduct();
            
            await productDetailsPage.addToFavorites();
            
            await favoritesPage.open();
            await browser.waitUntil(async () => {
                return (await favoritesPage.favoriteItems).length > 0;
            }, { timeout: 5000 });
            
            favoriteItems = await favoritesPage.favoriteItems;
        }
        
        if (favoriteItems.length === 0) {
            throw new Error('Test aborted: No favorite cards were found on the page');
        }

        const initialCount = favoriteItems.length;

        await favoritesPage.removeFirstFavorite();

        await browser.waitUntil(async () => {
            const favoriteItemsAfter = await favoritesPage.favoriteItems;
            return favoriteItemsAfter.length === initialCount - 1;
        }, {
            timeout: 5000,
            timeoutMsg: 'The tool was not successfully removed from the favorites list view.'
        });

        const finalFavoriteItems = await favoritesPage.favoriteItems;
        assert.equal(finalFavoriteItems.length, initialCount - 1, 'The favorite item count did not decrease by 1');
    });

});
