'use strict';

/****************************************************************************
 * 1.	Создать функцию, генерирующую шахматную доску. 
 *      При этом можно использовать любые html-теги по своему желанию. 
 *      Доска должна быть разлинована соответствующим образом, т.е. чередовать черные и белые ячейки. 
 *      Строки должны нумероваться числами от 1 до 8, столбцы – латинскими буквами A, B, C, D, E, F, G, H.
 */

function initCells() {
    let containerElement = document.getElementById('chessBoard');
    let rowCount = 8, colCount = 8;
    let titleRow = ' 87654321 ';
    let titleCol = ' abcdefgh ';
    let borderOut = '1px solid black';

    for (let row = 0; row < rowCount + 2; row++) {
        const trElem = document.createElement('tr');
        containerElement.appendChild(trElem);

        for (let col = 0; col < colCount + 2; col++) {
            const cell = document.createElement('td');
            if (row == 0 || col == 0 || row == rowCount + 1 || col == colCount + 1) {    // Клетки окантовки (заголовки)
                if (row == 0 || row == rowCount + 1)
                    cell.textContent = titleCol[col];
                else
                    cell.textContent = titleRow[row];
                // if (row == 0 || col == colCount + 1)    // косячит внешний бордюр по краю доски...
                if (row == 0 && col != 0 && col != colCount + 1 || col == colCount + 1 && row != 0)
                    cell.style.transform = "rotate(180deg)";    // верхняя строка и правая колонка перевернуты для 2-го игрока
                // сделаем красивый край доски
                cell.style.border = "none";
                if (row == 0) cell.style.borderTop = borderOut;
                if (row == rowCount + 1) cell.style.borderBottom = borderOut;
                if (col == 0) cell.style.borderLeft = borderOut;
                if (col == colCount + 1) cell.style.borderRight = borderOut;
            }
            else {
                if (row % 2 != col % 2)
                    cell.style.backgroundColor = "black";
            }
            trElem.appendChild(cell);
        }
    }
}

initCells();