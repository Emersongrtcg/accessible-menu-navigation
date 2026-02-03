window.a11y ??= {};
a11y.menu ??= {};

a11y.menu.Navigator = class {
    navigate(menu, navMap, action, currentIndex) {
        if (!(action in navMap)) {
            return; //Ignore unsuported keys.
        }

        navMap[action](menu, currentIndex);
    }

    get #basicNavMap() {
        return {
            at(array, index) {
                let length = array.length;
                return array[(index + length) % length];
            },

            Home(menu) {
                this.at(menu.buttons, 0).focus();
            },

            End(menu) {
                this.at(menu.buttons, -1).focus();
            }
        }
    }

    get menuNavMap() {
        return {
            ...this.#basicNavMap,

            ArrowLeft(menu, currentIndex) {
                this.at(menu.buttons, currentIndex - 1).focus();
            },

            ArrowRight(menu, currentIndex) {
                this.at(menu.buttons, currentIndex + 1).focus();
            }
        }
    }

    get menuWithSubMenusNavMap() {
        return {
            ...this.menuNavMap,

            Enter(menu, currentIndex) {
            },

            Space(menu, currentIndex) {
                this.Enter(menu, currentIndex);
            },

            ArrowDown(menu, currentIndex) {
                this.at(menu.buttons, currentIndex).click();
            },

            ArrowUp(menu, currentIndex) {
                this.at(menu.buttons, currentIndex).click();
            }
        }
    }
};
