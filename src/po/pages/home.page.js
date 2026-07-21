import BasePage from './base.page.js';
import HeaderComponent from '../components/header.component.js';

export class HomePage extends BasePage {
    constructor() {
        super();
        this.header = new HeaderComponent();
    }

    get productCards() { return $$('[data-test^="product-"]'); }
    get firstProductCard() { return $('[data-test^="product-"]'); }
    get productNames() { return $$('[data-test="product-name"]'); }
    get productPrices() { return $$('[data-test="product-price"]'); }
    get firstProductImage() { return $('.card-img-top'); }

    get sortDropdown() { return $('[data-test="sort"]'); }

    async getHandToolsCheckbox() {
        const handToolsLabel = await $('//label[contains(text(), "Hand Tools")]');
        await handToolsLabel.waitForExist({ timeout: 10000 });
        return handToolsLabel.$('input[type="checkbox"]');
    }

    async open() {
        await super.open('/');
    }

    async filterByHandTools() {
        const checkbox = await this.getHandToolsCheckbox();
        await checkbox.scrollIntoView();
        await checkbox.click();
        await browser.pause(1000);
    }

    async sortByPriceAsc() {
        await this.sortDropdown.selectByAttribute('value', 'price,asc');
    }

    async selectFirstAvailableProduct() {
        await this.firstProductCard.waitForDisplayed({ timeout: 7000 });
        const cards = await this.productCards;
        for (const card of cards) {
            const cardText = await card.getText();
            if (!cardText.includes('Out of stock')) {
                const img = await card.$('.card-img-top');
                await img.scrollIntoView();
                await img.waitForClickable({ timeout: 5000 });
                await img.click();
                return;
            }
        }
        throw new Error("No available product found.");
    }

    async selectFirstProduct() {
        await this.firstProductImage.waitForDisplayed({ timeout: 5000 });
        await this.firstProductImage.click();
    }
}
