import { HomePage } from './pages/home.page.js';
import { LoginPage } from './pages/login.page.js';
import { RegisterPage } from './pages/register.page.js';
import { ProfilePage } from './pages/profile.page.js';
import { CheckoutPage } from './pages/checkout.page.js';
import { ProductDetailsPage } from './pages/product-details.page.js';
import { FavoritesPage } from './pages/favorites.page.js';

export const pages = {
    home: new HomePage(),
    login: new LoginPage(),
    register: new RegisterPage(),
    profile: new ProfilePage(),
    checkout: new CheckoutPage(),
    productDetails: new ProductDetailsPage(),
    favorites: new FavoritesPage()
};

/**
 * Returns a page object by name.
 * @param {string} name
 * @returns {BasePage}
 */
export function page(name) {
    return pages[name];
}
