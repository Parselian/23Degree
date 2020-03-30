'use-strict';

window.addEventListener('DOMContentLoaded', () => {

  /* ACTIVATE BURGER-MENU */
  const toggleBurger = () => {
    const burgerMenu = document.querySelector('.burger-menu'),
          promoBlock = document.querySelector('.promo');
      
    promoBlock.addEventListener('click', (e) => {
      const target = e.target;
      
      if (target.matches('.header__burger-btn') ) {
        burgerMenu.classList.toggle('burger-menu_active');
        // target.classList.toggle('burger-btn_active');
      } else if( target.closest('.promo__scroll-mouse') ) {
        e.preventDefault();
        smoothScroll(target.closest('.promo__scroll-mouse').getAttribute('href'));
      }
    });

    burgerMenu.addEventListener('click', (e) => {
      const target = e.target,
            headerBurgerBtn = document.querySelector('.header__burger-btn');

      if( target.closest('.burger-btn') ) {
        burgerMenu.classList.toggle('burger-menu_active');
        // headerBurgerBtn.classList.toggle('burger-btn_active');
      } else if( target. matches('a') ) {
        e.preventDefault();
        smoothScroll(target.getAttribute('href'));
        burgerMenu.classList.toggle('burger-menu_active');
      }
    });
  };
  toggleBurger();

  /* SMOOTH SCROLL TO ANCHORS */
  const smoothScroll = (selector) => {
    const anchorLink = document.querySelector(`a[href='${selector}']`).getAttribute('href').slice(1),
          scrollingPos = document.getElementById(anchorLink);

    scrollingPos.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  /* SHOW BUTTONS IN SERVICES SECTION AT PROMTING*/
  const showServiceButtons = () => {
    const servicesWrap = document.querySelector('.services__wrap'),
          servicesButtons = document.querySelectorAll('.info-block__btn');

    servicesWrap.addEventListener('mouseover', (e) => {
      const target = e.target;

      if( target.matches('.services-block__content') ) {
        const servicesButton = target.querySelector('.info-block__btn');

        servicesButton.classList.add('button_unrolled');
      }
    });

    servicesWrap.addEventListener('mouseout', (e) => {
      const target = e.target;

      if ( !target.matches('.services-block__content') ) {
        servicesButtons.forEach(item => {
          item.classList.remove('button_unrolled');
        });
      }
    });
  };
  showServiceButtons();

  /* ADDING INTERACTIVITY IN CALCULATOR */
  const interactCalc = () => {
    const calculator = document.querySelector('.calculator__form'),
          squareValue = calculator.querySelectorAll('.calculator__cost-value > span')[0],
          squarePrice = calculator.querySelectorAll('.calculator__cost-value > span')[1],
          fullPrice = calculator.querySelectorAll('.calculator__cost-value > span')[2];
      
    calculator.addEventListener('click', (e) => {
      const target = e.target;

      /* TOGGLE HINTS BELOW RATES*/
      const toggleHints = (target) => {
        const calcInputs = calculator.querySelectorAll('.calculator__input-label'),
              inputHints = calculator.querySelectorAll('.calculator__input-label_active');
        
        inputHints.forEach( item => {
          item.classList.remove('visible');
        });
          
        calcInputs.forEach( (item, i) => {
          if( item === target ) {
            inputHints[i].classList.add('visible');
          }
        });
      };

      if( target.matches('.calculator__radio-label') ) {
        const targetLink = target.getAttribute('for'), 
              linkedInput = document.getElementById(targetLink);

        squareValue.textContent = linkedInput.value;
      } else if( target.matches('.calculator__input-label') ) {
        const targetLink = target.getAttribute('for'),
              linkedInput = document.getElementById(targetLink);
        
        toggleHints(target);

        switch(linkedInput.value.toLowerCase()) {
          case 'light': 
            squarePrice.textContent = 500; 
            return;
          case 'medium':
            squarePrice.textContent = 750;
            return;
          case 'full':
            squarePrice.textContent = 1500;
            return;
        }
      } else if( target.matches('.calculator__button') ) {
        e.preventDefault();
        const popup = document.querySelector('.popup-contacts');

        popup.classList.add('popup_show');
      }

      fullPrice.textContent = squareValue.textContent * squarePrice.textContent;
    });
  };
  interactCalc();

  /* TOGGLE PORTFOLIO CARDS */
  const togglePortfolio = () => {
    const portfolioMenu = document.querySelector('.portfolio__menu'),
          portfolioMenuLinks = portfolioMenu.querySelectorAll('li'),
          portfolioItems = document.querySelectorAll('.portfolio__card');

    /* SHOW CARDS FROM CHOOSEN CATEGORY IN MENU */
    const showChoosenCat = (category) => {
      portfolioItems.forEach( item => {
        if( item.dataset.category !== category ) {
          item.classList.add('hidden');
        } else {
          item.classList.remove('hidden');
        }
        
        if( category === 'all' ) {
          item.classList.remove('hidden');
        }
      });
    };

    portfolioMenu.addEventListener('click', (e) => {
      const target = e.target;

      let categoryName;

      if( target.matches('li') ) {
        portfolioMenuLinks.forEach( item => {
          item.classList.remove('portfolio__menu-item_active');
        });

        target.classList.add('portfolio__menu-item_active');

        categoryName = target.dataset.activeCat;

        showChoosenCat(categoryName);
      }
    });
  };
  togglePortfolio();

  /* SENDING ALL FORMS ON SITE */
  const sendForm = (selector, url) => {
    const form = document.querySelector(selector),
          notification = document.createElement('div'),
          loaderIcon = document.createElement('div'),
          popupThanks = document.querySelector('.popup-thanks');
          
    let intervalId;

    loaderIcon.style.cssText = `
      margin-top: 15px;
      margin-left: auto;
      margin-right: auto;
      width: 30px;
      height: 30px;
      border: 2px dotted white;
      border-radius: 15px;
      z-index: 12;
    `;

    notification.style.cssText = `
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      color: lightgreen
    `;

    const loader = () => {
      let angleCount = 0;

      intervalId = setInterval(() => {
        if( angleCount >= 360 ) {
          angleCount = 0;
        }

        loaderIcon.style.transform = `rotate(${angleCount}deg)`;

        angleCount++;
      }, 10);

      form.insertAdjacentElement('beforeend', loaderIcon);
    };
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      notification.remove();
      loader();

      const formData = new FormData(form),
            body = {};
        
      formData.forEach((item, i) => {
        body[i] = item;
      });

      return fetch( url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        body: JSON.stringify(body)
      })
      .then( response => {
        clearInterval(intervalId);
        form.insertAdjacentElement('beforeend', notification);
        loaderIcon.remove();

        if( response.status !== 200 ) {
          notification.textContent = 'Произошла ошибка! Попробуйте позже';
          notification.style.color = '#fd7d7d';
          throw new Error('Error! Network status not 200');
        }

        // notification.textContent = 'Ваша заявка успешно отправлена!';
        popupThanks.classList.add('popup_show');
      })
      .catch( error => console.error(error) );
    });
  };
  sendForm('#promo-form', './server.php');
  sendForm('#contacts-form', './server.php');
  sendForm('#popup-form', './server.php');

  /* TOGGLE POPUPS */
  const togglePopups = () => {
    const popup = document.querySelectorAll('.popup');

    document.addEventListener('click', (e) => {
      const target = e.target;

      if (target.matches('.popup__form-close, .popup__close-button') ) {
        popup.forEach( item => {
          item.classList.remove('popup_show');
        });
      } else if( target.matches('.info-block__btn') ) {
        popup[0].classList.add('popup_show');
      }
    });
  };
  togglePopups();

  /* SHOW MAP IN CONTACTS SECTION */
  const enableMap = () => {
    const map = document.getElementById('map');
    
    ymaps.ready(init);
    function init() {
      // Создание карты.
      var myMap = new ymaps.Map(map, {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [43.23, 76.95],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 15
      });

      var myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: [43.23, 76.95]
        },
        properties: {
          iconCaption: 'Алматы'
        }
      }, {
        preset: 'islands#blueCircleDotIconWithCaption',
        iconCaptionMaxWidth: '50'
      });
      myMap.geoObjects.add(myGeoObject); 

      myMap.behaviors.disable('scrollZoom');
      myMap.behaviors.disable('drag');
    }
  };
  enableMap();
});