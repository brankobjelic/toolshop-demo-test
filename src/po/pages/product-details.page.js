import BasePage from './base.page.js';

export class ProductDetailsPage extends BasePage {
    get addToCartBtn() { return $('[data-test="add-to-cart"]'); }
    get addToFavoritesBtn() { return $('[data-test="add-to-favorites"]'); }
    get quantityInput() { return $('[data-test="quantity"]'); }

    async setQuantity(qty) {
        await this.quantityInput.waitForDisplayed({ timeout: 3000 });
        await this.quantityInput.setValue(qty);
    }

    async addToCart() {
        await this.addToCartBtn.waitForDisplayed({ timeout: 5000 });
        await this.addToCartBtn.waitForClickable({ timeout: 5000 });
        await this.addToCartBtn.click();
    }

    async addToFavorites() {
        await this.addToFavoritesBtn.waitForDisplayed({ timeout: 5000 });
        await this.addToFavoritesBtn.click();
    }
}
