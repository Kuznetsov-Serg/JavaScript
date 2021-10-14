const express = require('express');
const fs = require('fs');
const app = express();
const format = require('date-fns/format');

app.use(express.static('.'));
app.use(express.json());

app.get('/catalog', (req, res) => {
  fs.readFile('./catalog.json', (err, data) => {
    if (err) {
      throw Error(err);
    } else {
      res.send(data);
    }
  })
});

app.get('/basket', (req, res) => {
  fs.readFile('./basket.json', (err, data) => {
    if (err) {
      throw Error(err);
    } else {
      res.send(data);
    }
  })
});

app.post('/addToBasket', (req, res) => {
  fs.readFile('basket.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const basket = JSON.parse(data);
      const idProduct = req.body.id;
      console.log('addToBasket on Server id= '+ idProduct);

      var basketItem = basket.find((item) => idProduct === item.id);  // ищем в корзине такой-же товар
      if (basketItem) {             // нашли
          basketItem.count++;       // увеличиваем количество товара в корзине
      }
      else {
          basketItem = JSON.parse(JSON.stringify(req.body));  // делаем клонирование 
          basketItem.count = 1;  
          basket.push(basketItem);
      }
      res.send(writeBasket(basket, req.body.product_name, 'addToBasket'));
    }
  });
});

app.post('/reduceFromBasket', (req, res) => {
  fs.readFile('basket.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const basket = JSON.parse(data);
      const idProduct = req.body.id;
      console.log('reduceFromBasket on Server id= '+ idProduct);

      for (let index = 0; index < basket.length; index++) {
        if (basket[index].id === idProduct) {
            if (basket[index].count < 2)            // после уменьшения количества останется 0 товаров
                basket.splice(index, 1);            // удалим элемент
            else
                basket[index].count -= 1;           // уменьшим количество товара
            break;
        }
      }
      res.send(writeBasket(basket, req.body.product_name, 'reduceFromBasket'));
    }
  });
});

app.post('/delFromBasket', (req, res) => {
  fs.readFile('basket.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const basket = JSON.parse(data);
      const idProduct = req.body.id;
      console.log('delFromBasket on Server id= '+ idProduct);

      for (let index = 0; index < basket.length; index++) {
          if (basket[index].id === idProduct) {
              basket.splice(index, 1);          // удалим элемент
              break;
          }
      }
      res.send(writeBasket(basket, req.body.product_name, 'delFromBasket'));
    }
  });
});

// записать содержимое корзины и stats.json (лог-файл)
const writeBasket = async (basket, product_name, typeOp) => {
  fs.writeFile('basket.json', JSON.stringify(basket), (err) => {
    if (err) {
      return(`{"result": "Fail ${typeOp}", "basket": ${basket}}`);
    } else {
      return(
        fs.readFile('stats.json', 'utf8', (err, data) => {
          if (err) {
            return('{"result": "Fail read stats.json"}');
          } else {
            let stats = JSON.parse(data);
            const obj = {'date': format(new Date(), 'dd-MM-yyyy HH:mm:ss'), 'operation': typeOp, 'product_name': product_name};
            stats.push(obj);
            return(
              fs.writeFile('stats.json', JSON.stringify(stats), (err) => {
                if (err) {
                  return(`{"result": "Fail add to stats.json"`);
                } else {
                  return(`{"result": "good ${typeOp}", "basket": ${basket}}`);
                }
              })
            )
          }
        })
      )
    }
  })
};

app.listen(3000, () => { console.log('express server started on 3000 port') });