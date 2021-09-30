/****************************************************************************
Lesson_2_04 (Регулярные выражения)
    1.	Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки. Придумать шаблон, который заменяет одинарные кавычки на двойные.
    2.	Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.
    3.	*Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить. При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
    4.	Имя содержит только буквы.
    5.	Телефон имеет вид +7(000)000-0000.
    6.	E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
    7.	Текст произвольный.
    8.	Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой и сообщить пользователю об ошибке.

 ****************************************************************************/


// РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ
/*
1.	Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки. 
    Придумать шаблон, который заменяет одинарные кавычки на двойные.
2.	Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.
*/

const large_text = `
                One: 'Hi Mary.' Two: 'Oh, hi.'<br>
                One: 'How are you doing?'<br>
                Two: 'I'm doing alright. How about you?'<br>
                One: 'Not too bad. The weather is great isn't it?'<br>
                Two: 'Yes. It's absolutely beautiful today.'<br>
                One: 'I wish it was like this more frequently.'<br>
                Two: 'Me too.'<br>
                One: 'So where are you going now?'<br>
                Two: 'I'm going to meet a friend of mine at the department store.'<br>
                One: 'Going to do a little shopping?'<br>
                Two: 'Yeah, I have to buy some presents for my parents.'<br>
                One: 'What's the occasion?'<br>
                Two: 'It's their anniversary.'<br>
                One: 'That's great. Well, you better get going. You don't want to be late.'<br>
                Two: 'I'll see you next time.'<br>
                One: 'Sure. Bye.'
                `
textBlock = document.getElementById('large_text');
textBlock.insertAdjacentHTML('beforeend', `<a>${large_text}</a>`);

const regexp = /\B\'/gm;    // /\B/             Не граница слова (странно, но работает)
// const regexp = /^'|(\s)'|'(\s)|'$/gm;
// const regexp = new RegExp('\B\'', 'gm');
const large_text2 = large_text.replace(regexp, `<u>"</u>`);            

textBlock.insertAdjacentHTML('beforeend', `<a><br><br>Заменим одинарные кавычки на двойные <i>(при помощи регулярного выражения)</i>:</a>`);
textBlock.insertAdjacentHTML('beforeend', `<a>${large_text2}</a>`);


/*
    3.	*Создать форму обратной связи с полями: Имя, Телефон, E-mail, текст, кнопка Отправить. При нажатии на кнопку Отправить произвести валидацию полей следующим образом:
    4.	Имя содержит только буквы.
    5.	Телефон имеет вид +7(000)000-0000.
    6.	E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru.
    7.	Текст произвольный.
    8.	Если одно из полей не прошло валидацию, необходимо выделить это поле красной рамкой и сообщить пользователю об ошибке.

    Источник (http://cleanjs.ru/articles/validaciya-formy-obratnoj-svyazi.html)

    Для телефона:
    /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/

    Съедает следующие телефоны: 
    +7(903)888-88-88
    8(999)99-999-99
    +380(67)777-7-777
    001-541-754-3010
    +1-541-754-3010
    19-49-89-636-48018
    +233 205599853
*/

;(function() {
	'use strict';
 
	class Form {
        // паттерны RegExp 
        static patternName = /^[а-яёА-ЯЁ\s]+$/;     // только русские имена
        static patternMail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/;
        static patternPhone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        // static patternPhone = /^\+7\(([0-9]){3}\)([0-9]){3}-([0-9]){4}$/;   // для +7(000)000-0000
        // массив с сообщениями об ошибке
        // эти сообщения можно разместить и внутри кода валидации, но лучше,
        // если они будут находиться в одном месте
        // это облегчит их редактирование, а так же проще будет прописать новые,
        // если решите добавить критерии валидации
        static errorMess = [
            'Незаполненное поле ввода',             // 0
            'Введите Ваше реальное имя (русскими буквами)',            // 1
            'Укажите Вашу электронную почту',       // 2
            'Неверный формат электронной почты',    // 3
            'Укажите тему сообщения',               // 4
            'Напишите текст сообщения',             // 5
            'Укажите Ваш номер телефона',           // 6
            `Неверный формат номера телефона (+7(903)888-88-88, 8(999)99-999-99, +380(67)777-7-777, 
                001-541-754-3010, +1-541-754-3010, 19-49-89-636-48018, +233 205599853)`,      // 7
        ];
        constructor(form) {
            this.form = form;
            // коллекция полей формы из которой мы будем извлекать данные
            this.fields = this.form.querySelectorAll('.form-control');
            // объект кнопки, на который повесим обработчик события начала валидации формы
            // и отправки её значений на сервер
            this.btn = this.form.querySelector('[type=submit]');
            // флаг ошибки валидации
            this.iserror = false;
            // регистрируем обработчики событий
            this.registerEventsHandler();
        }
        static getElement(el) {
            // получение элемента, в который будет выводиться
            // текст ошибки
            return el.parentElement.nextElementSibling;
        }
        registerEventsHandler() {
            // запуск валидации при отправке формы
            this.btn.addEventListener('click', this.validForm.bind(this));
            // очистка ошибок при фокусе поля ввода
            this.form.addEventListener('focus', () => {
                // находим активный элемент формы
                const el = document.activeElement;
                // если этот элемент не <button type="submit">,
                // вызываем функцию очистки <span class="error"> от текста ошибки
                if (el === this.btn) return;
                this.cleanError(el);
            }, true);
            // запуск валидации поля ввода при потере им фокуса
            for (let field of this.fields) {
                field.addEventListener('blur', this.validBlurField.bind(this));
	        }
        }
        validForm(e) {
            // отменяем действие браузера по умолчания при клике по
            // кнопке формы <button type="submit">, чтобы не происходило обновление страницы
            e.preventDefault();
            // объект представляющий данные HTML формы
            const formData = new FormData(this.form);
            // объявим переменную error, в которую будем записывать текст ошибки
            let error;
         
            // перебираем свойства объекта с данными формы
            for (let property of formData.keys()) {
                // вызываем функцию, которая будет сравнивать 
                // значение свойства с паттерном RegExp и возвращать результат
                // сравнения в виде пустой строки или текста ошибки валидации
                error = this.getError(formData, property);
                if (error.length == 0) continue;
                // устанавливаем флаг наличия ошибки валидации
                this.iserror = true;
                // выводим сообщение об ошибке
                this.showError(property, error);
            }
            if (this.iserror) return;
            // вызываем функцию отправляющую данные формы,
            // хранящиеся в объекте formData, на сервер
            this.sendFormData(formData);
        }
        validBlurField(e) {
            const target = e.target;
            // имя поля ввода потерявшего фокус 
            const property = target.getAttribute('name');
            // значение поля ввода
            const value = target.value;
         
            // создаём пустой объект и записываем в него
            // данные в формате 'имя_поля': 'значение', полученные
            // от поля ввода потерявшего фокус
            const formData = new FormData();
            formData.append(property, value);
         
            // запускаем валидацию поля ввода потерявшего фокус
            const error = this.getError(formData, property);
            if (error.length == 0) return;
            // выводим текст ошибки
            this.showError(property, error);
        }
        getError(formData, property) {
            let error = '';
            // создаём литеральный объект validate
            // каждому свойству литерального объекта соответствует анонимная функция, в которой
            // длина значения поля, у которого атрибут 'name' равен 'property', сравнивается с 0,
            // а само значение - с соответствующим паттерном
            // если сравнение истинно, то переменной error присваивается текст ошибки
            const validate = {
                username: () => {
                    if (formData.get('username').length == 0 || Form.patternName.test(formData.get('username')) == false) {
                        error = Form.errorMess[1];
                    }
                },
                userphone: () => {
                    if (formData.get('userphone').length == 0) {
                        error = Form.errorMess[6];
                    } else if (Form.patternPhone.test(formData.get('userphone')) == false) {
                        error = Form.errorMess[7];
                    }
                },
                usermail: () => {
                    if (formData.get('usermail').length == 0) {
                        error = Form.errorMess[2];
                    } else if (Form.patternMail.test(formData.get('usermail')) == false) {
                        error = Form.errorMess[3];
                    }
                },
                subject: () => {
                    if (formData.get('subject').length == 0) {
                        error = Form.errorMess[4];
                    }
                },
                textmess: () => {
                    if (formData.get('textmess').length == 0) {
                        error = Form.errorMess[5];
                    }
                }
            }
         
            if (property in validate) {
                // если после вызова анонимной функции validate[property]() переменной error
                // было присвоено какое-то значение, то это значение и возвращаем,
                // в противном случае значение error не изменится
                validate[property]();
            }
            return error;
        }
        showError(property, error) {
            // получаем объект элемента, в который введены ошибочные данные
            const el = this.form.querySelector(`[name=${property}]`);
            // с помощью DOM-навигации находим <span>, в который запишем текст ошибки
            const errorBox = Form.getElement(el);
         
            el.classList.add('form-control_error');
            // записываем текст ошибки в <span>
            errorBox.innerHTML = error;
            // делаем текст ошибки видимым
            errorBox.style.display = 'block';
        }
        cleanError(el) {
            // с помощью DOM-навигации находим <span>, в который записан текст ошибки
            const errorBox = Form.getElement(el);
            el.classList.remove('form-control_error');
            errorBox.removeAttribute('style');
            this.iserror = false;
        }
        sendFormData(formData) {
            alert('Форма отправлена !!!')
            return
            let xhr = new XMLHttpRequest();
            // указываем метод передачи данных, адрес php-скрипта, который эти данные
            // будет обрабатывать и способ отправки данных.
            // значение 'true' соответствует асинхронному запросу
            xhr.open('POST', '/sendmail.php', true);
            // xhr.onreadystatechange содержит обработчик события,
            // вызываемый когда происходит событие readystatechange
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // здесь расположен код вашей callback-функции
                        // например, она может выводить сообщение об успешной отправке письма
                    } else {
                        // здесь расположен код вашей callback-функции
                        // например, она может выводить сообщение об ошибке
                    }
                } else {
                    // здесь расположен код вашей callback-функции
                    // например, она может выводить сообщение об ошибке
                }
            }
            // отправляем данные формы
            xhr.send(formData);
        }
    }
    
 
	// коллекция всех HTML форм на странице
	const forms = document.querySelectorAll('[name=feedback]');
	// если формы на странице отсутствуют, то прекращаем работу функции
	if (!forms) return;
	// перебираем полученную коллекцию элементов
	for (let form of forms) {
		// создаём экземпляр формы
		const f = new Form(form);
	}

    
})();
    

