// const { json } = require("express")
// const { delete } = require("../routes/add")
const toCurrency = price => {
	return new Intl.NumberFormat('en-US', {              //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
		currency: 'USD',
		style: 'currency'
	}).format(price)
}
document.querySelectorAll('.price').forEach(a => {
	a.textContent = toCurrency(a.textContent)
})
document.querySelectorAll('.pro__price').forEach(a => {
	a.textContent = toCurrency(a.textContent)
})
document.querySelectorAll('.pro__total').forEach(a => {
	a.textContent = toCurrency(a.textContent)
})


//--++ уменьшение:
//если ли элем #card
const $card = document.querySelector('#card')             //$ либо jquery либо html элем
if ($card) {
	$card.addEventListener('click', event => {
		if (event.target.classList.contains('js-delete')) {                  //есть ли такой класс
			const id = event.target.dataset.id
			//// console.log('------- const id: ', id, '----------app.js-------')
			const csrf = event.target.dataset.csrf

			//--!!!!!!!! вызвать аякс запрос с клиента и отпр на сервер
			fetch('/basket/remove/' + id, {               //+ id будем понимать какой именно id нужно удалить
				method: 'delete',                        //спец http медот говорит что необх удалять элем
				headers: {
					'X-XSRF-TOKEN': csrf
				}
			}).then(res => res.json())                      //не можем испл async awai тк работаем в браузере(поэтому воспольз промисом)
				.then(card => {
					if (card.productsHi.length) {                     //будем обновлять таблицу
						const html = card.productsHi.map(c => {
							return `
							<tr>
							<td>${c.title}</td>
							<td id="td">
							<button class="btn waves-effect waves-light js-delete" type="submit" name="action" data-id='${c.id}' data-csrf="${csrf}">-</button>

							<span class="z">${c.count}</span>
							<button class="btn waves-effect waves-light js-add__a" type="submit" name="action" data-id='${c.id}' data-csrf="${csrf}">+</button>

							</td>
							
							<td>${toCurrency(c.price)}</td>
							<td>${toCurrency(c.total)}</td>
							<td>
								<button class="btn btn-small js-remove" data-id='${c.id}' data-csrf="${csrf}">X</button>
							</td>
						</tr>
							`
						}).join('')              //т к html это массив применяем медот join к строке
						$card.querySelector('tbody').innerHTML = html
						$card.querySelector('.price').textContent = toCurrency(card.price)    //перещитываем цену
					}
					else {
						$card.innerHTML = '<p>Корзина пуста</p>'
					}
				})
		}


		//+++-удаление:
		if (event.target.classList.contains('js-remove')) {                  //есть ли такой класс
			const id = event.target.dataset.id
			//// console.log('------- const id: ', id, '----------app.js-------')
			const csrf = event.target.dataset.csrf

			//--!!!!!!!! вызвать аякс запрос с клиента и отпр на сервер
			fetch('/basket/del/' + id, {               //+ id будем понимать какой именно id нужно удалить
				method: 'delete',                        //спец http медот говорит что необх удалять элем
				headers: {
					'X-XSRF-TOKEN': csrf
				}
			}).then(res => res.json())                      //не можем испл async awai тк работаем в браузере(поэтому воспольз промисом)
				.then(card => {
					if (card.productsHi.length) {                     //будем обновлять таблицу
						const html = card.productsHi.map(c => {
							return `
							<tr>
							<td>${c.title}</td>
							<td id="td">
							<button class="btn waves-effect waves-light js-add__a" type="submit" name="action" data-id='${c.id}' data-csrf="${csrf}">+</button>

							<span class="z">${c.count}</span>
							<button class="btn waves-effect waves-light js-delete" type="submit" name="action" data-id='${c.id}' data-csrf="${csrf}">-</button>

							</td>
							
							<td>${toCurrency(c.price)}</td>
							<td>${toCurrency(c.total)}</td>
							<td>
								<button class="btn btn-small js-remove" data-id='${c.id}' data-csrf="${csrf}">X</button>
							</td>
						</tr>
							`
						}).join('')              //т к html это массив применяем медот join к строке
						$card.querySelector('tbody').innerHTML = html
						$card.querySelector('.price').textContent = toCurrency(card.price)    //перещитываем цену
					}
					else {
						$card.innerHTML = '<p>Корзина пуста</p>'
					}
				})
		}
		//------------------------------------------^

		//+++ увеличить кол-во:
		if (event.target.classList.contains('js-add__a')) {
			const id = event.target.dataset.id
			// console.log('------- const id: ', id, '----------app.js-------')
			const csrf = event.target.dataset.csrf


			fetch('/basket/addidas/' + id, {
				method: 'POST',
				headers: {
					'X-XSRF-TOKEN': csrf
				}
			}).then(res => res.json())
				.then(plus => {
					const html1 = plus.productsHi.map(c => {
						return `
						<tr>
						<td>${c.title}</td>
						<td id="td">
						<button class="btn waves-effect waves-light js-delete" type="submit" name="action" data-id='${c.id}' data-csrf="${csrf}">-</button>

						<span class="z">${c.count}</span>
						<button class="btn waves-effect waves-light js-add__a" type="submit" name="action" data-id='${c.id}' data-csrf="${csrf}">+</button>

						</td>
						
						<td>${toCurrency(c.price)}</td>
						<td>${toCurrency(c.total)}</td>
						<td>
							<button class="btn btn-small js-remove" data-id='${c.id}' data-csrf="${csrf}">X</button>
						</td>
					</tr>
						`
					}).join('')              //т к html это массив применяем медот join к строке
					$card.querySelector('tbody').innerHTML = html1
					$card.querySelector('.price').textContent = toCurrency(plus.price)    //перещитываем цену
				})
		}
	})
}

// https://materializecss.com/tabs.html           Initialization
M.Tabs.init(document.querySelectorAll('.tabs'));


//------------------------------------------------------------------------------------
// У каждого пользователя будет случайный стиль для блока с сообщенями,
// поэтому в этом кусочке кода мы получаем случайные числа
var min = 1;
var max = 6;
var random = Math.floor(Math.random() * (max - min)) + min;

// Устаналиваем класс в переменную в зависимости от случайного числа
// Эти классы взяты из Bootstrap стилей
var alertClass;
switch (random) {
	case 1:
		alertClass = 'secondary';
		break;
	case 2:
		alertClass = 'danger';
		break;
	case 3:
		alertClass = 'success';
		break;
	case 4:
		alertClass = 'warning';
		break;
	case 5:
		alertClass = 'info';
		break;
	case 6:
		alertClass = 'light';
		break;
}
// $(function () {
// 	// Включаем socket.io и отслеживаем все подключения

// 	var socket = io.connect('http://localhost:3000');
// 	console.log('-------------1------------', socket)

// 	// Делаем переменные на:
// 	var $form = $("#messForm"); // Форму сообщений
// 	var $name = $("#name"); // Поле с именем
// 	var $textarea = $("#message"); // Текстовое поле
// 	var $all_messages = $("#all_mess"); // Блок с сообщениями

// 	// Отслеживаем нажатие на кнопку в форме сообщений
// 	$form.submit(function (event) {
// 		// Предотвращаем классическое поведение формы
// 		event.preventDefault();
// 		// В сокет отсылаем новое событие 'send mess',
// 		// в событие передаем различные параметры и данные
// 		socket.emit('send mess', { mess: $textarea.val(), name: $name.val(), className: alertClass });
// 		// Очищаем поле с сообщением
// 		$textarea.val('');
// 	});

// 	// Здесь отслеживаем событие 'add mess', 
// 	// которое должно приходить из сокета в случае добавления нового сообщения
// 	socket.on('add mess', function (data) {
// 		// Встраиваем полученное сообщение в блок с сообщениями
// 		// У блока с сообщением будет тот класс, который соответвует пользователю что его отправил
// 		$all_messages.append("<div class='alert alert-" + data.className + "'><b>" + data.name + "</b>: " + data.mess + "</div>");
// 	});

// });