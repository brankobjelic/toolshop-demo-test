import BasePage from './base.page.js';

export class FavoritesPage extends BasePage {
    get favoriteItems() { return $$('[data-test^="favorite-"]'); }

    async open() {
        await super.open('/account/favorites');
    }

    async removeFirstFavorite() {
        const items = await this.favoriteItems;
        if (items.length > 0) {
            const removeBtn = await items[0].$('[data-test="delete"]');
            await removeBtn.waitForClickable({ timeout: 5000 });
            await removeBtn.click();
        }
    }
}
