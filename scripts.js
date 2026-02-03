window.a11y ??= {};
a11y.menu ??= {};

if (! a11y.menu.AccessibleMenu) {
    throw new Error('AccessibleMenu.js was not properly loaded.');
}

new a11y.menu.AccessibleMenu();
