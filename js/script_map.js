$(document).ready(()=>{
    // Карта магазинов. Убираем дымку при скролле списка магазинов
    function checkShopsListShadow() {
        var scrollTopNav = Math.round($('.shops__container .shops__list .shops__list--inner').position().top);
        var scrollTopWrap = Math.round($('.shops__container .shops__list').height() - $('.shops__container .shops__list .shops__list--inner').height());
        if (scrollTopNav == scrollTopWrap) {
            $('.shops__container .shops__list').addClass('scroll-to-end');
        } else {
            $('.shops__container .shops__list').removeClass('scroll-to-end');
        }
    }
    $('.shops__container .shops__list').scroll(function () {
        checkShopsListShadow();
    });

    // Карта магазинов. Перебор всех городов и их нумерация
    var shopSities = [];
    $(".shops__container .shops__item").each(function () {
        let matches = 0;
        $(this).addClass('current');
        let shopCity = $(this).data('city');
        if (shopSities.length == 0) {
            shopSities.push(shopCity);
            $(".shops__container .shops__item.current").attr('data-city-index', 0);
        } else {
            $.each(shopSities, function (index, value) {
                if (shopCity == value) {
                    matches++;
                    $(".shops__container .shops__item.current").attr('data-city-index', index);
                }
            });
            if (matches == 0) {
                shopSities.push(shopCity);
                $(this).attr('data-city-index', shopSities.length - 1);
            }
        }
        $(this).removeClass('current');
    });


    // Карта магазинов. Перебор всех магазинов и их нумерация
    $.each(shopSities, function (index, value) {
        let cityName = value;
        $('.shops__container .shops__item').each(function () {
            let shopIndex = $(this).prevAll('.shops__item[data-city="' + value + '"]').length;
            let shopCityName = $(this).data('city');
            if (shopCityName == cityName) {
                $(this).attr('data-shop', shopIndex);
            }
        });
    });


    // Карта магазинов. Закрытие окна информации магазина
    $('.popup__map--close').click(function () {
        $('.popup__map').removeClass('active');
        $('body').css('position', '');
        // Возвращаем меткам исходную иконку
        $('.shops__container #shop-map .ymaps-2-1-79-places-pane .ymaps-2-1-79-image').css({
            backgroundImage: 'url("img/icon_mapping.svg")',
            backgroundSize: '25px 25px',
            position: 'relative',
            left: '-16px',
            top: '-16px',
            display: 'block'
        });
    });


    // Карта магазинов. Настройка карты -->
    var myMap;
    var placemarkCollections = {};
    var placemarkList = {};

    // Список городов и магазинов в них
    var shopList = [
        {
            'cityName': 'Москва',
            'shops': [
                {
                    'coordinates': [55.750940, 37.597450],
                    'name': 'ЦветТорг Арбатская',
                    'address': 'Москва, пер. Большой Афанасьевский, 36с1',
                    'workhours': 'Пн-Пт 10:00-21:00, Сб-Вс 10:00-18:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info1@torg.ru'
                },
                {
                    'coordinates': [55.801040, 37.533391],
                    'name': 'СоюзЦветТорг Аэропорт',
                    'address': 'Москва, пр-т. Ленинградский, д. 62',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info2@torg.ru'
                },
                {
                    'coordinates': [55.616575, 37.590749],
                    'name': 'СоюзЦветТорг Арбатская',
                    'address': 'Москва, ул. Чертановская, д.34, корп.1',
                    'workhours': '10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info3@torg.ru'
                },
                {
                    'coordinates': [55.742048, 37.595123],
                    'name': 'Цветочный магазин №76',
                    'address': 'Москва, ул. Пречистенка, д. 17/9',
                    'workhours': 'Пн-Пт 10:00-21:00, Сб-Вс 10:00-15:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info4@torg.ru'
                },
                {
                    'coordinates': [55.754380, 37.642662],
                    'name': 'Цветы на Подкопаевской',
                    'address': 'Москва, пер. Подкопаевский, д. 5',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info5@torg.ru'
                },
                {
                    'coordinates': [55.754618, 37.641324],
                    'name': 'Цветочный магазин №6',
                    'address': 'Москва, пер. Малый Ивановский, д. 5, стр. 1',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info6@torg.ru'
                },
                {
                    'coordinates': [55.601350, 37.183102],
                    'name': 'Цветочный магазин №7',
                    'address': 'Москва, пос. Кокошкино, ул. Учительская, 35',
                    'workhours': '10:00-17:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info7@torg.ru'
                },
                {
                    'coordinates': [55.807486, 38.085792],
                    'name': 'Цветочный магазин №8',
                    'address': 'Щемилово, д. 11',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info8@torg.ru'
                },
                {
                    'coordinates': [55.538687, 37.878641],
                    'name': 'Цветочный магазин №9',
                    'address': 'Богданиха, ул. Ленина, д. 52',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info9@torg.ru'
                },
                {
                    'coordinates': [55.887892, 37.429932],
                    'name': 'Цветочный магазин №10',
                    'address': 'Химки, ул. Горшина, д. 1',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info10@torg.ru'
                }
            ]
        },
        {
            'cityName': 'Нижний Новгород',
            'shops': [
                {
                    'coordinates': [56.310513, 43.998315],
                    'name': 'Цветочный букет из Нижнего',
                    'address': 'Нижний Новгород, ул. Белинского, д.38',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info-nn@torg.ru'
                },
                {
                    'coordinates': [56.292070, 44.073422],
                    'name': 'Цветы из Нижнего',
                    'address': 'Нижний Новгород, Казанское шоссе, д.9',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info-nn1@torg.ru'
                }
            ]
        },
        {
            'cityName': 'Казань',
            'shops': [
                {
                    'coordinates': [55.786804, 49.120967],
                    'name': 'Цветы Казани',
                    'address': 'Казань, ул. Пушкина, д.5',
                    'workhours': 'Пн-Пт 10:00-21:00',
                    'phone': '8 (999) 789-78-55',
                    'email': 'info-kzn@torg.ru'
                }
            ]
        }
    ];

    if(ymaps) {
        ymaps.ready(init);
    }

    function init() {
        if ($(window).width() > 767) {
            // Создаем карту
            myMap = new ymaps.Map("shop-map", {
                center: [55.7522, 37.6156],
                zoom: 10,
                controls: [
                    'zoomControl', // Ползунок масштаба
                    'rulerControl', // Линейка
                    'routeButtonControl', // Панель маршрутизации
                    'trafficControl', // Пробки
                    'typeSelector', // Переключатель слоев карты
                    'fullscreenControl', // Полноэкранный режим
                ],
                zoomMargin: [20]
            });

            var clusterer = new ymaps.Clusterer({
                gridSize: 64,
                groupByCoordinates: false,
                hasBalloon: false,
                hasHint: false,
                margin: 5,
                maxZoom: 999,
                minClusterSize: 2,
                showInAlphabeticalOrder: false,
                viewportMargin: 128,
                zoomMargin: 128,
                clusterDisableClickZoom: false,
                // Зададим макет метки кластера.
                clusterIconLayout: ymaps.templateLayoutFactory.createClass('<div class="clusterIcon">{{ properties.geoObjects.length }}</div>'),
                // Чтобы метка была кликабельной, переопределим ее активную область.
                clusterIconShape: {
                    type: 'Rectangle',
                    coordinates: [[0, 0], [35, 35]]
                }
            });

            for (var i = 0; i < shopList.length; i++) {
                // Создаём коллекцию меток для города
                var cityCollection = new ymaps.GeoObjectCollection();
                for (var c = 0; c < shopList[i].shops.length; c++) {
                    var shopInfo = shopList[i].shops[c];
                    var shopPlacemark = new ymaps.Placemark(
                        shopInfo.coordinates,
                        {
                            // Подсказка при наведении на метку
                            hintContent: shopInfo.name,

                            clusterCaption: shopInfo.name,

                            // Задаем содержимое, появляющееся по клику на метку
                            balloonContentBody: [
                                '<div class="baloon__content">',
                                '<div class="baloon__content--close"></div>',
                                '<p class="baloon__content--title">' + shopInfo.name + '</p>',
                                '<p class="baloon__content--address">' + shopInfo.address + '</p>',
                                '<p class="baloon__content--row">',
                                '<span>Часы работы:</span>' + shopInfo.workhours,
                                '</p>',
                                '<p class="baloon__content--row">',
                                '<span>Телефон:</span>',
                                '<a href="tel:' + shopInfo.phone + '">' + shopInfo.phone + '</a>',
                                '</p>',
                                '<p class="baloon__content--row">',
                                '<span>Е-mail:</span>',
                                '<a href="mailto:' + shopInfo.email + '">' + shopInfo.email + '</a>',
                                '</p>',
                                '</div>'
                            ].join('')
                        }, {
                            hideIconOnBalloonOpen: false, // Не скрываем метку по клику на нее
                            balloonOffset: [3, -40],

                            // Задаем свое изображение для метки
                            iconLayout: 'default#image',
                            iconImageHref: 'img/icon_mapping.svg',
                            iconImageSize: [25, 25], // Размеры метки
                            iconImageOffset: [-16, -16] // Смещение левого верхнего угла иконки относительно её "ножки"
                        }
                    );

                    shopPlacemark.events.add('click', clickOnPlacemark);

                    if (!placemarkList[i]) placemarkList[i] = {};
                    placemarkList[i][c] = shopPlacemark;

                    clusterer.add(shopPlacemark);

                    // Добавляем метку в коллекцию
                    cityCollection.add(shopPlacemark);
                }

                placemarkCollections[i] = cityCollection;

                // Добавляем коллекцию на карту (если кластеризация не нужна)
                //myMap.geoObjects.add(cityCollection);
                // Добавляем коллекцию на карту (если кластеризация нужна)
                myMap.geoObjects.add(clusterer);

                // Запрет масштабирования карты колесиком мыши
                myMap.behaviors.disable('scrollZoom');

                // Если надо сместить карту так, чтобы все метки были на ней указаны
                //myMap.setBounds(myMap.geoObjects.getBounds(),{checkZoomRange:true, zoomMargin:9});

                // Активируем нужный магазин из списка по клику на метку
                function clickOnPlacemark(e) {
                    let target = e.get('target');
                    let targetName = target.properties._data.hintContent;
                    let targetCoords = target.geometry.getCoordinates(); // Получаем координаты метки

                    $('.shops__container .shops__item').each(function () {
                        let shopName = $(this).find('.shops_item--title').text();
                        if (shopName == targetName) {
                            $('.shops__container .shops__item.active').removeClass('active');
                            $(this).addClass('active');
                        }
                    });

                    // Возвращаем меткам исходную иконку
                    $('.shops__container #shop-map .ymaps-2-1-79-places-pane .ymaps-2-1-79-image').css('background-image', 'url("img/icon_mapping.svg")');
                    $('.shops__container #shop-map .ymaps-2-1-79-places-pane .ymaps-2-1-79-image').css('background-size', '25px 25px');

                    // Меняем иконку активной метки
                    target.options.set('iconImageHref', 'img/icon_mapping_active.svg');
                    target.options.set('iconImageSize', [35, 42]);
                    target.options.set('iconImageOffset', [-20, -45]);

                    // Задаем координаты центра карты
                    myMap.setCenter(targetCoords);
                    // Задаем масштаб карты
                    myMap.setZoom(16);

                    // Прокручиваем список к нужному магазину
                    document.querySelector('.shops__item.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start'
                    });
                    // Убираем дымку в списке, если она не нужна
                    checkShopsListShadow();

                }
            }
        } else {
            // Создаем карту
            myMap = new ymaps.Map("shop-map", {
                center: [55.7522, 37.6156],
                zoom: 10,
                controls: [
                    'zoomControl', // Ползунок масштаба
                    'routeButtonControl', // Панель маршрутизации
                ],
                zoomMargin: [20]
            });

            var clusterer = new ymaps.Clusterer({
                gridSize: 64,
                groupByCoordinates: false,
                hasBalloon: false,
                hasHint: false,
                margin: 5,
                maxZoom: 999,
                minClusterSize: 2,
                showInAlphabeticalOrder: false,
                viewportMargin: 128,
                zoomMargin: 128,
                clusterDisableClickZoom: false,
                // Зададим макет метки кластера.
                clusterIconLayout: ymaps.templateLayoutFactory.createClass('<div class="clusterIcon">{{ properties.geoObjects.length }}</div>'),
                // Чтобы метка была кликабельной, переопределим ее активную область.
                clusterIconShape: {
                    type: 'Rectangle',
                    coordinates: [[0, 0], [35, 35]]
                }
            });

            for (var i = 0; i < shopList.length; i++) {
                // Создаём коллекцию меток для города
                var cityCollection = new ymaps.GeoObjectCollection();
                for (var c = 0; c < shopList[i].shops.length; c++) {
                    var shopInfo = shopList[i].shops[c];
                    var shopPlacemark = new ymaps.Placemark(
                        shopInfo.coordinates,
                        {
                            clusterCaption: shopInfo.name,

                            hasBalloon: false,
                        }, {
                            hideIconOnBalloonOpen: false, // Не скрываем метку по клику на нее

                            // Задаем свое изображение для метки
                            iconLayout: 'default#image',
                            iconImageHref: 'img/icon_mapping.svg',
                            iconImageSize: [25, 25], // Размеры метки
                            iconImageOffset: [-16, -16] // Смещение левого верхнего угла иконки относительно её "ножки"
                        }
                    );

                    shopPlacemark.events.add('click', clickOnPlacemark);

                    if (!placemarkList[i]) placemarkList[i] = {};
                    placemarkList[i][c] = shopPlacemark;

                    clusterer.add(shopPlacemark);

                    // Добавляем метку в коллекцию
                    cityCollection.add(shopPlacemark);
                }

                placemarkCollections[i] = cityCollection;

                // Добавляем коллекцию на карту (если кластеризация не нужна)
                //myMap.geoObjects.add(cityCollection);
                // Добавляем коллекцию на карту (если кластеризация нужна)
                myMap.geoObjects.add(clusterer);


                // Запрет масштабирования карты пальцем
                myMap.behaviors.disable('scrollZoom');
                myMap.behaviors.disable('drag');

                // Активируем нужный магазин из списка по клику на метку
                function clickOnPlacemark(e) {
                    let target = e.get('target');
                    let targetName = target.properties._data.hintContent;
                    let targetCoords = target.geometry.getCoordinates(); // Получаем координаты метки

                    // Возвращаем меткам исходную иконку
                    $('.shops__container #shop-map .ymaps-2-1-79-places-pane .ymaps-2-1-79-image').css({
                        backgroundImage: 'url("img/icon_mapping.svg")',
                        backgroundSize: '25px 25px'
                    });

                    // Меняем иконку активной метки
                    target.options.set('iconImageHref', 'img/icon_mapping_active.svg');
                    target.options.set('iconImageSize', [35, 42]);

                    // Задаем координаты центра карты
                    myMap.setCenter(targetCoords);
                    // Задаем масштаб карты
                    myMap.setZoom(16);

                    // Заполняем всплывающее окно
                    $('.popup__map').addClass('active');
                    $('body').css('position', 'fixed');
                    let vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                    for (var i = 0; i < shopList.length; i++) {
                        for (var c = 0; c < shopList[i].shops.length; c++) {
                            var shopInfo = shopList[i].shops[c];
                            if (shopInfo.coordinates == targetCoords) {
                                $('.popup__map .baloon__content--title').text(shopInfo.name);
                                $('.popup__map .baloon__content--address').text(shopInfo.address);
                                $('.popup__map .baloon__content--row[data-content="workhours"] span:last-child').text(shopInfo.workhours);
                                $('.popup__map .baloon__content--row[data-content="phone"] a').text(shopInfo.phone);
                                $('.popup__map .baloon__content--row[data-content="phone"] a').attr("href", "tel:" + shopInfo.phone);
                                $('.popup__map .baloon__content--row[data-content="email"] a').text(shopInfo.email);
                                $('.popup__map .baloon__content--row[data-content="email"] a').attr("href", "mailto:" + shopInfo.email);
                            }
                        }
                    }
                    $('.popup__map .go-to-nav').attr("href", "https://yandex.ru/maps/?rtext=~" + targetCoords);
                }
            }
        }
    }

    // Карта магазинов. Клик по магазину в списке
    $('.shops__container .shops__item').click(function () {
        $('.shops__container .shops__item.active').removeClass('active');
        $(this).addClass('active');
        let cityIndex = $(this).attr('data-city-index');
        let shopIndex = $(this).data('shop');
        placemarkList[cityIndex][shopIndex].events.fire('click');
    });

    $('body').on('click', '.baloon__content--close', function () {
        myMap.balloon.close();
        $('.shops__container .shops__item.active').removeClass('active');
        $('.shops__container #shop-map .ymaps-2-1-79-places-pane .ymaps-2-1-79-image').css('background-image', 'url("img/icon_mapping.svg")');
        $('.shops__container #shop-map .ymaps-2-1-79-places-pane .ymaps-2-1-79-image').css('background-size', '25px 25px');
    });

// Карта магазинов. Настройка карты <--
});