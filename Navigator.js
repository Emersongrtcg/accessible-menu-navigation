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

            subMenu(menu, currentIndex) {
                return menu.buttons[currentIndex].subMenu;
            },

            openSubMenu(button) {
                if (button.querySelector('& ~ menu:popover-open')) {
                    return;
                }
                button.subMenu.showPopover();
            },

            Enter(menu, currentIndex) {
                const subMenu = this.subMenu(menu, currentIndex);
                this.at(subMenu.buttons, 0).focus();
            },

            Space(menu, currentIndex) {
                //FIXME: For some reason, the Space key doesn't close the popover
                this.at(menu.buttons, currentIndex).click();
                this.Enter(menu, currentIndex);
            },

            ArrowDown(menu, currentIndex) {
                this.at(menu.buttons, currentIndex).click();
                this.openSubMenu(this.at(menu.buttons, currentIndex));

                const subMenu = this.subMenu(menu, currentIndex);
                this.at(subMenu.buttons, 0).focus();
            },

            ArrowUp(menu, currentIndex) {
                this.at(menu.buttons, currentIndex).click();
                this.openSubMenu(this.at(menu.buttons, currentIndex));

                const subMenu = this.subMenu(menu, currentIndex);
                this.at(subMenu.buttons, -1).focus();
            }
        }
    }

    get subMenuNavMap() {
        return {
            ...this.#basicNavMap,

            ArrowUp(menu, currentIndex) {
                this.at(menu.buttons, currentIndex - 1).focus();
            },

            ArrowDown(menu, currentIndex) {
                this.at(menu.buttons, currentIndex + 1).focus();
            },

            ArrowLeft(menu) {
                menu.parentMenu.navigate('ArrowLeft');
            },

            ArrowRight(menu) {
                menu.parentMenu.navigate('ArrowRight');
            }
        }
    }
};
