window.a11y ??= {};
a11y.menu ??= {};

if (! a11y.menu.Navigator) {
    throw new Error('Navigator.js was not properly loaded.');
}

a11y.menu.AccessibleMenu = class {
    mainMenu = document.querySelector('[role="menubar"]');
    btnText = document.getElementById('btn-text');
    navigator = new a11y.menu.Navigator();

    constructor() {
        this.#appendButtonsTo(this.mainMenu);

        this.mainMenu.buttons.forEach((button, index) => {
            const popoverTargetId = button.getAttribute('popovertarget');
            const hasSubmenus = (popoverTargetId !== null);
            const navMap = hasSubmenus ?
                this.navigator.menuWithSubMenusNavMap :
                this.navigator.menuNavMap;

            this.#initializeButton(button, index, navMap, this.mainMenu);

            if (!hasSubmenus) {
                return;
            }

            button.subMenu = document.getElementById(popoverTargetId);

            this.#initializeSubMenu(button.subMenu, button);
        });
    }

    #appendButtonsTo(menu) {
        menu.buttons = menu.querySelectorAll('& > [role="menuitem"] > button');
    }

    #initializeSubMenu(menu, parentMenu) {
        menu.parentMenu = parentMenu;
        this.#appendButtonsTo(menu);

        const navMap = this.navigator.subMenuNavMap;
        menu.buttons.forEach((button, index) => {
            this.#initializeButton(button, index, navMap, menu);
        });
    }

    #initializeButton(button, index, navMap, menu) {
        button.navigate = (pressedKey) => {
            this.navigator.navigate(menu, navMap, pressedKey, index);
        }

        button.addEventListener('click', (event) => {
            this.btnText.textContent = event.target.textContent;

            const current = this.mainMenu.querySelector('[aria-current="true"]');
            if (current) {
                current.removeAttribute('aria-current');
            }

            button.parentElement.setAttribute('aria-current', 'true');
        });

        button.addEventListener('keyup', (event) => {
            let pressedKey = event.key;

            pressedKey =
                pressedKey === ' ' ? 'Space' :
                (pressedKey === 'Tab' && event.shiftKey === true) ? 'ShiftTab' :
                pressedKey;

            button.navigate(pressedKey);
        });
    }
}
