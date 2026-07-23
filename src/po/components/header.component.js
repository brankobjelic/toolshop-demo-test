export default class HeaderComponent {
    get navSignIn() { return $('[data-test="nav-sign-in"]'); }
    get navMenu() { return $('[data-test="nav-menu"]'); }
    get navProfile() { return $('[data-test="nav-profile"]'); }
    get navSignOut() { return $('[data-test="nav-sign-out"]'); }
    get navCart() { return $('[data-test="nav-cart"]'); }
    get cartQuantityBadge() { return $('[data-test="cart-quantity"]'); }

    async openSignIn() {
        await this.navSignIn.click();
    }

    async openCart() {
        await this.navCart.click();
    }

    async openProfile() {
        await this.navMenu.click();
        await this.navProfile.click();
    }

    async signOut() {
        await this.navMenu.click();
        await this.navSignOut.click();
    }
}
