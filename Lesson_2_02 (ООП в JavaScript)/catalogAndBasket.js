// Lesson_05 - Введение в DOM

/****************************************************************************
    1.	Доработать модуль корзины.
        a.	Добавлять в объект корзины выбранные товары по клику на кнопке «Купить» без перезагрузки страницы
        b.	Привязать к событию покупки товара пересчет корзины и обновление ее внешнего вида
    2.	*У товара может быть несколько изображений. Нужно:
        a.	Реализовать функционал показа полноразмерных картинок товара в модальном окне
        b.	Реализовать функционал перехода между картинками внутри модального окна ("листалка")
 */


'use strict';

const images = [
    { id: 1, preview_img_url: "img/min/1.jpg", full_image_url: "img/max/1_0.jpg" },
    { id: 2, preview_img_url: "img/min/2.jpg", full_image_url: ["img/max/2_0.jpg", "img/max/2_1.jpg", "img/max/2_2.jpg", "img/max/2_3.jpg"] },
    { id: 3, preview_img_url: "img/min/3.jpg", full_image_url: ["img/max/3_0.jpg", "img/max/3_1.jpg", "img/max/3_3.jpg"] },
    { id: 4, preview_img_url: "img/min/4.jpg", full_image_url: ["img/max/4_0.jpg", "img/max/4_1.jpg", "img/max/4_2.jpg", "img/max/4_3.jpg"] },
]

const catalog = [
    { id: 1, name: "NoteBook", cost: 150, },
    { id: 2, name: "Monitor", cost: 250 },
    { id: 3, name: "Mouse", cost: 350 },
    { id: 4, name: "KeyBoard", cost: 400 }
];

// Объект "Каталог"
const catalogObj = {
    catalogBlock: null,
    catalogTable: null,
    basket: null,
    gallery: null,
    list: [],
    images: [],

    /**
     * Инициальзация каталога.
     * @param catalogBlockId - ID блока каталога
     * @param catalog - список позиций товаров с ценами
     * @param gallery - объект "Галерея"
     * @param basket - объект "корзина"
     */
    init(catalogBlockId, catalog, basketObj, images, gallery) {
        // this.containerElement = document.getElementById('catalog_table');
        this.catalogBlock = document.getElementById(catalogBlockId);
        this.createTable();
        this.renderTableHead();

        this.list = JSON.parse(JSON.stringify(catalog));        // глубокое клонирование
        this.images = JSON.parse(JSON.stringify(images));        // глубокое клонирование
        this.basket = basketObj;
        this.gallery = gallery;
        this.gallery.init({ previewSelector: '.catalog' });
        this.render();
        this.addEventHandlers();
    },
    /**
     * Рендер каталога
    */
    render() {
        if (this.getCatalogListLength() > 0) {
            this.renderCatalogList();
        } else {
            this.renderEmptyCatalog();
        }
    },

    /**
     * Добавляем обработку событий
     */
    addEventHandlers() {
        this.catalogBlock.addEventListener('click', event => this.addToBasket(event));
        // this.catalogBlock.addEventListener('click', event => this.openGallery(event));
    },

    /**
     * Метод добавления в корзину
     */
    addToBasket(event) {
        if (!event.target.classList.contains('product__add-to-cart')) return;
        const idProduct = +event.target.dataset.id;
        const productToAdd = this.list.find((product) => product.id === idProduct);
        this.basket.addToBasket(productToAdd);
    },

    /**
     * Метод просмотра галереи с картинками товара
     */
    openGallery(event) {
        // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
        if (event.target.tagName !== 'IMG') return;
        this.gallery.containerClickHandler(event);
        this.gallery.openImage(event.target.dataset.full_image_url);
    },

    /**
     * Метод получения количества товаров в каталоге
     * @returns {number}
     */
    getCatalogListLength() {
        return this.list.length;
    },

    createTable() {
        this.catalogTable = document.createElement('table');
        this.catalogBlock.appendChild(this.catalogTable);
    },

    /**
     * создание заголовка таблицы
     */
    renderTableHead() {
        this.catalogTable.innerHTML = '';
        this.catalogTable.insertAdjacentHTML('beforeend',
            `<tr>
            <td class="table_head">Наименование</td>
            <td class="table_head">Цена</td>
            <td class="table_head">Картинка</td>
            <td class="table_head">Поместить в корзину</td>
        </tr>`);
    },

    /**
     * Рендер списка товаров
     */
    renderCatalogList() {
        // this.catalogBlock.innerHTML = '';
        this.list.forEach(item => {
            this.catalogTable.insertAdjacentHTML('beforeend', this.renderCatalogItem(item));
        });
    },

    /**
     * Рендер отдельного товара из списка
     * @param item - товар
     * @returns {string} - сгенерированая строка разметки
     */
    renderCatalogItem(item) {
        const image = this.getImgById(item.id);
        return `<tr class="product">
                <td>${item.name}</td>
                <td>${item.cost} руб.</td>
                <td><img src=${image.preview_img_url} height=50 data-full_image_url=${image.full_image_url} alt="Картинка"></td>
                <td><button class="product__add-to-cart" data-id="${item.id}">В корзину</button></td>
            </tr>`;
    },

    /**
     * Рендер пустого каталога
     */
    renderEmptyCatalog() {
        this.catalogBlock.innerHTML = '';
        this.catalogBlock.textContent = 'Каталог товаров пуст.';
    },

    // Получить изобращение по ИД
    getImgById(id) {
        return this.images.find((image) => image.id === id);

    }
};

/**
 *  Объект корзины
 */
const basketObj = {
    basketBlock: null,  // весь блок корзины
    basketTable: null,  // таблица корзины
    footerStr: null,    // итоговая строка по корзине
    clearButton: null,  // кнопка очистки корзины
    list: [
        { id: 1, name: "NoteBook", cost: 150, count: 1 },
        { id: 2, name: "Monitor", cost: 250, count: 2 }
    ],

    /**
     * Метод инициальзации корзины
     * @param basketBlock - весь блок корзины
     * @param basketId - ID таблицы блока корзины
     * @param basketTotal   - ID итоговой строки
     * @param clearButtonId - ID кнопки очистки корзины
     */
    init(basketId) {
        this.basketBlock = document.getElementById(basketId);
        this.createTable();
        this.renderTableHead();
        this.createFooterStr();
        this.createClearButton();

        this.addEventHandlers();
        this.render();
    },

    /**
     * Метод установки обработчиков событий
     */
    addEventHandlers() {
        this.clearButton.addEventListener('click', this.dropCart.bind(this));
        this.basketTable.addEventListener('click', event => this.delFromBasket(event));
    },

    /**
     * Метод очистки корзины 
     */
    dropCart() {
        this.list = [];
        this.render();
    },

    /**
     * Метод удаления из корзины одной позиции
     */
    delFromBasket(event) {
        if (!event.target.classList.contains('product__del')) return;
        const idProduct = +event.target.dataset.id;
        const productToDelIndex = this.list.findIndex((product) => product.id === idProduct);
        this.list.splice(productToDelIndex, 1);
        this.render();
    },

    /**
     * Рендер корзины
     */
    render() {
        if (this.getCartListLength() > 0) {
            this.renderCartList();
        } else {
            this.renderEmptyCart();
        }
    },

    /**
     * Добавить товар
     */
    addToBasket(product) {
        if (product) {
            const findInBasket = this.list.find((item) => product.id === item.id);
            if (findInBasket) {
                findInBasket.count++;
            } else {
                this.list.push({ ...product, count: 1 });
            }
            this.render();
        } else {
            alert('Ошибка добавления!');
        }
    },

    /**
     * Получение количества товаров в корзине
     * @returns {number}
     */
    getCartListLength() {
        return this.list.length;
    },

    /**
     * Получение общей суммы товаров в корзине
     * @returns {number}
     */
    getTotalSum() {
        return this.list.reduce(function (price, item) {
            return price + item.cost * item.count;
        }, 0);
    },

    /**
     * Рендер пустой корзины
     */
    renderEmptyCart() {
        // this.basketTable.innerHTML = '';
        this.basketTable.style.display = "none";    // Уберем таблицу
        this.footerStr.textContent = 'Корзина пуста.';
    },

    /**
     * Рендер списка товаров в корзине
     */
    renderCartList() {
        // this.basketTable.innerHTML = '';
        this.renderTableHead();
        this.basketTable.style.display = "block";   // Покажем таблицу
        this.list.forEach(item => {
            this.basketTable.insertAdjacentHTML('beforeend', this.renderCartItem(item));
        });
        this.footerStr.textContent = `В корзине: ${this.getCartListLength()} товар(а/ов) на сумму ${this.getTotalSum()} руб.`;
    },

    /**
     * создание таблицы
     */
    createTable() {
        this.basketTable = document.createElement('table');
        this.basketBlock.appendChild(this.basketTable);
    },

    /**
     * создание заголовка таблицы
     */
    renderTableHead() {
        this.basketTable.innerHTML = '';
        this.basketTable.insertAdjacentHTML('beforeend',
            `<tr>
            <td class="table_head" > Наименование</td>
            <td class="table_head">количество</td>
            <td class="table_head">цена</td>
            <td class="table_head">сумма</td>
            <td class="table_head">удалить позицию</td>
            </tr>`);
    },

    /**
     * создание итоговой строки 
     */
    createFooterStr() {
        this.footerStr = document.createElement('div');
        this.basketBlock.appendChild(this.footerStr);
    },

    /**
     * создание кнопки очистки корзины 
     */
    createClearButton() {
        this.basketBlock.insertAdjacentHTML('beforeend', `<div class="my-btn" id="clear_basket">Очистить Корзину</div>`);
        this.clearButton = document.getElementById('clear_basket');
    },

    /**
     * Рендер отдельного товара в корзине
     * @param item - товар
     * @returns {string} - сгененрированая строка разметки
     */
    renderCartItem(item) {
        return `<tr>
                <td>${item.name}</td>
                <td>${item.count} шт.</td>
                <td>${item.cost} руб.</td>
                <td>${item.cost * item.count} руб.</td>
                <td><button class="product__del" data-id="${item.id}">Удалить</button></td>

            </tr>`;
    },
};

/*
*******************************************************************************************
    ГАЛЕРЕЯ
*******************************************************************************************
*/

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки открыть.
 * @property {string} settings.openedImageNextBtnSrc Путь до картинки со стрелкой вправо.
 * @property {string} settings.openedImageNextBtnClass Класс картинки со стрелкой вправо.
 * @property {string} settings.openedImageBackBtnSrc Путь до картинки со стрелкой влево.
 * @property {string} settings.openedImageBackBtnClass Класс картинки со стрелкой влево.
 * @property {string} settings.imageNotFoundSrc Путь до стандартной картинки-заглушки.
 */
const gallery = {
    openedImageEl: null,
    arrImg: [],

    settings: {
        previewSelector: '.mySuperGallery',
        openedImageWrapperClass: 'galleryWrapper',
        openedImageClass: 'galleryWrapper__image',
        openedImageScreenClass: 'galleryWrapper__screen',
        openedImageCloseBtnClass: 'galleryWrapper__close',
        openedImageCloseBtnSrc: 'img/gallery/close.png',
        openedImageNextBtnSrc: 'img/gallery/next.png',
        openedImageNextBtnClass: 'galleryWrapper__next',
        openedImageBackBtnSrc: 'img/gallery/back.png',
        openedImageBackBtnClass: 'galleryWrapper__back',
        imageNotFoundSrc: 'img/gallery/duck.gif',
    },

    /**
     * Инициализирует галерею, ставит обработчик события.
     * @param {Object} settings Объект настроек для галереи.
     */
    init(settings) {
        // Записываем настройки, которые передал пользователь в наши настройки.
        this.settings = Object.assign(this.settings, settings);

        // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
        // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
        // gallery и передадим туда событие MouseEvent, которое случилось.
        document
            .querySelector(this.settings.previewSelector)
            .addEventListener('click', event => this.containerClickHandler(event));
    },

    /**
     * Обработчик события клика для открытия картинки.
     * @param {MouseEvent} event Событие клики мышью.
     * @param {HTMLElement} event.target Событие клики мышью.
     */
    containerClickHandler(event) {
        // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
        if (event.target.tagName !== 'IMG') {
            return;
        }

        // Записываем текущую картинку, которую хотим открыть.
        this.openedImageEl = event.target;

        // Открываем картинку.
        this.openImage(event.target.dataset.full_image_url);
    },

    /**
     * Открывает картинку.
     * @param {string} src Ссылка на картинку, которую надо открыть.
     * Переделал на массив ссылок
     */
    openImage(src) {
        // Пробуем загрузить картинку, если картинка загружена - показываем картинку с полученным из
        // целевого тега (data-full_image_url аттрибут), если картинка не загрузилась - показываем картинку-заглушку.
        // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
        const openedImageEl = this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`);
        const img = new Image();

        if (Array.isArray(src)) this.arrImg = JSON.parse(JSON.stringify(src));  // глубокое клонирование
        else this.arrImg = src.split(',');

        // this.arrImg = JSON.parse(JSON.stringify(src)).split(',');     // глубокое клонирование
        const src0 = this.arrImg[0];
        if (src0)
            img.onload = () => openedImageEl.src = src0;
        img.onerror = () => openedImageEl.src = this.settings.imageNotFoundSrc;
        img.src = src0;
    },

    /**
     * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
     * @returns {Element}
     */
    getScreenContainer() {
        // Получаем контейнер для открытой картинки.
        const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
        // Если контейнер для открытой картинки существует - возвращаем его.
        if (galleryWrapperElement) {
            return galleryWrapperElement;
        }

        // Возвращаем полученный из метода createScreenContainer контейнер.
        return this.createScreenContainer();
    },

    /**
     * Создает контейнер для открытой картинки.
     * @returns {HTMLElement}
     */
    createScreenContainer() {
        // Создаем сам контейнер-обертку и ставим ему класс.
        const galleryWrapperElement = document.createElement('div');
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

        // Добавляем кнопку назад.
        const backBtn = new Image();
        backBtn.classList.add(this.settings.openedImageBackBtnClass);
        backBtn.src = this.settings.openedImageBackBtnSrc;
        galleryWrapperElement.appendChild(backBtn);

        // Добавляем обработчик события при клике, ставим новую открытую картинку и открываем ее.
        backBtn.addEventListener('click', () => {
            this.getPrevImage_();                   // переделал на массив
            this.openImage(this.arrImg);
            // this.openedImageEl = this.getPrevImage();
            // this.openImage(this.openedImageEl.dataset.full_image_url);
        });

        // Добавляем кнопку вперед.
        const nextBtn = new Image();
        nextBtn.classList.add(this.settings.openedImageNextBtnClass);
        nextBtn.src = this.settings.openedImageNextBtnSrc;
        galleryWrapperElement.appendChild(nextBtn);

        // Добавляем обработчик события при клике, ставим новую открытую картинку и открываем ее.
        nextBtn.addEventListener('click', () => {
            this.getNextImage_();                   // переделал на массив
            this.openImage(this.arrImg);
            // this.openedImageEl = this.getNextImage();
            // this.openImage(this.openedImageEl.dataset.full_image_url);
        });

        // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
        const galleryScreenElement = document.createElement('div');
        galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
        galleryWrapperElement.appendChild(galleryScreenElement);

        // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
        const closeImageElement = new Image();
        closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
        closeImageElement.src = this.settings.openedImageCloseBtnSrc;
        closeImageElement.addEventListener('click', () => this.close());
        galleryWrapperElement.appendChild(closeImageElement);

        // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
        const image = new Image();
        image.classList.add(this.settings.openedImageClass);
        galleryWrapperElement.appendChild(image);

        // Добавляем контейнер-обертку в тег body.
        document.body.appendChild(galleryWrapperElement);

        // Возвращаем добавленный в body элемент, наш контейнер-обертку.
        return galleryWrapperElement;
    },

    /**
     * Возвращает следующий элемент (картинку) от открытой или первую картинку в контейнере,
     * если текущая открытая картинка последняя.
     * @returns {Element} Следующую картинку от текущей открытой.
     */
    getNextImage_() {
        // Переделал метод на взятие картинки из массива (прокрутим массив)
        this.arrImg.push(this.arrImg[0]);   // перенесем первую картинку в конец
        this.arrImg.shift();                // и удалим её с начала массива
    },
    getNextImage() {
        // Переделал метод на взятие картинки из массива 
        this.arrImg.push(this.arrImg[0]);
        return
        // Получаем элемент справа от текущей открытой картинки.
        const nextSibling = this.openedImageEl.nextElementSibling;
        // Если элемент справа есть, его отдаем, если нет, то берем первый элемент в родительском контейнере.
        return nextSibling ? nextSibling : this.openedImageEl.parentElement.firstElementChild;
    },

    /**
     * Возвращает предыдущий элемент (картинку) от открытой или последнюю картинку в контейнере,
     * если текущая открытая картинка первая.
     * @returns {Element} Предыдущую картинку от текущей открытой.
     */
    getPrevImage_() {
        // Переделал метод на взятие картинки из массива 
        this.arrImg.unshift(this.arrImg.pop());   // перенесем последнюю картинку в начало
    },
    getPrevImage() {
        // Получаем элемент слева от текущей открытой картинки.
        const prevSibling = this.openedImageEl.previousElementSibling;
        // Если элемент слева есть, его отдаем, если нет, то берем последний элемент в родительском контейнере.
        if (prevSibling) {
            return prevSibling;
        } else {
            return this.openedImageEl.parentElement.lastElementChild;
        }
    },

    /**
     * Закрывает (удаляет) контейнер для открытой картинки.
     */
    close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
    }
};

/*
**************************************************************************************
    Остальной код
**************************************************************************************
*/

catalogObj.init('catalog_id', catalog, basketObj, images, gallery);  // объект "Каталог"
basketObj.init('basket_id');                        // объект "Корзина"

// Инициализируем нашу галерею при загрузке страницы.
// window.onload = () => gallery.init({ previewSelector: '.catalog' });
