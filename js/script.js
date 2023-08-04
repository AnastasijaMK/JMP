$(document).ready(function() {

	// Корректировка высоты контента с учетом панелей браузера на моб устройствах
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);

	// Маски 
	$("input[type='tel']").mask("+7 (999) 999-99-99");
	// Перенос курсора в начало поля
	$.fn.setCursorPosition = function (pos) {
		if ($(this).get(0).setSelectionRange) {
			$(this).get(0).setSelectionRange(pos, pos);
		} else if ($(this).get(0).createTextRange) {
			var range = $(this).get(0).createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};
	$('input[type="tel"]').click(function () {
		if ($(this).val() == "+7 (___) ___-__-__") {
			$(this).setCursorPosition(4);
		}
	});


	// Главная страница. Основной слайдер
	$('.page__banner--slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		dots: true,
		arrows: false,
		infinite: true,
	});


	// Список товаров. Ползунок диапазона в фильтре
	$(".filter__block .slider__range").slider({
		range: true,
		min: 150,
		max: 16840,
		animate: "slow",
		values: [150, 16840],
		slide: function (event, ui) {
			let rangeFrom = ui.values[0];
			rangeFrom = rangeFrom.toLocaleString('ru');
			let rangeTo = ui.values[1];
			rangeTo = rangeTo.toLocaleString('ru');
			$(this).closest('.filter__block').find(".amount--from").val(rangeFrom);
			$(this).closest('.filter__block').find(".amount--to").val(rangeTo);
			checkFilter();
		}
	});

	// Список товаров. Корректировка положения ползунка при вводе параметров непосредственно в поле
	$("input.amount--from").on('input', function () {
		let rangeFrom = $(this).val();
		let rangeFromValidate = parseInt(rangeFrom.replace(/[^0-9]/g, '').trim());
		let rangeToValidate = parseInt($("#amount--to").val().replace(/[^0-9]/g, '').trim());
		let rangeFromForField = 0;
		let sliderRange = $(this).closest('.filter__block').find(".slider-range");

		if (rangeFrom == "") {
			sliderRange.slider("values", 0, 0);
			$(this).val("");
		} else {
			if (rangeFromValidate <= rangeToValidate) {
				rangeFromForField = rangeFromValidate.toLocaleString('ru');
			} else {
				rangeFromForField = rangeToValidate.toLocaleString('ru');
				rangeFromValidate = rangeToValidate;
			}
			sliderRange.slider("values", 0, rangeFromValidate);
			$(this).val(rangeFromForField);
		}
		checkFilter();
	});
	$("input.amount--to").on('input', function () {
		let rangeTo = $(this).val();
		let rangeToValidate = parseInt(rangeTo.replace(/[^0-9]/g, '').trim());
		let rangeFromValidate = parseInt($(this).closest('.filter__block').find(".amount--from").val().replace(/[^0-9]/g, '').trim());
		let rangeToForField = 0;
		let sliderRange = $(this).closest('.filter__block').find(".slider-range");

		if (rangeTo == "") {
			sliderRange.slider("values", 1, rangeFromValidate);
			$(this).val(rangeFromValidate);
		} else if (rangeToValidate > sliderRange.slider("option", "max")) {
			sliderRange.slider("values", 1, sliderRange.slider("option", "max"));
			$(this).val(sliderRange.slider("option", "max").toLocaleString('ru'));
		} else {
			if (rangeToValidate >= rangeFromValidate) {
				rangeToForField = rangeToValidate.toLocaleString('ru');
			} else {
				rangeToForField = rangeFromValidate.toLocaleString('ru');
				rangeToValidate = rangeFromValidate;
			}
			sliderRange.slider("values", 1, rangeToValidate);
			$(this).val(rangeToForField);
		}
		checkFilter();
	});


	// Список товаров. Устанавливаем исходные значения для фильтра с диапазоном
	$(".filter__block .slider__range").each(function () {
		let rangeFrom = $(this).slider("values", 0);
		let rangeTo = $(this).slider("values", 1);
		$(this).closest('.filter__block').find(".amount--from").val(rangeFrom.toLocaleString('ru'));
		$(this).closest('.filter__block').find(".amount--to").val(rangeTo.toLocaleString('ru'));
	});


	// Список товаров. Сброс параметров диапазона в фильтре
	function resetRange() {
		$(".filter__block .slider__range").each(function () {
			let rangeFromMin = $(this).slider("option", "min");
			let rangeToMax = $(this).slider("option", "max");
			$(this).closest('.filter__block').find(".amount--from").val(rangeFromMin.toLocaleString('ru'));
			$(this).closest('.filter__block').find(".amount--to").val(rangeToMax.toLocaleString('ru'));
			$(this).slider("values", [rangeFromMin, rangeToMax]);
		});
	};


	// Список товаров. Подсветка выбранных значений фильтра
	$('.filter__block--list li label').on('click', function (e) {
		e.preventDefault();
		if (e.target.classList.contains('filter__option--remove')) return;
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
		}
		checkFilter();
	});


	// Список товаров. Удаление выбранных значений фильтра
	$('.filter__block--list .filter__option--remove').on('click', function () {
		$(this).closest('label').removeClass('active');
		checkFilter();
	});


	// Список товаров. Если в фильтре что-то выбрано, появляется кнопка "Сбросить фильтры"
	function checkFilter() {
		var checkFilterIndicator = false;
		$('.filter__block').each(function () {
			if ($(this).find('label.active').length > 0) {
				checkFilterIndicator = true;
			}
		});
		$(".filter__block .slider__range").each(function () {
			let rangeFrom = parseInt($(this).closest('.filter__block').find(".amount--from").val().replace(/[^0-9]/g, '').trim());
			let rangeTo = parseInt($(this).closest('.filter__block').find(".amount--to").val().replace(/[^0-9]/g, '').trim());
			let rangeMin = $(this).slider("option", "min");
			let rangeMax = $(this).slider("option", "max");
			if (rangeFrom !== rangeMin || rangeTo !== rangeMax) {
				checkFilterIndicator = true;
			}
		});
		if (checkFilterIndicator) {
			$('.j-reset-filter').show();
			$('.popup__filter .j-apply-filter').text('Применить');
		} else {
			$('.j-reset-filter').hide();
			$('.popup__filter .j-apply-filter').text('Закрыть');
		}
	};


	// Список товаров. Сбросить фильтры
	$('.j-reset-filter').on('click', function () {
		$('.filter__block label.active').removeClass('active');
		$('.popup__filter .j-apply-filter').text('Закрыть');
		resetRange();
		$(this).hide();
	});


	// Определяем возможное количество товара к покупке из количества товара в палете
	if ($('.catalog__list').attr('data-view') == "list") {
		$('.catalog__list[data-view="list"] .catalog__item .catalog__item--number .number input').each(function () {
			var number = $(this).closest('.catalog__item').find('.catalog__item--package span').text().replace(' шт', '');
			$(this).val(number);
		});
	}
	if ($('.catalog__list').attr('data-view') == "blocks") {
		$('.catalog__list[data-view="blocks"] .catalog__item .catalog__item--number .number input').each(function () {
			var number = $(this).data('step');
			$(this).val(number);
		});
	}
	if ($('.catalog__item').closest('.catalog__item--slider').length > 0) {
		$('.catalog__item--slider .catalog__item .catalog__item--number .number input').each(function () {
			var number = $(this).data('step');
			$(this).val(number);
		});
	}
	if ($('body').find('.item__card').length > 0) {
		var number = $('.item__card--info .item__card--cart .number input').data('step');
		$('.item__card--info .number input').val(number);
	}


	// Список товаров. Выбор количества товара
	$('.number .number--minus').click(function (e) {
		e.preventDefault();
		var $input = $(this).closest('.number').find('input');
		if ($(this).closest('.catalog__list').attr('data-view') == "list") {
			var step = parseInt($(this).closest('.catalog__item').find('.catalog__item--package span').text().replace(' шт', ''));
		} else {
			var step = $input.data('step');
		}
		var count = parseInt($input.val()) - step;
		count = count < 1 ? step : count;
		if ($(this).closest('.catalog__item').length > 0) {
			$(this).closest('.catalog__item').find('.number input').val(count);
			var animatedButton = $(this).closest('.catalog__item').find('.j-add-to-cart');
			animateButton(animatedButton);
		} else {
			$(this).closest('.item__card').find('.number input').val(count);
			var animatedButton = $(this).closest('.item__card--cart').find('.j-add-to-cart');
			animateButton(animatedButton);
		}
		calcTotalCost();
		$input.change();
		if ($(this).closest('.basket__list').length > 0) {
			calcItemTotalPrice();
			calcBasketTotalPrice();
		}
		return false;
	});
	$('.number .number--plus').click(function (e) {
		e.preventDefault();
		var $input = $(this).closest('.number').find('input');
		if ($(this).closest('.catalog__list').attr('data-view') == "list") {
			var step = parseInt($(this).closest('.catalog__item').find('.catalog__item--package span').text().replace(' шт', ''));
		} else {
			var step = $input.data('step');
		}
		if ($(this).closest('.catalog__item').length > 0) {
			$(this).closest('.catalog__item').find('.number input').val(parseInt($input.val()) + step);
			if ($(this).closest('.catalog__list').attr('data-view') == "list") {
				$(this).closest('.catalog__item').find('.j-add-to-cart').each(function () {
					if ($(this).closest('.cell').is(':visible')) {
						var animatedButton = $(this);
						animateButton(animatedButton);
					}
				});
			} else {
				var animatedButton = $(this).closest('.catalog__item').find('.j-add-to-cart');
				animateButton(animatedButton);
			}
		} else {
			$(this).closest('.item__card').find('.number input').val(parseInt($input.val()) + step);
			var animatedButton = $(this).closest('.item__card--info').find('.j-add-to-cart');
			animateButton(animatedButton);
		}
		calcTotalCost();
		$input.change();
		if ($(this).closest('.basket__list').length > 0) {
			calcItemTotalPrice();
			calcBasketTotalPrice();
		}
		return false;
	});


	// Анимация кнопки "В корзине"
	function animateButton(button) {
		if (button.hasClass('active')) {
			if (button.hasClass('animated')) {
				button.removeClass('animated');
			}
			button.addClass('animated');
			button.find('.title').css('opacity', 0);
			button.find('.total').css('opacity', 0);
			setTimeout(() => {
				button.find('.title').css('opacity', 1);
				button.find('.total').css('opacity', 1);
			}, 300);
			setTimeout(() => {
				button.removeClass('animated');
			}, 1000);
		}
	};


	// Подсчет итоговой стоимости товара
	function calcTotalCost() {
		$('.catalog__item').each(function () {
			var itemPrice = parseInt($(this).find('.price--actual').first().text().replace('₽/шт', '').replace(/\s+/g, ''));
			if ($(this).closest('.catalog__list').attr('data-view') == "list") {
				if ($(window).width() > 767) {
					var itemQuantity = parseInt($(this).find('.cell[data-cell="number"] .catalog__item--number .number input').val());
				} else {
					var itemQuantity = parseInt($(this).find('.cell[data-cell="item"] .catalog__item--number .number input').val());
				}
			} else if ($(this).closest('.catalog__list').attr('data-view') == "blocks" ||
				$(this).closest('.catalog__item--slider').length > 0) {
				var itemQuantity = parseInt($(this).find('.catalog__item--cart .number input').val());
			}
			var itemPriceTotal = (itemPrice * itemQuantity).toLocaleString('ru');
			$(this).find('.j-add-to-cart .total').text('(' + itemPriceTotal + ' ₽)');
		});
		if ($('body').find('.item__card').length > 0) {
			var itemPrice = parseInt($('.item__card .price--actual').text().replace('₽/шт', '').replace(/\s+/g, ''));
			var itemQuantity = parseInt($('.item__card .number input').val());
			var itemPriceTotal = (itemPrice * itemQuantity).toLocaleString('ru');
			$('.item__card .j-add-to-cart .total').text('(' + itemPriceTotal + ' ₽)');
		}
	};
	calcTotalCost();


	// Добавить в корзину
	$('.j-add-to-cart').on('click', function (e) {
		e.preventDefault();
		if ($(this).hasClass('active')) return;
		if ($(this).closest('.catalog__item').length > 0) {
			$(this).closest('.catalog__item').find('.j-add-to-cart').addClass('active');
		} else {
			$(this).addClass('active');
		}
		// Анимация фона кнопки
		var parentOffset = $(this).offset(),
			relX = e.pageX - parentOffset.left,
			relY = e.pageY - parentOffset.top;
		$(this).find('.button--bg').css({top: relY, left: relX})
		// Анимация текста кнопки
		$(this).find('.title').css('opacity', 0);
		$(this).find('.total').css('opacity', 0);
		setTimeout(() => {
			if ($(this).closest('.catalog__item').length > 0) {
				$(this).closest('.catalog__item').find('.j-add-to-cart .title').text('В корзине');
			} else {
				$(this).find('.title').text('В корзине');
			}
			$(this).find('.title').css('opacity', 1);
			$(this).find('.total').css('opacity', 1);
		}, 300);
	});


	// Подсчет высоты названия товара в плиточном отображении
	function calcItemNameHeight() {
		if ($('.catalog__list').attr('data-view') == "blocks") {
			var itemTitleMaxHeight = 0;
			$('.catalog__list[data-view="blocks"] .catalog__item').each(function (index) {
				if ($(window).width() > 767) {
					if ($(window).width() > 1499) {
						if (index % 4 == 0) {
							$('.catalog__item.calculated .catalog__item--info > .title').height(itemTitleMaxHeight);
							$('.catalog__item.calculated').removeClass('calculated');
							itemTitleMaxHeight = 0;
						}
					} else {
						if (index % 3 == 0) {
							$('.catalog__item.calculated .catalog__item--info > .title').height(itemTitleMaxHeight);
							$('.catalog__item.calculated').removeClass('calculated');
							itemTitleMaxHeight = 0;
						}
					}
				} else {
					if (index % 2 == 0) {
						$('.catalog__item.calculated .catalog__item--info > .title').height(itemTitleMaxHeight);
						$('.catalog__item.calculated').removeClass('calculated');
						itemTitleMaxHeight = 0;
					}
				}

				$(this).find('.catalog__item--info > .title').height('auto');
				var itemTitleHeight = $(this).find('.catalog__item--info > .title').height();
				$(this).addClass('calculated');
				itemTitleMaxHeight = itemTitleHeight > itemTitleMaxHeight ? itemTitleHeight : itemTitleMaxHeight;
				if (index == $('.catalog__item').length - 1) {
					$('.catalog__item.calculated .catalog__item--info > .title').height(itemTitleMaxHeight);
					$('.catalog__item.calculated').removeClass('calculated');
				}
			});
		}
		$('.catalog__item--slider').each(function () {
			$(this).find('.catalog__item').each(function (index) {
				if (index == $(this).closest('.catalog__item--slider').find('.catalog__item').length - 1) {
					$(this).closest('.catalog__item--slider').find('catalog__item .catalog__item--info > .title').height(itemTitleMaxHeight);
					return;
				}
				$(this).find('.catalog__item--info > .title').height('auto');
				var itemTitleHeight = $(this).find('.catalog__item--info > .title').height();
				itemTitleMaxHeight = itemTitleHeight > itemTitleMaxHeight ? itemTitleHeight : itemTitleMaxHeight;
				if (index == $(this).closest('.catalog__item--slider').find('.catalog__item').length - 1) {
					$(this).closest('.catalog__item--slider').find('catalog__item .catalog__item--info > .title').height(itemTitleMaxHeight);
				}
			});
		});
	};

	// Подсчет высоты названия товара в слайдере
	function calcItemNameHeightSlider() {
		var itemTitleMaxHeight = 0;
		$('.catalog__item--slider').each(function () {
			$(this).find('.catalog__item').each(function (index) {
				$(this).find('.catalog__item--info > .title').height('auto');
				var itemTitleHeight = $(this).find('.catalog__item--info > .title').height();
				itemTitleMaxHeight = itemTitleHeight > itemTitleMaxHeight ? itemTitleHeight : itemTitleMaxHeight;
				if (index == ($(this).closest('.catalog__item--slider').find('.catalog__item').length - 1)) {
					$(this).closest('.catalog__item--slider').find('.catalog__item .catalog__item--info > .title').height(itemTitleMaxHeight);
				}
			});
		});
	};
	calcItemNameHeight();
	setTimeout(() => {
		calcItemNameHeightSlider();
	}, 300);
	$(window).resize(function () {
		calcItemNameHeight();
		calcItemNameHeightSlider();
	});


	// Подсчет высоты карточек товара в плиточном отображении и слайдерах
	function calcItemHeight() {
		if ($('.catalog__list').attr('data-view') == "blocks") {
			$('.catalog__list[data-view="blocks"] .catalog__item').each(function () {
				var itemHeight = $(this).find('.catalog__item--img').outerHeight(true) + $(this).find('.catalog__item--info').outerHeight(true) + 20;
				$(this).height(itemHeight);
			});
		}
		if ($('body').find('.catalog__item--slider').length > 0) {
			$('.catalog__item--slider .catalog__item').each(function () {
				var itemHeight = $(this).find('.catalog__item--img').outerHeight(true) + $(this).find('.catalog__item--info').outerHeight(true) + 20;
				$(this).height(itemHeight);
			});
		}
	};
	setTimeout(() => {
		calcItemHeight();
	}, 400);
	$(window).resize(function () {
		calcItemHeight();
	});


	// Список товаров. Скрыть/раскрыть список разделов в боковом меню
	$('aside .catalog__sections .group--title-button').on('click', function () {
		if ($(this).closest('li').hasClass('group--list')) {
			var listInnerHeight = $(this).closest('li').children('.group--list-inner').children('ul').outerHeight(true) +
				$(this).closest('li').children('.group--list-inner').children('.catalog__section--button').outerHeight(true);
			$(this).closest('li').children('.group--list-inner').height(listInnerHeight);
			if ($(this).closest('li').hasClass('active')) {
				$(this).closest('li').removeClass('active');
				$(this).closest('li').find('li.active').removeClass('active');
				$(this).closest('li').find('.catalog__section--button.active').removeClass('active');
				$(this).closest('li').find('.group--list-inner').height("");
			} else {
				$(this).closest('li').addClass('active');
			}
			calcCatalogListHeight();
		}
	});


	// Список товаров. Добавляем "Смотреть все" для длинных списков в разделах бокового меню
	$('aside .catalog__sections ul ul').each(function () {
		var listHeight = 0;
		$(this).children('li').each(function () {
			listHeight += $(this).outerHeight(true);
		});
		var listHeightMax = parseInt($(this).css('max-height').replace('px', ''));
		if (listHeight > listHeightMax) {
			$(this).after('<div class="catalog__section--button"><span>Смотреть все</span><span>Свернуть</span></div>')
		}
	});


	// Подсчет высоты открытых списков в боковом меню
	function calcCatalogListHeight() {
		$('aside .catalog__sections li.active').each(function () {
			if (!$(this).children('.group--list-inner').children('.catalog__section--button').hasClass('active')) {
				$(this).children('.group--list-inner').children('ul').css('max-height', '');
				$(this).children('.group--list-inner').children('ul').css('max-height', '+=' + $(this).children('.group--list-inner').children('ul').children('li.active').children('.group--list-inner').outerHeight(true) + "px");
			}

			var listInnerHeight = $(this).children('.group--list-inner').children('ul').outerHeight(true);
			var listInnerHeightTotal = listInnerHeight + $(this).children('.group--list-inner').children('.catalog__section--button').outerHeight(true);
			$(this).children('.group--list-inner').height(listInnerHeightTotal);
		});
	};
	calcCatalogListHeight();


	// Список товаров. Смотреть все/Свернуть в разделах бокового меню
	$('aside .catalog__section--button').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			calcCatalogListHeight();
		} else {
			$(this).addClass('active');
			$(this).prev('ul').css('max-height', 'none');
			var listInnerHeight = $(this).closest('.group--list-inner').children('ul').outerHeight(true);
			var listInnerHeightTotal = listInnerHeight + $(this).closest('.group--list-inner').children('.catalog__section--button').outerHeight(true);
			$(this).closest('.group--list-inner').height(listInnerHeightTotal);
		}
	});


	// Слайдер товаров
	// (предусмотрено расположение нескольких одинаковых слайдеров на одной странице)
	let arrowPrev = $('.catalog__item--slider .slider__arrow--prev');
	let arrowNext = $('.catalog__item--slider .slider__arrow--next');
	for (let i = 0; i <= (arrowPrev.length - 1); i++) {
		arrowPrev[i].setAttribute('data-prev', i);
		arrowNext[i].setAttribute('data-next', i);
	};

	$('.catalog__item--slider-inner').each(function (index) {
		if ($(this).closest('.catalog__item--slider').hasClass('catalog__item--slider-big')) {
			$(this).slick({
				slidesToShow: 5,
				slidesToScroll: 1,
				dots: false,
				arrows: true,
				prevArrow: $('.slider__arrow--prev[data-prev="' + index + '"]'),
				nextArrow: $('.slider__arrow--next[data-next="' + index + '"]'),
				infinite: true,
				variableWidth: true,
				draggable: true,
				swipeToSlide: true,
				responsive: [
					{
						breakpoint: 1500,
						settings: {
							slidesToShow: 4,
						}
					},
					{
						breakpoint: 1199,
						settings: "unslick"
					}
				]
			});
		} else {
			$(this).slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				dots: false,
				arrows: true,
				prevArrow: $('.slider__arrow--prev[data-prev="' + index + '"]'),
				nextArrow: $('.slider__arrow--next[data-next="' + index + '"]'),
				fade: false,
				infinite: true,
				variableWidth: true,
				responsive: [
					{
						breakpoint: 1500,
						settings: {
							slidesToShow: 3,
						}
					},
					{
						breakpoint: 1199,
						settings: "unslick"
					}
				]
			});
		}
	});


	// Определение высоты слайдера при наведении на карточку товара внутри него
	$('.catalog__item--slider .catalog__item').on('mouseenter', function () {
		if($(window).width() > 1199) {
			let sliderPaddingBottom = +$(this).closest('.catalog__item--slider-inner').css('padding-bottom').replace('px','');
			$(this).closest('.catalog__item--slider-inner').css('padding-bottom', '0');
			$(this).closest('.catalog__item--slider-inner').height($(this).closest('.catalog__item--slider-inner').outerHeight(true) + sliderPaddingBottom);
			var cardItemHeight = $(this).outerHeight(true);
			var cardItemInnerHeight = $(this).children('a').outerHeight(true);
			var sliderPadding = $(this).closest('.slick-list').css('padding');
			sliderPadding = parseInt(sliderPadding.replace('px', ''));
			$(this).closest('.slick-list').height(cardItemInnerHeight);
		}
	});
	$('.catalog__item--slider .catalog__item').on('mouseleave', function () {
		if($(window).width() > 1199) {
			$(this).closest('.slick-list').height('');
			$(this).closest('.catalog__item--slider-inner').height('');
			$(this).closest('.catalog__item--slider-inner').css('padding-bottom', '');
		}
	});


	// Определение ширины карточки товара в слайдере исходя из ширины экрана
	function calcItemCardWidth() {
		$('.catalog__item--slider').each(function () {
			var contentWidth = $(this).outerWidth(true);
			var itemCardMarginRight = $(this).find('.catalog__item').css('margin-right');
			itemCardMarginRight = parseInt(itemCardMarginRight.replace('px', ''));
			var itemCardAmount = $(this).find('.catalog__item.slick-active').length;
			var itemCardWidth = contentWidth / itemCardAmount - (itemCardMarginRight * (itemCardAmount - 1)) / itemCardAmount;
			$(this).find('.catalog__item').width(itemCardWidth);
		});
	}

	if ($(window).width() > 1199) {
		calcItemCardWidth();
	}
	$(window).resize(function () {
		if ($(window).width() > 1199) {
			calcItemCardWidth();
		}
	});


	// Детальная страница товара. Слайдер товаров. Основной
	$('.item__card--photo .slider__for').each(function () {
		$(this).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: false,
			arrows: false,
			fade: true,
			infinite: true,
			asNavFor: $('.item__card--photo .slider__nav'),
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						dots: true,
					}
				},
			]
		});
	});

	// Детальная страница товара. Слайдер товаров. Навигация
	$('.item__card--photo .slider__nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: $('.item__card--photo .slider__for'),
		dots: false,
		arrows: true,
		prevArrow: $('.slider__nav--wrap .slider__nav--arrow-prev'),
		nextArrow: $('.slider__nav--wrap .slider__nav--arrow-next'),
		variableHeight: true,
		focusOnSelect: true,
		accessibility: true,
		vertical: true,
		verticalSwiping: true,
		infinite: true,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					touchMove: true,
				}
			},
		]
	});


	// Сдвигаем календарь
	$('body').on('mousedown', '.datepicker--nav-title, .datepicker--nav-action, .datepicker--cell', function () {
		setTimeout(() => {
			calcDatepickerShift();
		}, 140);

	});


	// Подстановка даты поставки
	moment.locale('ru');
	var deliveryDate = moment().format('DD.MM.yyyy');
	$('.datepicker-here').val(deliveryDate);
	$('.datepicker-here').attr('data-date', deliveryDate);


	// Корзина. Выбор даты поставки
	$('body').on('mousedown', '.datepicker-here', function () {
		$('.datepickers-container').css('opacity', '0');
	});
	// Задаем дни, в которые поставка невозможна
	var disabledDays = [
		[1, 1],
		[7, 1],
		[23, 2],
		[8, 3],
		[1, 5],
		[9, 5],
		[12, 6],
		[4, 11]
	];
	$('body').on('click', '.datepicker-here', function () {
		$('.datepickers-container').css('opacity', '1');
		// Запоминаем исходное значение, чтобы можно было вернуть его при отмене
		let datepickerVal = $(this).val();

		$(this).datepicker({
			minDate: new Date(),
			changeMonth: true,
			changeYear: true,
			dateFormat: 'dd.mm.yyyy',
			onChangeMonth: function () {
				calcDatepickerShift();
			},
			onChangeYear: function () {
				calcDatepickerShift();
			},
			onSelect: function () {
				calcDatepickerShift();
			},
			onChangeView: function () {
				calcDatepickerShift();
			},
			onRenderCell: function (date, cellType) {
				for (var i = 0; i < disabledDays.length; i++) {
					if (cellType == 'day' && disabledDays[i][0] == date.getDate() && disabledDays[i][1] - 1 == date.getMonth()) {
						return {
							disabled: true
						}
					}
				}
			}
		});

		$(this).focus();
		$(this).attr('data-date', datepickerVal);
		$(this).val(datepickerVal);
		if ($('#datepickers-container').find('.datepicker.active').find('.datepicker--buttons').length < 1) {
			$('#datepickers-container').find('.datepicker.active').append('<div class="datepicker--buttons"><button class="apply">Применить</button><button class="cancel">Отмена</button></div>');
		}
		$(this).addClass('active');
		calcDatepickerShift();
	});


	// Сдвигаем календарь, если он не полностью находится в зоне видимости
	function calcDatepickerShift() {
		var datepickerHere = document.querySelector('.datepicker-here');
		var datepicker = document.querySelector('.datepicker.active');
		var datepickerLeft = datepicker.getBoundingClientRect().left + datepicker.offsetWidth;
		var datepickerTop = datepicker.getBoundingClientRect().top + datepicker.offsetHeight + pageYOffset;
		var contentWidth = $('.content__main').width();
		var windowHeight = $(window).height() + pageYOffset;

		if (datepickerLeft > contentWidth) {
			var datepickershift = datepickerHere.getBoundingClientRect().left + datepickerHere.offsetWidth - datepicker.offsetWidth;
			$('.datepicker.active').css('left', datepickershift + 'px');
		}

		if (datepickerTop > windowHeight) {
			var windowScroll = pageYOffset + (datepickerTop - windowHeight);
			$('html, body').stop().animate({
				scrollTop: windowScroll
			}, 500);
		}
	};

	// Кнопка "Применить" в календаре
	$('body').on('click', '.datepicker--buttons .apply', function () {
		$(this).closest('.datepicker').removeClass('active');
		$(this).closest('.datepicker').css('left', '-100000px');
		$('body').css('overflow', 'auto');
		// Запоминаем значение, чтобы можно было вернуть его при отмене
		let datepickerVal = $(this).closest('.datepicker').find('.datepicker--cell.-selected-').text();
		$('.datepicker-here.active').attr('data-date', datepickerVal);
		$('.datepicker-here.active').removeClass('active');
	});

	// Кнопка "Отмена" в календаре
	$('body').on('click', '.datepicker--buttons .cancel', function () {
		$(this).closest('.datepicker').removeClass('active');
		$(this).closest('.datepicker').css('left', '-100000px');
		$('body').css('overflow', 'auto');
		// Возвращаем исходное значение
		let datepickerVal = $('.datepicker-here.active').attr('data-date');
		$('.datepicker-here.active').val(datepickerVal);
		$('.datepicker-here.active').removeClass('active');
	});

	// Корзина. Удалить товар
	$('body').on('click', '.j-remove-from-cart', function (e) {
		e.preventDefault();
		$(this).closest('.catalog__item').remove();
		calcItemsInCart();
		calcBasketTotalPrice();
		if(document.querySelectorAll('.basket__list .catalog__item').length === 0) {
			document.querySelector('.basket__wrap').classList.add('basket__wrap--empty');
			let emptyBasketInfo = document.createElement('div');
			emptyBasketInfo.className = 'basket__wrap_inner';
			emptyBasketInfo.innerHTML = '<p>В Вашей корзине еще нет товаров...</p><a href="catalog.html" class="return-to-catalog">Вернуться в каталог</a>';
			document.querySelector('.basket__wrap').append(emptyBasketInfo);
		}
	});

	// Корзина. Склонение слова
	function getNoun(number, one, two, five) {
		number = Math.abs(number);
		number %= 100;
		if (number >= 5 && number <= 20) {
			return five;
		}
		number %= 10;
		if (number == 1) {
			return one;
		}
		if (number >= 2 && number <= 4) {
			return two;
		}
		return five;
	}

	// Корзина. Подсчет количества товаров в корзине
	function calcItemsInCart() {
		var itemNumber = $('.basket__list .catalog__item').length;
		$('.basket__total .basket__total--title .item--total').text('[ ' + itemNumber + ' ' + getNoun(itemNumber, 'товар', 'товара', 'товаров') + ' ]');
		if ($('body').hasClass('body--order')) {
			$('.order--header span').text('[ ' + itemNumber + ' ' + getNoun(itemNumber, 'товар', 'товара', 'товаров') + ' ]');
			$('.order__block[data-order="item-list"] .order__block--subtitle').text('[ ' + itemNumber + ' ' + getNoun(itemNumber, 'товар', 'товара', 'товаров') + ' ]');
		}
	}

	calcItemsInCart();

	// Корзина. Подсчет итоговой стоимости по каждому товару
	function calcItemTotalPrice() {
		$('.basket__list .catalog__item').each(function () {
			var itemPrice = $(this).find('.price--actual').first().text().replace(' ₽/шт', '');
			itemPrice = parseInt(itemPrice.replace(/[^0-9]/g, '').trim());
			var itemNumber = $(this).find('.number').first().find('input').val();
			var itemTotalPrice = itemPrice * itemNumber;
			$(this).find('.cell[data-cell="total"] > span').html(itemTotalPrice.toLocaleString('ru') + "<span> ₽</span>");
		});
	}

	calcItemTotalPrice();

	// Корзина. Подсчет итоговой стоимости корзины
	function calcBasketTotalPrice() {
		var basketTotal = 0;
		var saleTotal = 0;
		$('.basket__list .catalog__item').each(function () {
			var itemTotalPrice = $(this).find('.cell[data-cell="total"]').text().replace(' ₽/шт', '');
			itemTotalPrice = parseInt(itemTotalPrice.replace(/[^0-9]/g, '').trim());
			basketTotal += itemTotalPrice;

			if ($(this).find('.catalog__item--price.discount').length > 0) {
				var itemNumber = $(this).find('.number').first().find('input').val();
				var itemOldPrice = $(this).find('.catalog__item--price.discount .price--old').text().replace(' ₽', '');
				itemOldPrice = parseInt(itemOldPrice.replace(/[^0-9]/g, '').trim());
				var itemNewPrice = $(this).find('.catalog__item--price.discount .price--actual').text().replace(' ₽/шт', '');
				itemNewPrice = parseInt(itemNewPrice.replace(/[^0-9]/g, '').trim());
				var itemSale = (itemOldPrice - itemNewPrice) * itemNumber;
				saleTotal += itemSale;
			}
		});

		$('.basket__wrap .basket__total--row.total .value').text(basketTotal.toLocaleString('ru') + ' ₽');
		$('.basket__wrap .basket__total--row.sale .value').text('- ' + saleTotal.toLocaleString('ru') + ' ₽');
		$('.basket__wrap .basket__total--button .value').text((basketTotal - saleTotal).toLocaleString('ru') + ' ₽');

	}

	calcBasketTotalPrice();


	// Оформление заказа. Подсчет итоговой стоимости
	function calcOrderTotalPrice() {
		var orderTotal = 0;
		var saleTotal = 0;
		$('.order__block[data-order="item-list"] .catalog__item').each(function () {
			if ($(this).find('.cell[data-cell="final"]').hasClass('discount')) {
				var itemTotalPrice = $(this).find('.cell[data-cell="final"] .total--old').text();
			} else {
				var itemTotalPrice = $(this).find('.cell[data-cell="final"] .total--actual').text();
			}

			itemTotalPrice = parseInt(itemTotalPrice.replace(/[^0-9]/g, '').trim());
			orderTotal += itemTotalPrice;

			if ($(this).find('.cell[data-cell="final"]').hasClass('discount')) {
				var itemNewTotalPrice = $(this).find('.cell[data-cell="final"] .total--actual').text();
				itemNewTotalPrice = parseInt(itemNewTotalPrice.replace(/[^0-9]/g, '').trim());
				var itemTotalSale = itemTotalPrice - itemNewTotalPrice;
				saleTotal += itemTotalSale;
			}
		});
		var deliveryTarif = $('.order__block[data-order="delivery"] .delivery__block.active').attr('data-tarif');
		if (deliveryTarif == "бесплатно") {
			deliveryTarif = '0 ₽';
		}
		var deliveryTotal = parseInt(deliveryTarif.replace(' ₽', '').replace(/[^0-9]/g, '').trim());

		$('.basket__wrap .basket__total--row.total .value').text(orderTotal.toLocaleString('ru') + ' ₽');
		$('.basket__wrap .basket__total--row.sale .value').text('- ' + saleTotal.toLocaleString('ru') + ' ₽');
		$('.basket__wrap .basket__total--row.delivery .value').text(deliveryTarif);
		$('.basket__wrap .basket__total--button .value').text((orderTotal - saleTotal + deliveryTotal).toLocaleString('ru') + ' ₽');

	}

	if ($('body').hasClass('body--order')) {
		calcOrderTotalPrice();
	}


	// Выпадающее окно. Открытие
	$('body').on('click', '.parameter__field > label', function (e) {
		e.preventDefault();
		$(this).removeClass('warning');
		$(this).find('.input--error').remove();
		if ($(this).find('.picker__button').hasClass('active')) {
			$(this).find('.picker__button').removeClass('active');
			$(this).closest('.parameter__field').removeClass('active');
			$(this).closest('.parameter__field').find('.parameter__field--list').removeClass('active');
			$(this).closest('.parameter__field').find('.parameter__field--list').height(0);
		} else {
			$('body .picker__button.active').removeClass('active');
			$('body .parameter__field--list.active').height('');
			$('body .parameter__field--list.active').removeClass('active');
			$('body .parameter__field.active').removeClass('active');
			$(this).find('.picker__button').addClass('active');
			$(this).closest('.parameter__field').addClass('active');
			$(this).closest('.parameter__field').find('.parameter__field--list').addClass('active');
			var filterInnerHeight = $(this).closest('.parameter__field').find('.parameter__field--wrap').outerHeight();
			$(this).closest('.parameter__field').find('.parameter__field--list').height(filterInnerHeight);
		}
		//Проверка на необходиомсть "дымки"
		var filterWrap = $(this).closest('.parameter__field').find('.parameter__field--list .parameter__field--inner').height();
		var filterList = $(this).closest('.parameter__field').find('.parameter__field--list .parameter--list').outerHeight();
		if (filterList > filterWrap) {
			$(this).closest('.parameter__field').find('.parameter__field--list .parameter__field--inner').addClass('hidden');
		}
		setTimeout(() => {
			checkListVisibility();
		}, 300);
	});

	// Проверка выпадающего списка на видимость в окне
	function checkListVisibility() {
		var elementList = document.querySelector('.parameter__field .parameter__field--list.active');
		var elementListTop = window.pageYOffset + elementList.getBoundingClientRect().top + elementList.offsetHeight;
		var windowTop = window.pageYOffset + document.documentElement.clientHeight;
		if (elementListTop > windowTop) {
			var scrollValue = window.pageYOffset + (elementListTop - windowTop);
			$('html, body').animate({
				scrollTop: scrollValue + 10
			}, 300);
		}
	};

	// Выпадающее окно. Выбор
	$('body').on('click', '.parameter__field .parameter__field--list label', function () {
		$(this).closest('.parameter--list').find('.selected').removeClass('selected');
		$(this).addClass('selected');
		var labelVal = $(this).find('span').text();
		$(this).closest('.parameter__field').find('.picker__button').val(labelVal);
		$(this).closest('.parameter__field').find('.picker__button').removeClass('active');
		$(this).closest('.parameter__field--list').removeClass('active');
		$(this).closest('.parameter__field').removeClass('active');
		$(this).closest('.parameter__field--list').css('height', 0);
	});

	// Выпадающее окно. Действие при скролле
	$('.parameter__field .parameter__field--inner').scroll(function () {
		var scrollTopNav = Math.round($(this).find('.parameter--list').position().top);
		var scrollTopWrap = Math.round($(this).height() - $(this).find('.parameter--list').height());
		if (scrollTopNav == scrollTopWrap) {
			$(this).addClass('scroll-to-end');
		} else {
			$(this).removeClass('scroll-to-end');
		}
	});

	// Выпадающее окно. Закрытие окна при клике вне его
	$(document).mousedown(function (e) {
		var modalClient = $(".parameter__field--list");
		var modalOpen = $(modalClient).closest('.parameter__field').children('label');
		if (modalClient.hasClass('active')) {
			if (!modalClient.is(e.target) && modalClient.has(e.target).length === 0 && !modalOpen.is(e.target) && modalOpen.has(e.target).length === 0) {
				$('.parameter__field--list.active').height('0');
				$('.parameter__field--list.active').parent().find('.picker__button').removeClass('active');
				$('.parameter__field--list.active').removeClass('active');
				$('.parameter__field.active').removeClass('active');
			}
		}
	});


	// Оформление заказа. Выбор доставки и оплаты
	$('.order__block .delivery__wrap .delivery__block').click(function () {
		if ($(this).find('input').prop('checked') == false) {
			$(this).closest('.delivery__wrap').find('.active').removeClass('active');
			$(this).closest('.delivery__block').addClass('active');
			if ($(this).closest('.order__block').attr('data-order') == 'delivery') {
				let deliveryTarif = $(this).data('tarif');
				$(this).closest('.order__block--body').find('.delivery__point[data-point="tarif"] .value').text(deliveryTarif);
				if ($(this).find('input').val() == "Самовывоз") {
					$(this).closest('.order__block--body').find('label[data-label="address"]').addClass('not-active');
				} else {
					$(this).closest('.order__block--body').find('label[data-label="address"]').removeClass('not-active');
					if ($(this).find('input').val() == "Авиа") {
						$(this).closest('.order__block--body').find('label[data-label="address"] span').text('Город доставки:');
						$(this).closest('.order__block--body').find('label[data-label="address"] textarea').attr('placeholder', 'Введите город...');
					} else if ($(this).find('input').val() == "Авто") {
						$(this).closest('.order__block--body').find('label[data-label="address"] span').text('Адрес доставки:');
						$(this).closest('.order__block--body').find('label[data-label="address"] textarea').attr('placeholder', 'Введите адрес...');
					}
				}
				calcOrderTotalPrice();
			}
		}
	});


	// Оформление заказа. Подстановка исходной стоимости доставки
	let deliveryTarif = $('.order__block[data-order="delivery"] .delivery__block.active').data('tarif');
	$('.order__block[data-order="delivery"] .delivery__point[data-point="tarif"] .value').text(deliveryTarif);
	if ($('.order__block[data-order="delivery"] .delivery__block.active input').val() == "Самовывоз") {
		$('.order__block[data-order="delivery"] label[data-label="address"]').addClass('not-active');
	}


	// Оформление заказа. Адрес доставки. Увеличение поля ввода в высоту
	$('body').on('input', ' label[data-label="address"] textarea', function (e) {
		this.style.height = '1px';
		this.style.height = (this.scrollHeight + 1) + 'px';
	});


	// Оформление заказа. Оформить
	$('.j-set-an-order').click(function () {
		$('.basket__list .warning').removeClass('warning');
		$('.basket__list input:required').each(function () {
			if ($(this).val() == "") {
				$(this).closest('label').addClass('warning');
				$(this).closest('label').append('<span class="input--error">Заполните это поле</span>');
			} else if ($(this).attr('type') == "email") {
				let patternMail = /^([a-z0-9_-]+\.)?[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
				if ($(this).val().search(patternMail) !== 0) {
					$(this).closest('label').addClass('warning');
					$(this).closest('label').append('<span class="input--error">Укажите корректный адрес</span>');
				}
			}
		});
		$('.basket__list textarea:required').each(function () {
			if ($(this).val() == "" && !$(this).closest('label').hasClass("not-active")) {
				$(this).closest('label').addClass('warning');
				$(this).closest('label').append('<span class="input--error">Заполните это поле</span>');
			}
		});
		var warningField = $('.basket__list .warning').length;

		if (warningField > 0) {
			checkWarningVisibility();
		} else {
			window.location.href = 'thanks_for_order.html';
		}
	});

	// Прокрутка к незаполненным полям
	function checkWarningVisibility() {
		var warningFieldFirst = document.querySelector('.warning');
		var warningFieldFirstTop = warningFieldFirst.getBoundingClientRect().top;
		if (warningFieldFirstTop < 0) {
			var windowScroll = window.pageYOffset + warningFieldFirstTop;
			$('html, body').animate({
				scrollTop: windowScroll - 40
			}, 500);
		}
	};


	// Убираем предупреждение о заполнении поля по клику на него
	$('.order__block[data-order="contacts"] input,' +
		'.order__block[data-order="delivery"] textarea').on('click', function () {
		if ($(this).closest('label').hasClass('warning')) {
			$(this).closest('label').removeClass('warning');
			$(this).closest('label').find('.input--error').remove();
		}
	});


	// Авторизация
	$('.header__main--account').click(function () {
		if ($(window).width() < 768) {
			// Запрет прокрутки на моб устройствах
			$('body').css('position', 'fixed');
		}
		$('.wrapper__shadow').addClass('active');
		$('.popup[data-popup="authorization"]').addClass('active');
	});


	// Заказать звонок/ Обратная связь
	const feedbackButton = document.querySelectorAll('.j-request-a-call');
	const feedbackForm = document.querySelector('.popup[data-popup="feedback"]');
	for(let i=0; i<feedbackButton?.length; i++) {
		feedbackButton[i].addEventListener('click',()=>{
			if(document.documentElement.clientWidth < 768) {
				document.body.style.position = 'fixed';
			}
			document.querySelector('.wrapper__shadow').classList.add('active');
			feedbackForm?.classList.add('active');
		});
	}


	// Закрытие всплывающих окон
	$('.wrapper__shadow, .popup__close').click(function () {
		$('.wrapper__shadow').css('opacity', '');
		$('.popup').css('opacity', '');
		$('body').css('position', '');
		setTimeout(() => {
			$('.wrapper__shadow').removeClass('active');
			$('.popup').removeClass('active');
			$('.popup input').val('');
		}, 300);
		$('.popup__filter').removeClass('active');
	});


	// Скрыть/показать пароль
	$('.popup .form__field .password--visibility').click(function () {
		if ($(this).hasClass('active')) {
			$(this).closest('.form__field').find('input').attr('type', 'password');
		} else {
			$(this).closest('.form__field').find('input').attr('type', 'text');
		}
		$(this).toggleClass('active');
	});

	// Авторизация. Войти
	$('.popup .j-log-in').click(function (e) {
		e.preventDefault();
		let loginValue = $('.popup.active input[name="LOGIN"]').val();
		let passwordValue = $('.popup.active input[name="PASSWORD"]').val();
		if (loginValue.trim() == "") {
			$('.popup .form__field[data-field="name"]').addClass('warning');
			$('.popup .form__field[data-field="name"] .input--error').text('Введите логин');
		} else {
			$('.popup .form__field[data-field="name"]').addClass('warning');
			$('.popup .form__field[data-field="name"] .input--error').text('Пользователь не найден');
		}
		if (passwordValue.trim() == "") {
			$('.popup .form__field[data-field="password"]').addClass('warning');
			$('.popup .form__field[data-field="password"] .input--error').text('Введите пароль');
		} else {
			$('.popup .form__field[data-field="password"]').addClass('warning');
			$('.popup .form__field[data-field="password"] .input--error').text('Введен неверный пароль');
		}
	});


	// Заказать звонок/Обратная связь. Отправить
	const sendCallbackRequestButton = document.querySelectorAll('.j-send-request');
	for(let i=0; i<sendCallbackRequestButton?.length; i++) {
		sendCallbackRequestButton[i].addEventListener('click',(e)=>{
			e.preventDefault();
			if(sendCallbackRequestButton[i].classList.contains('sent')) return;
			let readyToSent = true;
			let timerOnButton;
			const sendCallbackForm = sendCallbackRequestButton[i].closest('form');
			const sendCallbackFields = sendCallbackForm.querySelectorAll('input');
			for(let k=0; k<sendCallbackFields?.length; k++) {
				sendCallbackFields[k].closest('.form__field').classList.remove('warning');
				if(sendCallbackFields[k].hasAttribute('required') && sendCallbackFields[k].value.trim().length === 0) {
					sendCallbackFields[k].closest('.form__field').classList.add('warning');
					readyToSent = false;
				}
				sendCallbackFields[k].addEventListener('click',()=>{
					clearTimeout(timerOnButton);
					sendCallbackRequestButton[i].innerText = 'Отправить';
					sendCallbackRequestButton[i].classList.remove('sent');
				});
			}
			if(readyToSent) {
				sendCallbackRequestButton[i].innerText = 'Отправлено';
				sendCallbackRequestButton[i].classList.add('sent');
				for(let k=0; k<sendCallbackFields?.length; k++) {
					sendCallbackFields[k].value = '';
				}
				timerOnButton = setTimeout(()=>{
					sendCallbackRequestButton[i].innerText = 'Отправить';
					sendCallbackRequestButton[i].classList.remove('sent');
				}, 3000);
			}
		});
	}


	// Шапка. Открыть меню на планшет и моб версиях
	$('.j-open-menu').on('click', function (e) {
		if ($(window).width() < 1200) {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$('.popup__menu').removeClass('active inner--list-opened');
				$('header').removeClass('menu');
				$('body').css('position', '');
				$('.popup__menu li.active').removeClass('active');
				$('.popup__menu .popup__menu--back').removeClass('inner--level');
				$('.popup__menu .popup__menu--group ul li').css('display', '');
				$('.popup__menu .popup__menu--group ul li span').css('display', '');
				$('.popup__menu .popup__menu--group ul').css('display', '');
			} else {
				$(this).addClass('active');
				$('.popup__menu').addClass('active');
				$('header').addClass('menu');
				$('body').css('position', 'fixed');
				checkInnerList();
				$('html, body').scrollTop(0);
			}
		} else {
			e.preventDefault();
		}
	});


	// Моб. меню. Находим вложенные пункты
	function checkInnerList() {
		$('.popup__menu .popup__menu--group ul li').each(function () {
			if ($(this).children('ul').length > 0) {
				$(this).addClass('inner--list');
			}
		});
	}


	// Моб. меню. Открытие подпунктов
	$('.popup__menu li > span').on('click', function () {
		$(this).closest('.popup__menu').find('li.active').removeClass('active');
		$(this).closest('li').addClass('active');
		$(this).closest('.popup__menu').addClass('inner--list-opened');
		if ($(this).parent('li').closest('ul').parent('li').length > 0) {
			$(this).closest('.popup__menu').find('.popup__menu--back').addClass('inner--level');
			$(this).parent('li').closest('ul').parent('li').show();
			$(this).parent('li').closest('ul').show();
			$(this).parent('li').show();
			$(this).parent('li').closest('ul').parent('li').children('span').hide();
		} else {
			$(this).parent('li').children('ul').show();
			$(this).parent('li').parent('ul').children('li').css('display', '');
		}
	});


	// Моб. меню. Закрытие подпунктов
	$('.popup__menu .popup__menu--back').on('click', function () {
		if ($('.popup__menu li.active').parent('ul').parent('li').length > 0) {
			$('.popup__menu li.active').parent('ul').parent('li').addClass('active');
			$('.popup__menu li.active').parent('ul').parent('li').children('span').show();
			$('.popup__menu li.active li.active').removeClass('active');
			$(this).removeClass('inner--level');
		} else {
			$(this).closest('.popup__menu').removeClass('inner--list-opened');
			$('.popup__menu li.active').children('ul').hide();
			$('.popup__menu li.active').removeClass('active');
		}
	});


	// Всплывающее окно фильтра
	$('.j-open-filter').on('click', function () {
		$('.popup__filter').addClass('active');
		$('body').css('position', 'fixed');
		popupButtonShadow();
	});

	function popupButtonShadow() {
		let buttonTop = $('.popup__filter.active .popup__filter--button').position().top;
		let popupInnerHeight = $('.popup__filter.active .popup__filter--inner').outerHeight();
		if (buttonTop <= popupInnerHeight) {
			$('.popup__filter.active .popup__filter--button').addClass('shadow');
		} else {
			$('.popup__filter.active .popup__filter--button').removeClass('shadow');
		}
	}

	$(window).resize(function () {
		if ($('.popup__filter').hasClass('active')) {
			popupButtonShadow();
		}
	});


	// Всплывающее окно фильтра. Применить
	$('.popup__filter .j-apply-filter').click(function () {
		$('.popup__filter').removeClass('active');
		$('body').css('position', '');
	});


	// Всплывающее окно фильтра. Проверка необходимости показывать "Смотреть все"
	$('.popup__filter .filter__block[data-filter="sections"]').each(function () {
		let listHeight = $(this).find('ul').outerHeight(true);
		let listHeightMax = $(this).find('.filter__block--inner').css('max-height').replace('px', '');
		if (listHeight <= listHeightMax) {
			$(this).find('.filter__block--toggle').hide();
		}
	});


	// Всплывающее окно фильтра. Свернуть/развернуть
	$('.popup__filter .filter__block--toggle').on('click', function () {
		if ($(this).hasClass('active')) {
			$(this).prev('.filter__block--inner').css('max-height', '');
			$(this).text('Смотреть все');
		} else {
			var listHeightTotal = $(this).prev('.filter__block--inner').find('ul').outerHeight(true);
			$(this).prev('.filter__block--inner').css('max-height', listHeightTotal + 'px');
			$(this).text('Свернуть');
		}
		$(this).toggleClass('active');
		setTimeout(() => {
			popupButtonShadow();
		}, 300);
	});


	// Контакты. Связаться с нами
	$('.contacts__form .send-request-contacts').click(function (e) {
		e.preventDefault();
		let currentButton = $(this);
		if(!$(this).hasClass('sent')) {
			let timerOnButton;
			$(this).closest('form').find('.warning').removeClass('warning');
			$(this).closest('form').find('.input--error').remove();
			$(this).closest('form').find('input:required').each(function() {
				if ($(this).val() == "") {
					$(this).closest('label').addClass('warning');
					$(this).closest('label').append('<span class="input--error">Заполните это поле</span>');
				} else if ($(this).attr('type') == "email") {
					let patternMail = /^([a-z0-9_-]+\.)?[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
					if ($(this).val().search(patternMail) !== 0) {
						$(this).closest('label').addClass('warning');
						$(this).closest('label').append('<span class="input--error">Укажите корректный адрес</span>');
					}
				}
			});
			$(this).closest('form').find('textarea:required').each(function() {
				if ($(this).val() == "") {
					$(this).closest('label').addClass('warning');
					$(this).closest('label').append('<span class="input--error">Заполните это поле</span>');
				}
			});
			$(this).closest('form').find('input').click(function(){
				$(this).closest('label').removeClass('warning');
				$(this).closest('label').find('.input--error').remove();
				if($(currentButton).hasClass('sent')) {
					clearTimeout(timerOnButton);
					$(currentButton).text('Отправить сообщение');
					$(currentButton).removeClass('sent');
				}
			});
			$(this).closest('form').find('textarea').click(function(){
				$(this).closest('label').removeClass('warning');
				$(this).closest('label').find('.input--error').remove();
				if($(currentButton).hasClass('sent')) {
					clearTimeout(timerOnButton);
					$(currentButton).text('Отправить сообщение');
					$(currentButton).removeClass('sent');
				}
			});
			var warningField = $(this).closest('form').find('.warning').length;
			if (warningField > 0) {
				checkWarningVisibility();
			} else {
				$(this).text('Отправлено');
				$(this).addClass('sent');
				$(this).closest('form').find('input').val('');
				$(this).closest('form').find('textarea').val('');
				timerOnButton = setTimeout(()=>{
					$(this).text('Отправить сообщение');
					$(this).removeClass('sent');
				}, 3000);
			}
		}
	});


	// Убираем предупреждение о заполнении поля по клику на него
	$('.contacts__form input').on('click', function () {
		if ($(this).closest('label').hasClass('warning')) {
			$(this).closest('label').removeClass('warning');
			$(this).closest('label').find('.input--error').remove();
		}
	});


	// Карта магазинов. Проверка списка магазинов на необходиомсть "дымки"
	var shopListWrap = $('.shops__container .shops__list').outerHeight();
	var shopList = $('.shops__container .shops__list--inner').outerHeight();
	if (shopList > shopListWrap) {
		$('.shops__container .shops__list').addClass('hidden');
	}


	// Каталог. Сортировка
	const sortItems = document.querySelectorAll('.sort__block a');
	for(let i=0; i<sortItems?.length; i++) {
		sortItems[i].addEventListener('click',()=>{
			if(sortItems[i].classList.contains('decrease')) {
				sortItems[i].classList.remove('decrease');
				sortItems[i].classList.add('increase');
			} else if(sortItems[i].classList.contains('increase')) {
				sortItems[i].classList.remove('increase');
			} else {
				if(sortItems[i].closest('.sort__block').querySelector('.decrease')) {
					sortItems[i].closest('.sort__block').querySelector('.decrease').classList.remove('decrease');
				} else if(sortItems[i].closest('.sort__block').querySelector('.increase')) {
					sortItems[i].closest('.sort__block').querySelector('.increase').classList.remove('increase');
				}
				sortItems[i].classList.add('decrease');
			}
		});
	}
});