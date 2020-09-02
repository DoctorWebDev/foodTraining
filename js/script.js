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

    const deadline = '2020-09-23';


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
          modalWindow = document.querySelector('.modal');


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

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModalWindow();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow();
        }
    });

    const modalTimerId = setTimeout(openModalWindow, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModalWindow();
            removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


    // Using slass for creating foodcard

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();

        }

        changeToUAH() {
            this.price = this.transfer * this.price;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;

            this.parent.append(element);
        }


    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status:${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            // деструктуризация обьекта
            data.forEach(({img, altimg, title, descr, price}) => [
                new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render()
            ]);
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Успех! Скоро мы с Вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });


    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            // const request = new XMLHttpRequest();

            // request.open('POST', 'server.php');
            // request.setRequestHeader('Content-type', 'application/json');


            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);               
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

            // request.send(json);
            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();

            //         statusMessage.remove();

            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModalWindow();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">           
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>      
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            closeModalWindow();
        }, 4000);
    }
    //=============================================
    // Запрос на сервер через Fetch API и Promise
    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //     method: 'POST',
    //     body: JSON.stringify({name:'Yaroslav'}),
    //     headers: {
    //         'Content-type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(json => console.log(json));
    //=============================================


    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(result => console.log(result));

    // Slider

    const slide = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          totalSlides = document.querySelector('#total'),
          currentSlides = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          slidesWidth = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1,
        offset = 0;

    if (slide.length < 10) {
        totalSlides.textContent = '0' + slide.length;
        currentSlides.textContent = '0' + slideIndex;
        
    } else {
        totalSlides.textContent = slide.length;
        currentSlides.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slide.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slide.forEach(item => {
        item.style.width = slidesWidth;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');

    const dots = [];

    function showDots() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    function showCurrentSlides() {
        if (slide.length < 10) {
            currentSlides.textContent = '0' + slideIndex;
            
        } else {
            currentSlides.textContent = slideIndex;
        }
    }
    
    indicators.classList.add('carousel-indicators');

    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    slider.append(indicators);

    for (let i = 0; i < slide.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        

        if (i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);

        dots.push(dot);
    }


    next.addEventListener('click', () => {
        if (offset == +slidesWidth.slice(0, slidesWidth.length - 2) * (slide.length - 1)) {
            offset = 0;
        } else {
            offset += +slidesWidth.slice(0, slidesWidth.length - 2);
        }
        slidesField.style.transform = `translate(-${offset}px)`;
        
        if (slideIndex == slide.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        showCurrentSlides();

        showDots();

    });

    prev.addEventListener('click', () => {
        if (offset == 0) {        
            offset = +slidesWidth.slice(0, slidesWidth.length - 2) * (slide.length - 1);
        } else {
            offset -= +slidesWidth.slice(0, slidesWidth.length - 2);
        }
        slidesField.style.transform = `translate(-${offset}px)`;
               
        if (slideIndex == 1) {
            slideIndex = slide.length;
        } else {
            slideIndex--;
        }

        showCurrentSlides();

        showDots();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (event) => {
            const slideTo = event.target.getAttribute('data-slide-to');

            slideIndex = slideTo;

            offset = +slidesWidth.slice(0, slidesWidth.length - 2) * (slideTo - 1);
            slidesField.style.transform = `translate(-${offset}px)`;

            
            showCurrentSlides();

            showDots();

        });
    });



    // showSlides(slideIndex);

    // if (slide.length < 10) {
    //     totalSlides.textContent = '0' + slide.length;
        
    // } else {
    //     totalSlides.textContent = slide.length;
    // }

    // function showSlides(n) {
    //     if (n > slide.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slide.length;
    //     }

        
    //     slide.forEach(item => {
    //         item.classList.remove('show');
    //         item.classList.add('hide');
    //     });

    //     slide[slideIndex - 1].classList.remove('hide');
    //     slide[slideIndex - 1].classList.add('show');

    //     if (slide.length < 10) {
    //         currentSlides.textContent = '0' + slideIndex;
            
    //     } else {
    //         currentSlides.textContent = slideIndex;
    //     }

    // }

    // function plusSkides(n) {
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {
    //     plusSkides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSkides(1);
    // });
  

    

});