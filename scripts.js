let a11y;
a11y = a11y || {};
a11y.menu = {
    btnText: document.getElementById('btn-text'),
    mainMenu: document.querySelector('[role="menubar"]'),
    mainMenuButtons: document.querySelectorAll('[role="menubar"]>li>button'),
    subMenuButtons: document.querySelectorAll('[role="menu"]>li>button'),
};

a11y.menu.mainMenu.navigate = function (currentIndex, event) {
    const buttons = a11y.menu.mainMenuButtons;
    const childButtons = buttons[currentIndex].childButtons;

    buttons.at = function (index) {
        let length = buttons.length;
        return buttons[(index + length) % length];
    }

    function ArrowLeft(currentIndex) {
        buttons.at(currentIndex - 1).focus();
    }

    function ArrowRight(currentIndex) {
        buttons.at(currentIndex + 1).focus();
    }

    function Home() {
        buttons.at(0).focus();
    }

    function End() {
        buttons.at(-1).focus();
    }

    if (childButtons) {
        function Enter() {
            childButtons[0].focus();
        }

        function Space() {
            buttons[currentIndex].click();
            childButtons[0].focus();
        }

        function ArrowDown(currentIndex) {
            buttons[currentIndex].click();
            childButtons[0].focus();
        }

        function ArrowUp(currentIndex) {
            buttons[currentIndex].click();
            childButtons[childButtons.length - 1].focus();
        }
    }

    try {
        let key = event.key;
        if (key === ' ') { key = 'Space' }
        if (key === 'Tab' && event.shiftKey === true) { key = 'ShiftTab' }

        eval(key + '(currentIndex, event)');
    } catch (e) {
        return;//Ignore unsupported keys
    }
}

a11y.menu.mainMenuButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        a11y.menu.btnText.innerHTML = event.target.innerHTML;

        current = a11y.menu.mainMenu.querySelector('[aria-current="true"]');
        if (current) {
            current.removeAttribute('aria-current');
        }

        button.parentElement.setAttribute('aria-current', 'true');
    });

    button.addEventListener('keyup', (event) => {
        a11y.menu.mainMenu.navigate(index, event)
    })

    let popoverTarget = button.getAttribute('popovertarget');
    if (!popoverTarget) {
        return;
    }

    button.childButtons = document.querySelectorAll(
        '#' + popoverTarget + ' button'
    );
});

a11y.menu.subMenuButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        a11y.menu.btnText.innerHTML = event.target.innerHTML;
    });
});