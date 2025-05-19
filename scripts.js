let a11y;
a11y = a11y || {};
a11y.menu = {
    btnText: document.getElementById('btn-text'),
    mainMenuButtons: document.querySelectorAll('[role="menubar"]>li>button'),
    subMenuButtons: document.querySelectorAll('[role="menu"]>li>button'),

    changeSpanText: function (event) {
        a11y.menu.btnText.innerHTML = event.target.innerHTML;
    }
};

a11y.menu.mainMenuButtons.forEach((button) => {
    button.addEventListener('click', a11y.menu.changeSpanText);

    let popoverTarget = button.getAttribute('popovertarget');
    if (popoverTarget) {
        childMenu = document.getElementById(popoverTarget);
        button.childMenu = childMenu;
    }
});

a11y.menu.subMenuButtons.forEach((button) => {
    button.addEventListener('click', a11y.menu.changeSpanText);
});
