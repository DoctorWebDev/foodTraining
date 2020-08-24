window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';            
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';            
        
        tabs[i].classList.add('tabheader__item_active');
        
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i); 
                }
            });
        }
    });



    // Timer

    const deadline = '2020-08-28';


    function getTimeRemaining(endTime) { // функция для расчета оставшегося времени
        // перевод в число и математическая операция
        const t = Date.parse(endTime) - Date.parse(new Date()); 

        const days = Math.floor(t / (1000 * 60 * 60 * 24)), 
              hours = Math.floor( (t / (1000 * 60 * 60)) % 24),
              min = Math.floor( (t / 1000 / 60) % 60),
              sec = Math.floor( (t / 1000) % 60);
        // возвращаем как обьект
        return { 
            'total': t,
            'days': days,
            'hours': hours,
            'min': min,
            'sec': sec
        };
    }
    // для отображения 0 перед числов  таймере
    function getZiro(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }
    // устанавливаем таймер
    function setclock(selector, endTime) {
        // получаем елементы с страницы
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              min = timer.querySelector('#minutes'),
              sec = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();
        // обновляем таймер и выводим на странице, заускаем и очищаем интервал
        function updateClock() {
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZiro(t.days);
            hours.innerHTML = getZiro(t.hours);
            min.innerHTML = getZiro(t.min);
            sec.innerHTML = getZiro(t.sec);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setclock('.timer', deadline);

    // Modal

    const openModal = document.querySelectorAll('[data-modal]'),
          modalWindow = document.querySelector('.modal'),
          closeModal = document.querySelector('[data-close]');


    function openModalWindow() {
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }
    
    openModal.forEach(item => {
        item.addEventListener('click', openModalWindow);
    });

    function closeModalWindow() {
        modalWindow.classList.remove('show');
        modalWindow.classList.add('hide');
        document.body.style.overflow = '';
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeModalWindow);        
    }

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow) {
            closeModalWindow();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow();
        }
    });

    // const modalTimerId = setTimeout(openModalWindow, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModalWindow();
            removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    // Using slass for creating foodcard

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();

        }

        changeToUAH() {
            this.price = this.transfer * this.price;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="menu__item">
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            </div>
            `;

            this.parent.append(element);
        }


    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
       14,
        '.menu .container'
    ).render();


});