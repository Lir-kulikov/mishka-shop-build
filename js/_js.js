/*! UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

https://github.com/htmlpluscss/

*/

(() => {

	"use strict";

	window.MI = window.MI || {};
	MI.resizeTimeout = null;
	MI.windowWidthOLd = window.innerWidth;

	window.addEventListener("resize", () => {

		window.requestAnimationFrame( () => {

			if (!MI.resizeTimeout) {

				MI.resizeTimeout = setTimeout( () => {

					MI.resizeTimeout = null;

					if(MI.windowWidthOLd !== window.innerWidth) {

						MI.windowWidthOLd = window.innerWidth;

						PubSub.publish('windowWidthResize');

					}

				}, 100);

			}

		});

	});

	window.addEventListener("scroll", () => window.requestAnimationFrame( () => PubSub.publish('windowScroll')));
	window.addEventListener("DOMContentLoaded", () => PubSub.publish('DOMContentLoaded'));
	window.addEventListener("load", () => PubSub.publish('pageLoad'));

	// отделяем тысячи
	MI.sepNumber = str => {
		str = str.toString();
		str = str.replace(/\s+/g,'');
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}

	// склеиваем тысячи
	MI.strToNumber = n => parseInt(n.replace(/\s+/g,''), 10);

	// обработчик анимаций
	MI.cssAnimation = a => {var b,c,d=document.createElement("cssanimation");switch(a){case'animation':b={"animation":"animationend","OAnimation":"oAnimationEnd","MozAnimation":"animationend","WebkitAnimation":"webkitAnimationEnd"};break;case'transition':b={"transition":"transitionend","OTransition":"oTransitionEnd","MozTransition":"transitionend","WebkitTransition":"webkitTransitionEnd"}}for(c in b)if(d.style[c]!==undefined)return b[c]};

	// Determine if an element is in the visible viewport
	MI.isInViewport = element => {
		const rect = element.getBoundingClientRect();
		return (rect.top >= 0 && rect.bottom <= window.innerHeight);
	};

})();
((slide) => {

	"use strict";

	if(!slide.length) {

		return;

	}

	Array.from(slide, elem =>

		elem.querySelector('.slide__btn').addEventListener('click', () => {

			elem.classList.toggle('is-open');

			setTimeout( () => {

				if(elem.getBoundingClientRect().top - MI.headerHeight < 0 && elem.classList.contains('is-open')){

					const top = elem.getBoundingClientRect().top - MI.headerHeight - parseInt(window.getComputedStyle(elem).marginTop) + window.pageYOffset;

					window.scrollTo({
						top: top,
						behavior: 'smooth'
					});

				}

			},100);

		}));

})(document.querySelectorAll('.slide'));


// accordion
((accordion) => {

	"use strict";

	if(!accordion.length) {

		return;

	}

	Array.from(accordion, elem => {

		var active = null,
			btns = elem.querySelectorAll('.accordion__btn'),
			items = elem.querySelectorAll('.accordion__item');

		Array.from(btns, (btn,index) => {

			btn.addEventListener('click', () => {

				btn.closest('.accordion__item').classList.toggle('is-open');

				if(index === active){

					active = null;

				}
				else if(items.length > 1) {

					active = index;

					Array.from(items, (el,_index) => {

						if(active !== _index) {

							el.classList.remove('is-open');

						}

					});

					setTimeout( () => {

						if(!MI.isInViewport(items[active])){

							items[active].scrollIntoView({ behavior: 'smooth' });

						}

					},100);

				}

			});

		});

	});

})(document.querySelectorAll('.accordion'));
((ask) => {

	"use strict";

	if(!ask.length) {

		return;

	}

	let observer = new MutationObserver(mutationRecords => {

		const t = mutationRecords[0].target,
			  rect = t.getBoundingClientRect();

		console.log(rect.left > window.innerWidth - rect.right);

		if(t.open) {

			const inner = t.querySelector('.ask__inner');

			if(rect.left > window.innerWidth - rect.right) {

				// правее

				inner.style.left = 'auto';
				inner.style.right = 0;
				inner.style.width = rect.left + 'px';

			}
			else {

				// левее

				inner.style.right = 'auto';
				inner.style.left = 0;
				inner.style.width = window.innerWidth - rect.right + 'px';

			}

		}

	});

	Array.from(ask, el => {

		observer.observe(el, {

			attributes : true

		});

	});

	document.body.addEventListener('click', evt => {

		Array.from(ask, el => {

			if(evt.target.closest('.ask') !== el){

				el.open = false;

			}

		});

	});

})(document.querySelectorAll('.ask'));
( form => {

	if(!form) {

		return;

	}

	const quantity = form.querySelectorAll('.quantity'),
		  totalText = form.querySelector('.cart__total'),
		  totalCountItemText = form.querySelector('.cart__total-items');

	const result = () => {

		let s = 0;
		const items = form.querySelectorAll('.cart__item');

		Array.from(items, el => {

			const count = parseInt(el.querySelector('.quantity__count').value),
				  price = parseInt(el.querySelector('.quantity__price').value);

			if(isNaN(count)) {

				count = 1;
				el.querySelector('.quantity__count').value = 1;

			}

			el.querySelector('.cart__item-price--total').textContent = MI.sepNumber(count * price);

			s += count * price;

		});

	// total sum

		totalText.textContent = MI.sepNumber(s);

	// total item

		totalCountItemText.textContent = items.length;

	// hide form empty

		if(s === 0) {

			form.classList.add('is-empty');

		}

	}

	if(quantity.length) {

// quantity
		Array.from(quantity, el => {

			let value = null;
			const up = el.querySelector('.quantity__btn--up'),
				  down = el.querySelector('.quantity__btn--down'),
				  count = el.querySelector('.quantity__count');

			up.addEventListener('click', () => {

				value = parseInt(count.value) + 1;

				count.value = value;

				result();

			});

			down.addEventListener('click', () => {

				value = parseInt(count.value) - 1;

				if(value < 1) {

					value = 1;

				}

				count.value = value;

				result();

			});

			count.addEventListener('blur', () => result());

			count.addEventListener('focus', () =>
				setTimeout( () => count.setSelectionRange(0,9),100));

			count.addEventListener('keyup', () => {

				count.value = count.value.replace(/[\D]/g, '');

				result();

			});

		});

// remove
		Array.from(form.querySelectorAll('.cart__item-remove'), el => {

			const item = el.closest('.cart__item');

			el.addEventListener('click', () => {

				item.style.height = item.clientHeight + 'px';

				item.addEventListener(MI.cssAnimation('transition'), () => {

					if(item.clientHeight > 0) {

						item.style.height = 0;

					}
					else {

						item.remove();
						result();

					}

				});

				item.classList.add('cart__item--remove');

			});

		});

	}

})(document.querySelector('.cart'));
((filter)=>{

	"use strict";

	if(!filter) {

		return;

	}

	const btnOpen = document.querySelectorAll('.filter-open'),
		  btnClose = filter.querySelectorAll('.filter-close'),
		  btnRange = filter.querySelectorAll('.filter__range-item');

	Array.from(btnOpen, el =>
		el.addEventListener('click', () =>
			document.body.classList.add('filter-show')));


	Array.from(btnClose, el =>
		el.addEventListener('click', () =>
			document.body.classList.remove('filter-show')));


	Array.from(btnRange, el => {

		const btn = el.querySelector('.filter__range-reset'),
			  input = el.querySelector('.input');

		btn.addEventListener('click', () => {

			input.value = '';
			input.focus();
			btn.classList.add('hide');

		});

		input.addEventListener('input', () => btn.classList.toggle('hide', !input.value));

		if(!input.value) {

			btn.classList.add('hide');

		}

	});


})(document.querySelector('.filter'));
((header) => {

	"use strict";

	if(!header) {

		return;

	}

	const headerTop = header.querySelector('.header__top');

	MI.headerHeight = headerTop.clientHeight;

	PubSub.subscribe('windowScroll', () => headerTop.classList.toggle('is-scroll', window.pageYOffset > 0));

	PubSub.subscribe('windowWidthResize', () => {

		MI.headerHeight = headerTop.clientHeight;

		document.documentElement.style.setProperty("--heightHeader", MI.headerHeight + 'px');

	});

})(document.querySelector('.header'));
MI.mask = (elems) => {

	if(!elems.length) {

		return;

	}

	if (!window.Inputmask) {

		const script = document.createElement('script');

		script.type = 'text/javascript';
		script.async = true;
		script.src ='/js/inputmask.min.js';

		script.onload = () => setMask();

		setTimeout( () => document.head.appendChild(script), 5000);

	}
	else {

		setMask();

	}

	const setMask = () => {

		Array.from(elems, el => {

			if(el.classList.contains('inputmask--phone')) {

				var maskInput = new Inputmask({
					mask: "+7 ( 999 ) 999-99-99",
					showMaskOnHover: false,
					placeholder: "+7 ( ___ ) ___-__-__"
				});

			}
			else if(el.classList.contains('inputmask--date')) {

				var maskInput = new Inputmask({
					alias: "datetime",
					showMaskOnHover: false,
					inputFormat: "dd.mm.yyyy",
					placeholder: "дд.мм.гггг"
				});

			}
			else if(el.classList.contains('inputmask--currency')) {

				var maskInput = new Inputmask({
					alias: "integer",
					suffix: ' рублей',
					groupSize: 3,
					autoGroup: true,
					groupSeparator: ' ',
					rightAlign: false
				});

			}
			else {

				var maskInput = new Inputmask(el.getAttribute('data-mask'));

			}

			maskInput.mask(el);

		});

	}

};

MI.mask(document.querySelectorAll('.inputmask'));
((menu) => {

	"use strict";

	if(!menu) {

		return;

	}

	// открыть|закрыть меню

	document.querySelector('.btn-menu-toggle').addEventListener('click', () => {

		if(document.body.classList.contains('menu-open')){

			setTimeout( () => window.scrollTo(0, MI.windowScrollOld));

		}
		else {

			MI.windowScrollOld = window.pageYOffset;

		}

		document.body.classList.toggle('menu-open');
		menu.classList.toggle('visuallyhidden');

	});

})(document.querySelector('.menu'));


// каталог на главной

((menu) => {

	"use strict";

	if(!menu.length) {

		return;

	}

	Array.from(menu, el => {

		el.addEventListener('click', evt => {

			evt.preventDefault();

			el.classList.toggle('is-open');

		});

	});

})(document.querySelectorAll('.main-catalog__head'));

// меню каталога

((btns) => {

	"use strict";

	if(!btns.length) {

		return;

	}

	const menu = document.querySelector('.menu-catalog'),
		  level1 = menu.querySelectorAll('.menu-catalog__head--arrow'),
		  level2 = menu.querySelectorAll('.menu-catalog__level2-link--arrow'),
		  btnClose = menu.querySelector('.menu-catalog__close'),
		  btnBack = menu.querySelector('.menu-catalog__back'),
		  category = menu.querySelector('.menu-catalog__current-category'),
		  categoryTextDefault = category.textContent;

	let	level1Scroll = 0,
		level2Scroll = 0,
		level1Open = null,
		level2Open = null;

	// открыть меню

	Array.from(btns, btn => btn.addEventListener('click', () => {

		MI.windowScrollOld = window.pageYOffset;
		window.scrollTo(0, 0);
		document.body.classList.add('menu-catalog-open');
		menu.classList.remove('visuallyhidden');

	}));

	// закрыть меню

	btnClose.addEventListener('click', () => {

		setTimeout( () => window.scrollTo(0, MI.windowScrollOld));

		document.body.classList.remove('menu-catalog-open');
		menu.classList.add('visuallyhidden');

	});

	// На уровень назад

	btnBack.addEventListener('click', () => {

		if(menu.classList.contains('is-level3')) {

			menu.style.height = level1Open.nextElementSibling.scrollHeight + "px";

			menu.classList.remove('is-level3');

			Array.from(level2, elem => elem.parentNode.classList.remove('is-open'));

			window.scrollTo(0, level2Scroll);

			category.textContent = level1Open.textContent;

		}
		else if (menu.classList.contains('is-level2')) {

			menu.style.height = menu.querySelector('.menu-catalog__inner').clientHeight + "px";

			menu.classList.remove('is-level2');

			Array.from(level1, elem => elem.classList.remove('is-open'));

			window.scrollTo(0, level1Scroll);

			btnBack.classList.add('hide');

			category.textContent = categoryTextDefault;

		}
		else {

			console.log('что-то не так');

		}

	});


	// первый уровень

	Array.from(level1, el => {

		el.addEventListener('click', evt => {

			evt.preventDefault();

			level1Scroll = window.pageYOffset;

			menu.style.height = el.nextElementSibling.scrollHeight + "px";

			menu.classList.add('is-level2');

			Array.from(level1, elem => elem.classList.toggle('is-open', elem === el));

			level1Open = el;

			btnBack.classList.remove('hide');

			category.textContent = el.textContent;

		});

	});

	// второй уровень

	Array.from(level2, el => {

		el.addEventListener('click', evt => {

			evt.preventDefault();

			level2Scroll = window.pageYOffset;

			menu.style.height = el.parentNode.nextElementSibling.scrollHeight + "px";

			menu.classList.add('is-level3');

			Array.from(level2, elem => elem.parentNode.classList.toggle('is-open', elem === el));

			level2Open = el;

			category.textContent = el.textContent;

		});

	});

})(document.querySelectorAll('.js-open-menu-catalog'));
((modal)=>{

	"use strict";

	if(!modal) {

		return;

	}

	var items = modal.querySelectorAll('.modal__item'),
		btns = document.querySelectorAll('[data-modal]'),
		box = modal.querySelector('.modal__box'),
		wrapper = document.querySelector('.wrapper'),
		windowScroll = window.pageYOffset;

	modal.addEventListener('click', evt => {

		if(evt.target.classList.contains('modal') || evt.target.closest('.modal__close')){

			MI.hideModal();

		}

	});

	MI.hideModal = () => {

		document.body.classList.remove('modal-show');
		wrapper.style.top = 0;
		window.scrollTo(0,windowScroll);

		MI.activeModal = false;

	};

	MI.modalShow = selector => {

		if(!MI.activeModal){

			windowScroll = window.pageYOffset;

			wrapper.style.top = -windowScroll + 'px';

		}

		MI.activeModal = modal.querySelector('.modal__item--' + selector);

		Array.from(items, el =>
			el.classList.toggle('visuallyhidden', el !== MI.activeModal));

		document.body.classList.add('modal-show');
		window.scrollTo(0,0);

		MI.activeModal.focus();

	};

	Array.from(btns, el =>
		el.addEventListener('click', () =>
			MI.modalShow(el.getAttribute('data-modal'))));

})(document.querySelector('.modal'));
((footer) => {

	"use strict";

	if ('IntersectionObserver' in window) {

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: [.1]
		};

		const headerBottom = document.querySelector('.header__bottom');

		const callback = (entries, observer) =>

			Array.from(entries, entry => {

				document.body.classList.toggle('bg-footer', entry.intersectionRatio > 0.1 && window.pageYOffset > 0);

				headerBottom.classList.toggle('is-hidden', entry.intersectionRatio > 0.1);

			});

		const observer = new IntersectionObserver(callback, options);

		observer.observe(footer);

	}

})(document.querySelector('.footer'));
((items)=>{

	"use strict";

	if(!items.length) {

		return;

	}

	Array.from(items, el => {

		const label = el.querySelector('.select__label'),
			  select = el.querySelector('select');

		select.addEventListener('change', () =>
			label.textContent = select.querySelector('[value="' + select.value + '"]').textContent);

	});

})(document.querySelectorAll('.select'));


document.addEventListener('DOMContentLoaded', () => {
	const elements = document.querySelectorAll('.js-choice');

	elements && elements.length && elements.forEach(el => {
		const choice = new Choices(el, {
			searchEnabled: false,
		});
		console.log(el);
	});


})
((swiperContainer)=>{

	"use strict";

	if(!swiperContainer.length) {

		return;

	}

	let swiperInit = window.Swiper;

	Array.from(swiperContainer, swipe => {

		let mySwipe = null,
			toggleSwipe = null,
			resetSwipe = null;

		const swipeControls = document.createElement('div'),
			  swipeNav = document.createElement('div'),
			  swipeBtns = document.createElement('div'),
			  swipeNext = document.createElement('button'),
			  swipePrev = document.createElement('button'),
			  items = swipe.querySelectorAll('.swiper-slide'),
			  count = items.length,
			  card = swipe.classList.contains('swiper-container--card'),
			  product = swipe.classList.contains('swiper-container--product'),
			  billboard = swipe.classList.contains('swiper-container--billboard');;

		swipeNav.className = 'swiper-pagination';
		swipeControls.className = 'swiper-controls';

		swipeBtns.className = 'swiper-navigation';
		swipePrev.className = 'swiper-button-prev button';
		swipeNext.className = 'swiper-button-next button';

		swipePrev.innerHTML = '<svg width="8" height="14" viewBox="0 0 8 14"><path d="M.16 7.38l6.48 6.46a.54.54 0 10.77-.77L1.31 7 7.4.93a.54.54 0 00-.77-.77L.16 6.62a.54.54 0 000 .77z"/></svg>';
		swipeNext.innerHTML = '<svg width="8" height="14" viewBox="0 0 8 14"><path d="M7.4 6.62L.93.16a.54.54 0 10-.77.77L6.25 7 .16 13.07a.54.54 0 00.77.77L7.4 7.38a.54.54 0 000-.77z"/></svg>';

		swipeBtns.appendChild(swipePrev);
		swipeBtns.appendChild(swipeNext);
		swipeControls.appendChild(swipeBtns);
		swipeControls.appendChild(swipeNav);
		swipe.parentNode.appendChild(swipeControls);

		// eager
		Array.from(swipe.querySelectorAll('[loading="lazy"]'), img => img.setAttribute('loading','eager'));

		// hide
		Array.from(items, el => el.classList.remove('hide'));

		resetSwipe = () => {

			if(mySwipe) {

				mySwipe.destroy(false,true);
				mySwipe = undefined;

			}

			swipeNav.classList.add('hide');
			swipeControls.classList.add('hide');

		}

		resetSwipe();

		if (card) {

			if(swipe.classList.contains('swiper-container--navigation')){

				swipeBtns.classList.add('hide');
				swipeNav.classList.remove('hide');
				swipeControls.classList.remove('hide');

			}

			toggleSwipe = () => {

				toggleSwipe = false;

				new Swiper(swipe, {
					loop: true,
					slidesPerView: 'auto',
					pagination: {
						el: swipeNav,
						clickable: true,
						bulletElement: 'button',
						bulletClass: 'button',
						bulletActiveClass: 'is-active'
					}
				});

			}

		}

		if (product) {

			swipeControls.classList.remove('hide');
			swipePrev.classList.add('swiper-button-disabled');

			toggleSwipe = () => {

				toggleSwipe = false;

				new Swiper(swipe, {
					loop: false,
					preloadImages: false,
					navigation: {
						nextEl: swipeNext,
						prevEl: swipePrev
					}
				});

			}

		}

		if (billboard) {

			swipeBtns.classList.add('hide');
			swipeNav.classList.remove('hide');
			swipeControls.classList.remove('hide');

			toggleSwipe = () => {

				toggleSwipe = false;

				new Swiper(swipe, {
					loop: true,
					preloadImages: false,
					autoplay: {
						delay: 5000
					},
					pagination: {
						el: swipeNav,
						clickable: true,
						bulletElement: 'button',
						bulletClass: 'button',
						bulletActiveClass: 'is-active'
					}
				});

			}

		}

		PubSub.subscribe('windowWidthResize', () => {

			if (window.Swiper && toggleSwipe) {

				toggleSwipe();

			}

		});

		if(window.Swiper && toggleSwipe) {

			toggleSwipe();

		}
		else {

			PubSub.subscribe('swiperJsLoad', toggleSwipe);

		}

		if(!swiperInit) {

			swiperInit = true;

			const script = document.createElement('script');

			script.type = 'text/javascript';
			script.async = true;
			script.src = '/js/swiper.min.js';

			script.onload = () => PubSub.publish('swiperJsLoad');

			document.head.appendChild(script);

		}

	});

})(document.querySelectorAll('.swiper-container'));

// tab-swiper

( tabs =>{

	if(!tabs.length) {

		return;

	}

	Array.from(tabs, tab => {

		const btns = tab.querySelectorAll('.tab-swiper__btn'),
			  items = tab.querySelectorAll('.tab-swiper__item');

		Array.from(btns, btn => {

			btn.addEventListener('click', () => {

				Array.from(btns, (_btn, index) => {

					_btn.classList.toggle('is-active', _btn === btn);
					items[index].classList.toggle('is-active', _btn === btn);

				});

			});

		});

	});

})(document.querySelectorAll('.tab-swiper'));



// tabs

if(document.querySelector('.tabs')) {

	Array.from(document.querySelectorAll('.tabs'), (tab) => {

		let btn = tab.querySelectorAll('.tabs__btn'),
			item = tab.querySelectorAll('.tabs__item'),
			nav = document.createElement('div');

		Array.from(btn, (el,index) => {

			const _btn = document.createElement('button');

			_btn.setAttribute('type','button');

			_btn.className = 'button tabs__nav-btn';

			_btn.textContent = el.textContent;

			nav.appendChild(_btn);

			el.classList.add('visuallyhidden');

			_btn.addEventListener('click', () => {

				Array.from(item, (elem,inx) => {

					btn[inx].classList.toggle('tabs__nav-btn--active', inx === index);
					elem.classList.toggle('tabs__item--active', inx === index);

				});

			});

		});

		nav.classList.add('tabs__nav');

		btn = nav.querySelectorAll('.tabs__nav-btn');

		item[0].classList.add('tabs__item--active');
		btn[0].classList.add('tabs__nav-btn--active');

		tab.insertBefore(nav, item[0]);

	});

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzLmpzIiwiYWNjb3JkaW9uLmpzIiwiYXNrLmpzIiwiY2FydC5qcyIsImZpbHRlci5qcyIsImhlYWRlci5qcyIsIm1hc2suanMiLCJtZW51LmpzIiwibW9kYWwuanMiLCJzY3JvbGwtb2JzZXJ2ZXIuanMiLCJzZWxlY3QuanMiLCJzd2lwZXIuanMiLCJ0YWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJfanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgVVRGLThcblxuwqkga292cmlnaW5cbtCS0YHQtSDQv9GA0LDQstCwINGA0LDQt9GA0LXRiNC10L3Ri1xu0LrRgNCw0YHQuNCy0YvQuSDQtNC40LfQsNC50L0g0LTQvtC70LbQtdC9INC40LzQtdGC0Ywg0LrRgNCw0YHQuNCy0YvQuSDQutC+0LTCrlxuXG5odHRwczovL2dpdGh1Yi5jb20vaHRtbHBsdXNjc3MvXG5cbiovXG5cbigoKSA9PiB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0d2luZG93Lk1JID0gd2luZG93Lk1JIHx8IHt9O1xuXHRNSS5yZXNpemVUaW1lb3V0ID0gbnVsbDtcblx0TUkud2luZG93V2lkdGhPTGQgPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG5cblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCAoKSA9PiB7XG5cblx0XHRcdGlmICghTUkucmVzaXplVGltZW91dCkge1xuXG5cdFx0XHRcdE1JLnJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCAoKSA9PiB7XG5cblx0XHRcdFx0XHRNSS5yZXNpemVUaW1lb3V0ID0gbnVsbDtcblxuXHRcdFx0XHRcdGlmKE1JLndpbmRvd1dpZHRoT0xkICE9PSB3aW5kb3cuaW5uZXJXaWR0aCkge1xuXG5cdFx0XHRcdFx0XHRNSS53aW5kb3dXaWR0aE9MZCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG5cdFx0XHRcdFx0XHRQdWJTdWIucHVibGlzaCgnd2luZG93V2lkdGhSZXNpemUnKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCAxMDApO1xuXG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHR9KTtcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoKSA9PiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCAoKSA9PiBQdWJTdWIucHVibGlzaCgnd2luZG93U2Nyb2xsJykpKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IFB1YlN1Yi5wdWJsaXNoKCdET01Db250ZW50TG9hZGVkJykpO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gUHViU3ViLnB1Ymxpc2goJ3BhZ2VMb2FkJykpO1xuXG5cdC8vINC+0YLQtNC10LvRj9C10Lwg0YLRi9GB0Y/Rh9C4XG5cdE1JLnNlcE51bWJlciA9IHN0ciA9PiB7XG5cdFx0c3RyID0gc3RyLnRvU3RyaW5nKCk7XG5cdFx0c3RyID0gc3RyLnJlcGxhY2UoL1xccysvZywnJyk7XG5cdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcblx0fVxuXG5cdC8vINGB0LrQu9C10LjQstCw0LXQvCDRgtGL0YHRj9GH0Lhcblx0TUkuc3RyVG9OdW1iZXIgPSBuID0+IHBhcnNlSW50KG4ucmVwbGFjZSgvXFxzKy9nLCcnKSwgMTApO1xuXG5cdC8vINC+0LHRgNCw0LHQvtGC0YfQuNC6INCw0L3QuNC80LDRhtC40Llcblx0TUkuY3NzQW5pbWF0aW9uID0gYSA9PiB7dmFyIGIsYyxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjc3NhbmltYXRpb25cIik7c3dpdGNoKGEpe2Nhc2UnYW5pbWF0aW9uJzpiPXtcImFuaW1hdGlvblwiOlwiYW5pbWF0aW9uZW5kXCIsXCJPQW5pbWF0aW9uXCI6XCJvQW5pbWF0aW9uRW5kXCIsXCJNb3pBbmltYXRpb25cIjpcImFuaW1hdGlvbmVuZFwiLFwiV2Via2l0QW5pbWF0aW9uXCI6XCJ3ZWJraXRBbmltYXRpb25FbmRcIn07YnJlYWs7Y2FzZSd0cmFuc2l0aW9uJzpiPXtcInRyYW5zaXRpb25cIjpcInRyYW5zaXRpb25lbmRcIixcIk9UcmFuc2l0aW9uXCI6XCJvVHJhbnNpdGlvbkVuZFwiLFwiTW96VHJhbnNpdGlvblwiOlwidHJhbnNpdGlvbmVuZFwiLFwiV2Via2l0VHJhbnNpdGlvblwiOlwid2Via2l0VHJhbnNpdGlvbkVuZFwifX1mb3IoYyBpbiBiKWlmKGQuc3R5bGVbY10hPT11bmRlZmluZWQpcmV0dXJuIGJbY119O1xuXG5cdC8vIERldGVybWluZSBpZiBhbiBlbGVtZW50IGlzIGluIHRoZSB2aXNpYmxlIHZpZXdwb3J0XG5cdE1JLmlzSW5WaWV3cG9ydCA9IGVsZW1lbnQgPT4ge1xuXHRcdGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHJldHVybiAocmVjdC50b3AgPj0gMCAmJiByZWN0LmJvdHRvbSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHR9O1xuXG59KSgpOyIsIigoc2xpZGUpID0+IHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZighc2xpZGUubGVuZ3RoKSB7XG5cblx0XHRyZXR1cm47XG5cblx0fVxuXG5cdEFycmF5LmZyb20oc2xpZGUsIGVsZW0gPT5cblxuXHRcdGVsZW0ucXVlcnlTZWxlY3RvcignLnNsaWRlX19idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdFx0ZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJyk7XG5cblx0XHRcdHNldFRpbWVvdXQoICgpID0+IHtcblxuXHRcdFx0XHRpZihlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIE1JLmhlYWRlckhlaWdodCA8IDAgJiYgZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLW9wZW4nKSl7XG5cblx0XHRcdFx0XHRjb25zdCB0b3AgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIE1JLmhlYWRlckhlaWdodCAtIHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0pLm1hcmdpblRvcCkgKyB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdFx0dG9wOiB0b3AsXG5cdFx0XHRcdFx0XHRiZWhhdmlvcjogJ3Ntb290aCdcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH0sMTAwKTtcblxuXHRcdH0pKTtcblxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlJykpO1xuXG5cbi8vIGFjY29yZGlvblxuKChhY2NvcmRpb24pID0+IHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZighYWNjb3JkaW9uLmxlbmd0aCkge1xuXG5cdFx0cmV0dXJuO1xuXG5cdH1cblxuXHRBcnJheS5mcm9tKGFjY29yZGlvbiwgZWxlbSA9PiB7XG5cblx0XHR2YXIgYWN0aXZlID0gbnVsbCxcblx0XHRcdGJ0bnMgPSBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb25fX2J0bicpLFxuXHRcdFx0aXRlbXMgPSBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb25fX2l0ZW0nKTtcblxuXHRcdEFycmF5LmZyb20oYnRucywgKGJ0bixpbmRleCkgPT4ge1xuXG5cdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRcdFx0YnRuLmNsb3Nlc3QoJy5hY2NvcmRpb25fX2l0ZW0nKS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJyk7XG5cblx0XHRcdFx0aWYoaW5kZXggPT09IGFjdGl2ZSl7XG5cblx0XHRcdFx0XHRhY3RpdmUgPSBudWxsO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZihpdGVtcy5sZW5ndGggPiAxKSB7XG5cblx0XHRcdFx0XHRhY3RpdmUgPSBpbmRleDtcblxuXHRcdFx0XHRcdEFycmF5LmZyb20oaXRlbXMsIChlbCxfaW5kZXgpID0+IHtcblxuXHRcdFx0XHRcdFx0aWYoYWN0aXZlICE9PSBfaW5kZXgpIHtcblxuXHRcdFx0XHRcdFx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0c2V0VGltZW91dCggKCkgPT4ge1xuXG5cdFx0XHRcdFx0XHRpZighTUkuaXNJblZpZXdwb3J0KGl0ZW1zW2FjdGl2ZV0pKXtcblxuXHRcdFx0XHRcdFx0XHRpdGVtc1thY3RpdmVdLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9LDEwMCk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXG5cdH0pO1xuXG59KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uJykpOyIsIigoYXNrKSA9PiB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYoIWFzay5sZW5ndGgpIHtcblxuXHRcdHJldHVybjtcblxuXHR9XG5cblx0bGV0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25SZWNvcmRzID0+IHtcblxuXHRcdGNvbnN0IHQgPSBtdXRhdGlvblJlY29yZHNbMF0udGFyZ2V0LFxuXHRcdFx0ICByZWN0ID0gdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdGNvbnNvbGUubG9nKHJlY3QubGVmdCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gcmVjdC5yaWdodCk7XG5cblx0XHRpZih0Lm9wZW4pIHtcblxuXHRcdFx0Y29uc3QgaW5uZXIgPSB0LnF1ZXJ5U2VsZWN0b3IoJy5hc2tfX2lubmVyJyk7XG5cblx0XHRcdGlmKHJlY3QubGVmdCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gcmVjdC5yaWdodCkge1xuXG5cdFx0XHRcdC8vINC/0YDQsNCy0LXQtVxuXG5cdFx0XHRcdGlubmVyLnN0eWxlLmxlZnQgPSAnYXV0byc7XG5cdFx0XHRcdGlubmVyLnN0eWxlLnJpZ2h0ID0gMDtcblx0XHRcdFx0aW5uZXIuc3R5bGUud2lkdGggPSByZWN0LmxlZnQgKyAncHgnO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblxuXHRcdFx0XHQvLyDQu9C10LLQtdC1XG5cblx0XHRcdFx0aW5uZXIuc3R5bGUucmlnaHQgPSAnYXV0byc7XG5cdFx0XHRcdGlubmVyLnN0eWxlLmxlZnQgPSAwO1xuXHRcdFx0XHRpbm5lci5zdHlsZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gcmVjdC5yaWdodCArICdweCc7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9KTtcblxuXHRBcnJheS5mcm9tKGFzaywgZWwgPT4ge1xuXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShlbCwge1xuXG5cdFx0XHRhdHRyaWJ1dGVzIDogdHJ1ZVxuXG5cdFx0fSk7XG5cblx0fSk7XG5cblx0ZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2dCA9PiB7XG5cblx0XHRBcnJheS5mcm9tKGFzaywgZWwgPT4ge1xuXG5cdFx0XHRpZihldnQudGFyZ2V0LmNsb3Nlc3QoJy5hc2snKSAhPT0gZWwpe1xuXG5cdFx0XHRcdGVsLm9wZW4gPSBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc2snKSk7IiwiKCBmb3JtID0+IHtcblxuXHRpZighZm9ybSkge1xuXG5cdFx0cmV0dXJuO1xuXG5cdH1cblxuXHRjb25zdCBxdWFudGl0eSA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLnF1YW50aXR5JyksXG5cdFx0ICB0b3RhbFRleHQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X190b3RhbCcpLFxuXHRcdCAgdG90YWxDb3VudEl0ZW1UZXh0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuY2FydF9fdG90YWwtaXRlbXMnKTtcblxuXHRjb25zdCByZXN1bHQgPSAoKSA9PiB7XG5cblx0XHRsZXQgcyA9IDA7XG5cdFx0Y29uc3QgaXRlbXMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJ0X19pdGVtJyk7XG5cblx0XHRBcnJheS5mcm9tKGl0ZW1zLCBlbCA9PiB7XG5cblx0XHRcdGNvbnN0IGNvdW50ID0gcGFyc2VJbnQoZWwucXVlcnlTZWxlY3RvcignLnF1YW50aXR5X19jb3VudCcpLnZhbHVlKSxcblx0XHRcdFx0ICBwcmljZSA9IHBhcnNlSW50KGVsLnF1ZXJ5U2VsZWN0b3IoJy5xdWFudGl0eV9fcHJpY2UnKS52YWx1ZSk7XG5cblx0XHRcdGlmKGlzTmFOKGNvdW50KSkge1xuXG5cdFx0XHRcdGNvdW50ID0gMTtcblx0XHRcdFx0ZWwucXVlcnlTZWxlY3RvcignLnF1YW50aXR5X19jb3VudCcpLnZhbHVlID0gMTtcblxuXHRcdFx0fVxuXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yKCcuY2FydF9faXRlbS1wcmljZS0tdG90YWwnKS50ZXh0Q29udGVudCA9IE1JLnNlcE51bWJlcihjb3VudCAqIHByaWNlKTtcblxuXHRcdFx0cyArPSBjb3VudCAqIHByaWNlO1xuXG5cdFx0fSk7XG5cblx0Ly8gdG90YWwgc3VtXG5cblx0XHR0b3RhbFRleHQudGV4dENvbnRlbnQgPSBNSS5zZXBOdW1iZXIocyk7XG5cblx0Ly8gdG90YWwgaXRlbVxuXG5cdFx0dG90YWxDb3VudEl0ZW1UZXh0LnRleHRDb250ZW50ID0gaXRlbXMubGVuZ3RoO1xuXG5cdC8vIGhpZGUgZm9ybSBlbXB0eVxuXG5cdFx0aWYocyA9PT0gMCkge1xuXG5cdFx0XHRmb3JtLmNsYXNzTGlzdC5hZGQoJ2lzLWVtcHR5Jyk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlmKHF1YW50aXR5Lmxlbmd0aCkge1xuXG4vLyBxdWFudGl0eVxuXHRcdEFycmF5LmZyb20ocXVhbnRpdHksIGVsID0+IHtcblxuXHRcdFx0bGV0IHZhbHVlID0gbnVsbDtcblx0XHRcdGNvbnN0IHVwID0gZWwucXVlcnlTZWxlY3RvcignLnF1YW50aXR5X19idG4tLXVwJyksXG5cdFx0XHRcdCAgZG93biA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5xdWFudGl0eV9fYnRuLS1kb3duJyksXG5cdFx0XHRcdCAgY291bnQgPSBlbC5xdWVyeVNlbGVjdG9yKCcucXVhbnRpdHlfX2NvdW50Jyk7XG5cblx0XHRcdHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG5cdFx0XHRcdHZhbHVlID0gcGFyc2VJbnQoY291bnQudmFsdWUpICsgMTtcblxuXHRcdFx0XHRjb3VudC52YWx1ZSA9IHZhbHVlO1xuXG5cdFx0XHRcdHJlc3VsdCgpO1xuXG5cdFx0XHR9KTtcblxuXHRcdFx0ZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdFx0XHR2YWx1ZSA9IHBhcnNlSW50KGNvdW50LnZhbHVlKSAtIDE7XG5cblx0XHRcdFx0aWYodmFsdWUgPCAxKSB7XG5cblx0XHRcdFx0XHR2YWx1ZSA9IDE7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvdW50LnZhbHVlID0gdmFsdWU7XG5cblx0XHRcdFx0cmVzdWx0KCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0XHRjb3VudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gcmVzdWx0KCkpO1xuXG5cdFx0XHRjb3VudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+XG5cdFx0XHRcdHNldFRpbWVvdXQoICgpID0+IGNvdW50LnNldFNlbGVjdGlvblJhbmdlKDAsOSksMTAwKSk7XG5cblx0XHRcdGNvdW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKCkgPT4ge1xuXG5cdFx0XHRcdGNvdW50LnZhbHVlID0gY291bnQudmFsdWUucmVwbGFjZSgvW1xcRF0vZywgJycpO1xuXG5cdFx0XHRcdHJlc3VsdCgpO1xuXG5cdFx0XHR9KTtcblxuXHRcdH0pO1xuXG4vLyByZW1vdmVcblx0XHRBcnJheS5mcm9tKGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmNhcnRfX2l0ZW0tcmVtb3ZlJyksIGVsID0+IHtcblxuXHRcdFx0Y29uc3QgaXRlbSA9IGVsLmNsb3Nlc3QoJy5jYXJ0X19pdGVtJyk7XG5cblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG5cdFx0XHRcdGl0ZW0uc3R5bGUuaGVpZ2h0ID0gaXRlbS5jbGllbnRIZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRcdGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihNSS5jc3NBbmltYXRpb24oJ3RyYW5zaXRpb24nKSwgKCkgPT4ge1xuXG5cdFx0XHRcdFx0aWYoaXRlbS5jbGllbnRIZWlnaHQgPiAwKSB7XG5cblx0XHRcdFx0XHRcdGl0ZW0uc3R5bGUuaGVpZ2h0ID0gMDtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdFx0aXRlbS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdHJlc3VsdCgpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnY2FydF9faXRlbS0tcmVtb3ZlJyk7XG5cblx0XHRcdH0pO1xuXG5cdFx0fSk7XG5cblx0fVxuXG59KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydCcpKTsiLCIoKGZpbHRlcik9PntcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZighZmlsdGVyKSB7XG5cblx0XHRyZXR1cm47XG5cblx0fVxuXG5cdGNvbnN0IGJ0bk9wZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyLW9wZW4nKSxcblx0XHQgIGJ0bkNsb3NlID0gZmlsdGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXItY2xvc2UnKSxcblx0XHQgIGJ0blJhbmdlID0gZmlsdGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJfX3JhbmdlLWl0ZW0nKTtcblxuXHRBcnJheS5mcm9tKGJ0bk9wZW4sIGVsID0+XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuXHRcdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdmaWx0ZXItc2hvdycpKSk7XG5cblxuXHRBcnJheS5mcm9tKGJ0bkNsb3NlLCBlbCA9PlxuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZmlsdGVyLXNob3cnKSkpO1xuXG5cblx0QXJyYXkuZnJvbShidG5SYW5nZSwgZWwgPT4ge1xuXG5cdFx0Y29uc3QgYnRuID0gZWwucXVlcnlTZWxlY3RvcignLmZpbHRlcl9fcmFuZ2UtcmVzZXQnKSxcblx0XHRcdCAgaW5wdXQgPSBlbC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQnKTtcblxuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdFx0aW5wdXQudmFsdWUgPSAnJztcblx0XHRcdGlucHV0LmZvY3VzKCk7XG5cdFx0XHRidG4uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXG5cdFx0fSk7XG5cblx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdoaWRlJywgIWlucHV0LnZhbHVlKSk7XG5cblx0XHRpZighaW5wdXQudmFsdWUpIHtcblxuXHRcdFx0YnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblxuXHRcdH1cblxuXHR9KTtcblxuXG59KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyJykpOyIsIigoaGVhZGVyKSA9PiB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYoIWhlYWRlcikge1xuXG5cdFx0cmV0dXJuO1xuXG5cdH1cblxuXHRjb25zdCBoZWFkZXJUb3AgPSBoZWFkZXIucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fdG9wJyk7XG5cblx0TUkuaGVhZGVySGVpZ2h0ID0gaGVhZGVyVG9wLmNsaWVudEhlaWdodDtcblxuXHRQdWJTdWIuc3Vic2NyaWJlKCd3aW5kb3dTY3JvbGwnLCAoKSA9PiBoZWFkZXJUb3AuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2Nyb2xsJywgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCkpO1xuXG5cdFB1YlN1Yi5zdWJzY3JpYmUoJ3dpbmRvd1dpZHRoUmVzaXplJywgKCkgPT4ge1xuXG5cdFx0TUkuaGVhZGVySGVpZ2h0ID0gaGVhZGVyVG9wLmNsaWVudEhlaWdodDtcblxuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0taGVpZ2h0SGVhZGVyXCIsIE1JLmhlYWRlckhlaWdodCArICdweCcpO1xuXG5cdH0pO1xuXG59KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJykpOyIsIk1JLm1hc2sgPSAoZWxlbXMpID0+IHtcblxuXHRpZighZWxlbXMubGVuZ3RoKSB7XG5cblx0XHRyZXR1cm47XG5cblx0fVxuXG5cdGlmICghd2luZG93LklucHV0bWFzaykge1xuXG5cdFx0Y29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cblx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG5cdFx0c2NyaXB0LnNyYyA9Jy9qcy9pbnB1dG1hc2subWluLmpzJztcblxuXHRcdHNjcmlwdC5vbmxvYWQgPSAoKSA9PiBzZXRNYXNrKCk7XG5cblx0XHRzZXRUaW1lb3V0KCAoKSA9PiBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCksIDUwMDApO1xuXG5cdH1cblx0ZWxzZSB7XG5cblx0XHRzZXRNYXNrKCk7XG5cblx0fVxuXG5cdGNvbnN0IHNldE1hc2sgPSAoKSA9PiB7XG5cblx0XHRBcnJheS5mcm9tKGVsZW1zLCBlbCA9PiB7XG5cblx0XHRcdGlmKGVsLmNsYXNzTGlzdC5jb250YWlucygnaW5wdXRtYXNrLS1waG9uZScpKSB7XG5cblx0XHRcdFx0dmFyIG1hc2tJbnB1dCA9IG5ldyBJbnB1dG1hc2soe1xuXHRcdFx0XHRcdG1hc2s6IFwiKzcgKCA5OTkgKSA5OTktOTktOTlcIixcblx0XHRcdFx0XHRzaG93TWFza09uSG92ZXI6IGZhbHNlLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiBcIis3ICggX19fICkgX19fLV9fLV9fXCJcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnB1dG1hc2stLWRhdGUnKSkge1xuXG5cdFx0XHRcdHZhciBtYXNrSW5wdXQgPSBuZXcgSW5wdXRtYXNrKHtcblx0XHRcdFx0XHRhbGlhczogXCJkYXRldGltZVwiLFxuXHRcdFx0XHRcdHNob3dNYXNrT25Ib3ZlcjogZmFsc2UsXG5cdFx0XHRcdFx0aW5wdXRGb3JtYXQ6IFwiZGQubW0ueXl5eVwiLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiBcItC00LQu0LzQvC7Qs9Cz0LPQs1wiXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKGVsLmNsYXNzTGlzdC5jb250YWlucygnaW5wdXRtYXNrLS1jdXJyZW5jeScpKSB7XG5cblx0XHRcdFx0dmFyIG1hc2tJbnB1dCA9IG5ldyBJbnB1dG1hc2soe1xuXHRcdFx0XHRcdGFsaWFzOiBcImludGVnZXJcIixcblx0XHRcdFx0XHRzdWZmaXg6ICcg0YDRg9Cx0LvQtdC5Jyxcblx0XHRcdFx0XHRncm91cFNpemU6IDMsXG5cdFx0XHRcdFx0YXV0b0dyb3VwOiB0cnVlLFxuXHRcdFx0XHRcdGdyb3VwU2VwYXJhdG9yOiAnICcsXG5cdFx0XHRcdFx0cmlnaHRBbGlnbjogZmFsc2Vcblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdHZhciBtYXNrSW5wdXQgPSBuZXcgSW5wdXRtYXNrKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXNrJykpO1xuXG5cdFx0XHR9XG5cblx0XHRcdG1hc2tJbnB1dC5tYXNrKGVsKTtcblxuXHRcdH0pO1xuXG5cdH1cblxufTtcblxuTUkubWFzayhkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5wdXRtYXNrJykpOyIsIigobWVudSkgPT4ge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmKCFtZW51KSB7XG5cblx0XHRyZXR1cm47XG5cblx0fVxuXG5cdC8vINC+0YLQutGA0YvRgtGMfNC30LDQutGA0YvRgtGMINC80LXQvdGOXG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1tZW51LXRvZ2dsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG5cdFx0aWYoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ21lbnUtb3BlbicpKXtcblxuXHRcdFx0c2V0VGltZW91dCggKCkgPT4gd2luZG93LnNjcm9sbFRvKDAsIE1JLndpbmRvd1Njcm9sbE9sZCkpO1xuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXG5cdFx0XHRNSS53aW5kb3dTY3JvbGxPbGQgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cblx0XHR9XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ21lbnUtb3BlbicpO1xuXHRcdG1lbnUuY2xhc3NMaXN0LnRvZ2dsZSgndmlzdWFsbHloaWRkZW4nKTtcblxuXHR9KTtcblxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKSk7XG5cblxuLy8g0LrQsNGC0LDQu9C+0LMg0L3QsCDQs9C70LDQstC90L7QuVxuXG4oKG1lbnUpID0+IHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZighbWVudS5sZW5ndGgpIHtcblxuXHRcdHJldHVybjtcblxuXHR9XG5cblx0QXJyYXkuZnJvbShtZW51LCBlbCA9PiB7XG5cblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2dCA9PiB7XG5cblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRlbC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJyk7XG5cblx0XHR9KTtcblxuXHR9KTtcblxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1haW4tY2F0YWxvZ19faGVhZCcpKTtcblxuLy8g0LzQtdC90Y4g0LrQsNGC0LDQu9C+0LPQsFxuXG4oKGJ0bnMpID0+IHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZighYnRucy5sZW5ndGgpIHtcblxuXHRcdHJldHVybjtcblxuXHR9XG5cblx0Y29uc3QgbWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51LWNhdGFsb2cnKSxcblx0XHQgIGxldmVsMSA9IG1lbnUucXVlcnlTZWxlY3RvckFsbCgnLm1lbnUtY2F0YWxvZ19faGVhZC0tYXJyb3cnKSxcblx0XHQgIGxldmVsMiA9IG1lbnUucXVlcnlTZWxlY3RvckFsbCgnLm1lbnUtY2F0YWxvZ19fbGV2ZWwyLWxpbmstLWFycm93JyksXG5cdFx0ICBidG5DbG9zZSA9IG1lbnUucXVlcnlTZWxlY3RvcignLm1lbnUtY2F0YWxvZ19fY2xvc2UnKSxcblx0XHQgIGJ0bkJhY2sgPSBtZW51LnF1ZXJ5U2VsZWN0b3IoJy5tZW51LWNhdGFsb2dfX2JhY2snKSxcblx0XHQgIGNhdGVnb3J5ID0gbWVudS5xdWVyeVNlbGVjdG9yKCcubWVudS1jYXRhbG9nX19jdXJyZW50LWNhdGVnb3J5JyksXG5cdFx0ICBjYXRlZ29yeVRleHREZWZhdWx0ID0gY2F0ZWdvcnkudGV4dENvbnRlbnQ7XG5cblx0bGV0XHRsZXZlbDFTY3JvbGwgPSAwLFxuXHRcdGxldmVsMlNjcm9sbCA9IDAsXG5cdFx0bGV2ZWwxT3BlbiA9IG51bGwsXG5cdFx0bGV2ZWwyT3BlbiA9IG51bGw7XG5cblx0Ly8g0L7RgtC60YDRi9GC0Ywg0LzQtdC90Y5cblxuXHRBcnJheS5mcm9tKGJ0bnMsIGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRNSS53aW5kb3dTY3JvbGxPbGQgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbWVudS1jYXRhbG9nLW9wZW4nKTtcblx0XHRtZW51LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5aGlkZGVuJyk7XG5cblx0fSkpO1xuXG5cdC8vINC30LDQutGA0YvRgtGMINC80LXQvdGOXG5cblx0YnRuQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRzZXRUaW1lb3V0KCAoKSA9PiB3aW5kb3cuc2Nyb2xsVG8oMCwgTUkud2luZG93U2Nyb2xsT2xkKSk7XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21lbnUtY2F0YWxvZy1vcGVuJyk7XG5cdFx0bWVudS5jbGFzc0xpc3QuYWRkKCd2aXN1YWxseWhpZGRlbicpO1xuXG5cdH0pO1xuXG5cdC8vINCd0LAg0YPRgNC+0LLQtdC90Ywg0L3QsNC30LDQtFxuXG5cdGJ0bkJhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRpZihtZW51LmNsYXNzTGlzdC5jb250YWlucygnaXMtbGV2ZWwzJykpIHtcblxuXHRcdFx0bWVudS5zdHlsZS5oZWlnaHQgPSBsZXZlbDFPcGVuLm5leHRFbGVtZW50U2libGluZy5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XG5cblx0XHRcdG1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtbGV2ZWwzJyk7XG5cblx0XHRcdEFycmF5LmZyb20obGV2ZWwyLCBlbGVtID0+IGVsZW0ucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJykpO1xuXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgbGV2ZWwyU2Nyb2xsKTtcblxuXHRcdFx0Y2F0ZWdvcnkudGV4dENvbnRlbnQgPSBsZXZlbDFPcGVuLnRleHRDb250ZW50O1xuXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG1lbnUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1sZXZlbDInKSkge1xuXG5cdFx0XHRtZW51LnN0eWxlLmhlaWdodCA9IG1lbnUucXVlcnlTZWxlY3RvcignLm1lbnUtY2F0YWxvZ19faW5uZXInKS5jbGllbnRIZWlnaHQgKyBcInB4XCI7XG5cblx0XHRcdG1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtbGV2ZWwyJyk7XG5cblx0XHRcdEFycmF5LmZyb20obGV2ZWwxLCBlbGVtID0+IGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpKTtcblxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIGxldmVsMVNjcm9sbCk7XG5cblx0XHRcdGJ0bkJhY2suY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXG5cdFx0XHRjYXRlZ29yeS50ZXh0Q29udGVudCA9IGNhdGVnb3J5VGV4dERlZmF1bHQ7XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCfRh9GC0L4t0YLQviDQvdC1INGC0LDQuicpO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG5cblx0Ly8g0L/QtdGA0LLRi9C5INGD0YDQvtCy0LXQvdGMXG5cblx0QXJyYXkuZnJvbShsZXZlbDEsIGVsID0+IHtcblxuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcblxuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGxldmVsMVNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblxuXHRcdFx0bWVudS5zdHlsZS5oZWlnaHQgPSBlbC5uZXh0RWxlbWVudFNpYmxpbmcuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xuXG5cdFx0XHRtZW51LmNsYXNzTGlzdC5hZGQoJ2lzLWxldmVsMicpO1xuXG5cdFx0XHRBcnJheS5mcm9tKGxldmVsMSwgZWxlbSA9PiBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2lzLW9wZW4nLCBlbGVtID09PSBlbCkpO1xuXG5cdFx0XHRsZXZlbDFPcGVuID0gZWw7XG5cblx0XHRcdGJ0bkJhY2suY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuXG5cdFx0XHRjYXRlZ29yeS50ZXh0Q29udGVudCA9IGVsLnRleHRDb250ZW50O1xuXG5cdFx0fSk7XG5cblx0fSk7XG5cblx0Ly8g0LLRgtC+0YDQvtC5INGD0YDQvtCy0LXQvdGMXG5cblx0QXJyYXkuZnJvbShsZXZlbDIsIGVsID0+IHtcblxuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZ0ID0+IHtcblxuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGxldmVsMlNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblxuXHRcdFx0bWVudS5zdHlsZS5oZWlnaHQgPSBlbC5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZy5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XG5cblx0XHRcdG1lbnUuY2xhc3NMaXN0LmFkZCgnaXMtbGV2ZWwzJyk7XG5cblx0XHRcdEFycmF5LmZyb20obGV2ZWwyLCBlbGVtID0+IGVsZW0ucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1vcGVuJywgZWxlbSA9PT0gZWwpKTtcblxuXHRcdFx0bGV2ZWwyT3BlbiA9IGVsO1xuXG5cdFx0XHRjYXRlZ29yeS50ZXh0Q29udGVudCA9IGVsLnRleHRDb250ZW50O1xuXG5cdFx0fSk7XG5cblx0fSk7XG5cbn0pKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1vcGVuLW1lbnUtY2F0YWxvZycpKTsiLCIoKG1vZGFsKT0+e1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmKCFtb2RhbCkge1xuXG5cdFx0cmV0dXJuO1xuXG5cdH1cblxuXHR2YXIgaXRlbXMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWxfX2l0ZW0nKSxcblx0XHRidG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWxdJyksXG5cdFx0Ym94ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX19ib3gnKSxcblx0XHR3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndyYXBwZXInKSxcblx0XHR3aW5kb3dTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cblx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldnQgPT4ge1xuXG5cdFx0aWYoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21vZGFsJykgfHwgZXZ0LnRhcmdldC5jbG9zZXN0KCcubW9kYWxfX2Nsb3NlJykpe1xuXG5cdFx0XHRNSS5oaWRlTW9kYWwoKTtcblxuXHRcdH1cblxuXHR9KTtcblxuXHRNSS5oaWRlTW9kYWwgPSAoKSA9PiB7XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXNob3cnKTtcblx0XHR3cmFwcGVyLnN0eWxlLnRvcCA9IDA7XG5cdFx0d2luZG93LnNjcm9sbFRvKDAsd2luZG93U2Nyb2xsKTtcblxuXHRcdE1JLmFjdGl2ZU1vZGFsID0gZmFsc2U7XG5cblx0fTtcblxuXHRNSS5tb2RhbFNob3cgPSBzZWxlY3RvciA9PiB7XG5cblx0XHRpZighTUkuYWN0aXZlTW9kYWwpe1xuXG5cdFx0XHR3aW5kb3dTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cblx0XHRcdHdyYXBwZXIuc3R5bGUudG9wID0gLXdpbmRvd1Njcm9sbCArICdweCc7XG5cblx0XHR9XG5cblx0XHRNSS5hY3RpdmVNb2RhbCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9faXRlbS0tJyArIHNlbGVjdG9yKTtcblxuXHRcdEFycmF5LmZyb20oaXRlbXMsIGVsID0+XG5cdFx0XHRlbC5jbGFzc0xpc3QudG9nZ2xlKCd2aXN1YWxseWhpZGRlbicsIGVsICE9PSBNSS5hY3RpdmVNb2RhbCkpO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1zaG93Jyk7XG5cdFx0d2luZG93LnNjcm9sbFRvKDAsMCk7XG5cblx0XHRNSS5hY3RpdmVNb2RhbC5mb2N1cygpO1xuXG5cdH07XG5cblx0QXJyYXkuZnJvbShidG5zLCBlbCA9PlxuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cblx0XHRcdE1JLm1vZGFsU2hvdyhlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwnKSkpKTtcblxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJykpOyIsIigoZm9vdGVyKSA9PiB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYgKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG5cblx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0cm9vdDogbnVsbCxcblx0XHRcdHJvb3RNYXJnaW46ICcwcHgnLFxuXHRcdFx0dGhyZXNob2xkOiBbLjFdXG5cdFx0fTtcblxuXHRcdGNvbnN0IGhlYWRlckJvdHRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2JvdHRvbScpO1xuXG5cdFx0Y29uc3QgY2FsbGJhY2sgPSAoZW50cmllcywgb2JzZXJ2ZXIpID0+XG5cblx0XHRcdEFycmF5LmZyb20oZW50cmllcywgZW50cnkgPT4ge1xuXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnYmctZm9vdGVyJywgZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gPiAwLjEgJiYgd2luZG93LnBhZ2VZT2Zmc2V0ID4gMCk7XG5cblx0XHRcdFx0aGVhZGVyQm90dG9tLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWhpZGRlbicsIGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMC4xKTtcblxuXHRcdFx0fSk7XG5cblx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihjYWxsYmFjaywgb3B0aW9ucyk7XG5cblx0XHRvYnNlcnZlci5vYnNlcnZlKGZvb3Rlcik7XG5cblx0fVxuXG59KShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyJykpOyIsIigoaXRlbXMpPT57XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYoIWl0ZW1zLmxlbmd0aCkge1xuXG5cdFx0cmV0dXJuO1xuXG5cdH1cblxuXHRBcnJheS5mcm9tKGl0ZW1zLCBlbCA9PiB7XG5cblx0XHRjb25zdCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RfX2xhYmVsJyksXG5cdFx0XHQgIHNlbGVjdCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xuXG5cdFx0c2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+XG5cdFx0XHRsYWJlbC50ZXh0Q29udGVudCA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCdbdmFsdWU9XCInICsgc2VsZWN0LnZhbHVlICsgJ1wiXScpLnRleHRDb250ZW50KTtcblxuXHR9KTtcblxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdCcpKTtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1jaG9pY2UnKTtcblxuXHRlbGVtZW50cyAmJiBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG5cdFx0Y29uc3QgY2hvaWNlID0gbmV3IENob2ljZXMoZWwsIHtcblx0XHRcdHNlYXJjaEVuYWJsZWQ6IGZhbHNlLFxuXHRcdH0pO1xuXHRcdGNvbnNvbGUubG9nKGVsKTtcblx0fSk7XG5cblxufSkiLCIoKHN3aXBlckNvbnRhaW5lcik9PntcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZighc3dpcGVyQ29udGFpbmVyLmxlbmd0aCkge1xuXG5cdFx0cmV0dXJuO1xuXG5cdH1cblxuXHRsZXQgc3dpcGVySW5pdCA9IHdpbmRvdy5Td2lwZXI7XG5cblx0QXJyYXkuZnJvbShzd2lwZXJDb250YWluZXIsIHN3aXBlID0+IHtcblxuXHRcdGxldCBteVN3aXBlID0gbnVsbCxcblx0XHRcdHRvZ2dsZVN3aXBlID0gbnVsbCxcblx0XHRcdHJlc2V0U3dpcGUgPSBudWxsO1xuXG5cdFx0Y29uc3Qgc3dpcGVDb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0ICBzd2lwZU5hdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0ICBzd2lwZUJ0bnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdCAgc3dpcGVOZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyksXG5cdFx0XHQgIHN3aXBlUHJldiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpLFxuXHRcdFx0ICBpdGVtcyA9IHN3aXBlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUnKSxcblx0XHRcdCAgY291bnQgPSBpdGVtcy5sZW5ndGgsXG5cdFx0XHQgIGNhcmQgPSBzd2lwZS5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1jb250YWluZXItLWNhcmQnKSxcblx0XHRcdCAgcHJvZHVjdCA9IHN3aXBlLmNsYXNzTGlzdC5jb250YWlucygnc3dpcGVyLWNvbnRhaW5lci0tcHJvZHVjdCcpLFxuXHRcdFx0ICBiaWxsYm9hcmQgPSBzd2lwZS5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1jb250YWluZXItLWJpbGxib2FyZCcpOztcblxuXHRcdHN3aXBlTmF2LmNsYXNzTmFtZSA9ICdzd2lwZXItcGFnaW5hdGlvbic7XG5cdFx0c3dpcGVDb250cm9scy5jbGFzc05hbWUgPSAnc3dpcGVyLWNvbnRyb2xzJztcblxuXHRcdHN3aXBlQnRucy5jbGFzc05hbWUgPSAnc3dpcGVyLW5hdmlnYXRpb24nO1xuXHRcdHN3aXBlUHJldi5jbGFzc05hbWUgPSAnc3dpcGVyLWJ1dHRvbi1wcmV2IGJ1dHRvbic7XG5cdFx0c3dpcGVOZXh0LmNsYXNzTmFtZSA9ICdzd2lwZXItYnV0dG9uLW5leHQgYnV0dG9uJztcblxuXHRcdHN3aXBlUHJldi5pbm5lckhUTUwgPSAnPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiPjxwYXRoIGQ9XCJNLjE2IDcuMzhsNi40OCA2LjQ2YS41NC41NCAwIDEwLjc3LS43N0wxLjMxIDcgNy40LjkzYS41NC41NCAwIDAwLS43Ny0uNzdMLjE2IDYuNjJhLjU0LjU0IDAgMDAwIC43N3pcIi8+PC9zdmc+Jztcblx0XHRzd2lwZU5leHQuaW5uZXJIVE1MID0gJzxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIj48cGF0aCBkPVwiTTcuNCA2LjYyTC45My4xNmEuNTQuNTQgMCAxMC0uNzcuNzdMNi4yNSA3IC4xNiAxMy4wN2EuNTQuNTQgMCAwMC43Ny43N0w3LjQgNy4zOGEuNTQuNTQgMCAwMDAtLjc3elwiLz48L3N2Zz4nO1xuXG5cdFx0c3dpcGVCdG5zLmFwcGVuZENoaWxkKHN3aXBlUHJldik7XG5cdFx0c3dpcGVCdG5zLmFwcGVuZENoaWxkKHN3aXBlTmV4dCk7XG5cdFx0c3dpcGVDb250cm9scy5hcHBlbmRDaGlsZChzd2lwZUJ0bnMpO1xuXHRcdHN3aXBlQ29udHJvbHMuYXBwZW5kQ2hpbGQoc3dpcGVOYXYpO1xuXHRcdHN3aXBlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoc3dpcGVDb250cm9scyk7XG5cblx0XHQvLyBlYWdlclxuXHRcdEFycmF5LmZyb20oc3dpcGUucXVlcnlTZWxlY3RvckFsbCgnW2xvYWRpbmc9XCJsYXp5XCJdJyksIGltZyA9PiBpbWcuc2V0QXR0cmlidXRlKCdsb2FkaW5nJywnZWFnZXInKSk7XG5cblx0XHQvLyBoaWRlXG5cdFx0QXJyYXkuZnJvbShpdGVtcywgZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpKTtcblxuXHRcdHJlc2V0U3dpcGUgPSAoKSA9PiB7XG5cblx0XHRcdGlmKG15U3dpcGUpIHtcblxuXHRcdFx0XHRteVN3aXBlLmRlc3Ryb3koZmFsc2UsdHJ1ZSk7XG5cdFx0XHRcdG15U3dpcGUgPSB1bmRlZmluZWQ7XG5cblx0XHRcdH1cblxuXHRcdFx0c3dpcGVOYXYuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXHRcdFx0c3dpcGVDb250cm9scy5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cblx0XHR9XG5cblx0XHRyZXNldFN3aXBlKCk7XG5cblx0XHRpZiAoY2FyZCkge1xuXG5cdFx0XHRpZihzd2lwZS5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1jb250YWluZXItLW5hdmlnYXRpb24nKSl7XG5cblx0XHRcdFx0c3dpcGVCdG5zLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblx0XHRcdFx0c3dpcGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuXHRcdFx0XHRzd2lwZUNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcblxuXHRcdFx0fVxuXG5cdFx0XHR0b2dnbGVTd2lwZSA9ICgpID0+IHtcblxuXHRcdFx0XHR0b2dnbGVTd2lwZSA9IGZhbHNlO1xuXG5cdFx0XHRcdG5ldyBTd2lwZXIoc3dpcGUsIHtcblx0XHRcdFx0XHRsb29wOiB0cnVlLFxuXHRcdFx0XHRcdHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcblx0XHRcdFx0XHRwYWdpbmF0aW9uOiB7XG5cdFx0XHRcdFx0XHRlbDogc3dpcGVOYXYsXG5cdFx0XHRcdFx0XHRjbGlja2FibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRidWxsZXRFbGVtZW50OiAnYnV0dG9uJyxcblx0XHRcdFx0XHRcdGJ1bGxldENsYXNzOiAnYnV0dG9uJyxcblx0XHRcdFx0XHRcdGJ1bGxldEFjdGl2ZUNsYXNzOiAnaXMtYWN0aXZlJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmIChwcm9kdWN0KSB7XG5cblx0XHRcdHN3aXBlQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuXHRcdFx0c3dpcGVQcmV2LmNsYXNzTGlzdC5hZGQoJ3N3aXBlci1idXR0b24tZGlzYWJsZWQnKTtcblxuXHRcdFx0dG9nZ2xlU3dpcGUgPSAoKSA9PiB7XG5cblx0XHRcdFx0dG9nZ2xlU3dpcGUgPSBmYWxzZTtcblxuXHRcdFx0XHRuZXcgU3dpcGVyKHN3aXBlLCB7XG5cdFx0XHRcdFx0bG9vcDogZmFsc2UsXG5cdFx0XHRcdFx0cHJlbG9hZEltYWdlczogZmFsc2UsXG5cdFx0XHRcdFx0bmF2aWdhdGlvbjoge1xuXHRcdFx0XHRcdFx0bmV4dEVsOiBzd2lwZU5leHQsXG5cdFx0XHRcdFx0XHRwcmV2RWw6IHN3aXBlUHJldlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmIChiaWxsYm9hcmQpIHtcblxuXHRcdFx0c3dpcGVCdG5zLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblx0XHRcdHN3aXBlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcblx0XHRcdHN3aXBlQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuXG5cdFx0XHR0b2dnbGVTd2lwZSA9ICgpID0+IHtcblxuXHRcdFx0XHR0b2dnbGVTd2lwZSA9IGZhbHNlO1xuXG5cdFx0XHRcdG5ldyBTd2lwZXIoc3dpcGUsIHtcblx0XHRcdFx0XHRsb29wOiB0cnVlLFxuXHRcdFx0XHRcdHByZWxvYWRJbWFnZXM6IGZhbHNlLFxuXHRcdFx0XHRcdGF1dG9wbGF5OiB7XG5cdFx0XHRcdFx0XHRkZWxheTogNTAwMFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cGFnaW5hdGlvbjoge1xuXHRcdFx0XHRcdFx0ZWw6IHN3aXBlTmF2LFxuXHRcdFx0XHRcdFx0Y2xpY2thYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0YnVsbGV0RWxlbWVudDogJ2J1dHRvbicsXG5cdFx0XHRcdFx0XHRidWxsZXRDbGFzczogJ2J1dHRvbicsXG5cdFx0XHRcdFx0XHRidWxsZXRBY3RpdmVDbGFzczogJ2lzLWFjdGl2ZSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRQdWJTdWIuc3Vic2NyaWJlKCd3aW5kb3dXaWR0aFJlc2l6ZScsICgpID0+IHtcblxuXHRcdFx0aWYgKHdpbmRvdy5Td2lwZXIgJiYgdG9nZ2xlU3dpcGUpIHtcblxuXHRcdFx0XHR0b2dnbGVTd2lwZSgpO1xuXG5cdFx0XHR9XG5cblx0XHR9KTtcblxuXHRcdGlmKHdpbmRvdy5Td2lwZXIgJiYgdG9nZ2xlU3dpcGUpIHtcblxuXHRcdFx0dG9nZ2xlU3dpcGUoKTtcblxuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0UHViU3ViLnN1YnNjcmliZSgnc3dpcGVySnNMb2FkJywgdG9nZ2xlU3dpcGUpO1xuXG5cdFx0fVxuXG5cdFx0aWYoIXN3aXBlckluaXQpIHtcblxuXHRcdFx0c3dpcGVySW5pdCA9IHRydWU7XG5cblx0XHRcdGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG5cdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdFx0c2NyaXB0LmFzeW5jID0gdHJ1ZTtcblx0XHRcdHNjcmlwdC5zcmMgPSAnL2pzL3N3aXBlci5taW4uanMnO1xuXG5cdFx0XHRzY3JpcHQub25sb2FkID0gKCkgPT4gUHViU3ViLnB1Ymxpc2goJ3N3aXBlckpzTG9hZCcpO1xuXG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cblx0XHR9XG5cblx0fSk7XG5cbn0pKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItY29udGFpbmVyJykpOyIsIlxuLy8gdGFiLXN3aXBlclxuXG4oIHRhYnMgPT57XG5cblx0aWYoIXRhYnMubGVuZ3RoKSB7XG5cblx0XHRyZXR1cm47XG5cblx0fVxuXG5cdEFycmF5LmZyb20odGFicywgdGFiID0+IHtcblxuXHRcdGNvbnN0IGJ0bnMgPSB0YWIucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1zd2lwZXJfX2J0bicpLFxuXHRcdFx0ICBpdGVtcyA9IHRhYi5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLXN3aXBlcl9faXRlbScpO1xuXG5cdFx0QXJyYXkuZnJvbShidG5zLCBidG4gPT4ge1xuXG5cdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRcdFx0QXJyYXkuZnJvbShidG5zLCAoX2J0biwgaW5kZXgpID0+IHtcblxuXHRcdFx0XHRcdF9idG4uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgX2J0biA9PT0gYnRuKTtcblx0XHRcdFx0XHRpdGVtc1tpbmRleF0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgX2J0biA9PT0gYnRuKTtcblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSk7XG5cblx0XHR9KTtcblxuXHR9KTtcblxufSkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1zd2lwZXInKSk7XG5cblxuXG4vLyB0YWJzXG5cbmlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWJzJykpIHtcblxuXHRBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzJyksICh0YWIpID0+IHtcblxuXHRcdGxldCBidG4gPSB0YWIucXVlcnlTZWxlY3RvckFsbCgnLnRhYnNfX2J0bicpLFxuXHRcdFx0aXRlbSA9IHRhYi5xdWVyeVNlbGVjdG9yQWxsKCcudGFic19faXRlbScpLFxuXHRcdFx0bmF2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0XHRBcnJheS5mcm9tKGJ0biwgKGVsLGluZGV4KSA9PiB7XG5cblx0XHRcdGNvbnN0IF9idG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuXHRcdFx0X2J0bi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdidXR0b24nKTtcblxuXHRcdFx0X2J0bi5jbGFzc05hbWUgPSAnYnV0dG9uIHRhYnNfX25hdi1idG4nO1xuXG5cdFx0XHRfYnRuLnRleHRDb250ZW50ID0gZWwudGV4dENvbnRlbnQ7XG5cblx0XHRcdG5hdi5hcHBlbmRDaGlsZChfYnRuKTtcblxuXHRcdFx0ZWwuY2xhc3NMaXN0LmFkZCgndmlzdWFsbHloaWRkZW4nKTtcblxuXHRcdFx0X2J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdFx0XHRBcnJheS5mcm9tKGl0ZW0sIChlbGVtLGlueCkgPT4ge1xuXG5cdFx0XHRcdFx0YnRuW2lueF0uY2xhc3NMaXN0LnRvZ2dsZSgndGFic19fbmF2LWJ0bi0tYWN0aXZlJywgaW54ID09PSBpbmRleCk7XG5cdFx0XHRcdFx0ZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCd0YWJzX19pdGVtLS1hY3RpdmUnLCBpbnggPT09IGluZGV4KTtcblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSk7XG5cblx0XHR9KTtcblxuXHRcdG5hdi5jbGFzc0xpc3QuYWRkKCd0YWJzX19uYXYnKTtcblxuXHRcdGJ0biA9IG5hdi5xdWVyeVNlbGVjdG9yQWxsKCcudGFic19fbmF2LWJ0bicpO1xuXG5cdFx0aXRlbVswXS5jbGFzc0xpc3QuYWRkKCd0YWJzX19pdGVtLS1hY3RpdmUnKTtcblx0XHRidG5bMF0uY2xhc3NMaXN0LmFkZCgndGFic19fbmF2LWJ0bi0tYWN0aXZlJyk7XG5cblx0XHR0YWIuaW5zZXJ0QmVmb3JlKG5hdiwgaXRlbVswXSk7XG5cblx0fSk7XG5cbn07Il19
