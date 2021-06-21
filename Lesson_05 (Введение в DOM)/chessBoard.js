'use strict';

/****************************************************************************
 * 1.	Создать функцию, генерирующую шахматную доску. 
 *      При этом можно использовать любые html-теги по своему желанию. 
 *      Доска должна быть разлинована соответствующим образом, т.е. чередовать черные и белые ячейки. 
 *      Строки должны нумероваться числами от 1 до 8, столбцы – латинскими буквами A, B, C, D, E, F, G, H.
 */


/**
 * @property {HTMLElement} gameContainerEl Контейнер игры.
 * @property {{name: string, color: string, pos: string}[]} figures Фигуры в игре.
 * @property {object} figureHtml Содержит информацию о том, как отобразить фигуры на поле.
 */
const chess = {
    containerElement: document.getElementById('chessBoard'),

    figures: [
        { name: 'p', color: 'w', pos: 'a2' },
        { name: 'p', color: 'w', pos: 'b2' },
        { name: 'p', color: 'w', pos: 'c2' },
        { name: 'p', color: 'w', pos: 'd2' },
        { name: 'p', color: 'w', pos: 'e2' },
        { name: 'p', color: 'w', pos: 'f2' },
        { name: 'p', color: 'w', pos: 'g2' },
        { name: 'p', color: 'w', pos: 'h2' },
        { name: 'R', color: 'w', pos: 'a1' },
        { name: 'N', color: 'w', pos: 'b1' },
        { name: 'B', color: 'w', pos: 'c1' },
        { name: 'Q', color: 'w', pos: 'd1' },
        { name: 'K', color: 'w', pos: 'e1' },
        { name: 'B', color: 'w', pos: 'f1' },
        { name: 'N', color: 'w', pos: 'g1' },
        { name: 'R', color: 'w', pos: 'h1' },

        { name: 'p', color: 'b', pos: 'a7' },
        { name: 'p', color: 'b', pos: 'b7' },
        { name: 'p', color: 'b', pos: 'c7' },
        { name: 'p', color: 'b', pos: 'd7' },
        { name: 'p', color: 'b', pos: 'e7' },
        { name: 'p', color: 'b', pos: 'f7' },
        { name: 'p', color: 'b', pos: 'g7' },
        { name: 'p', color: 'b', pos: 'h7' },
        { name: 'R', color: 'b', pos: 'a8' },
        { name: 'N', color: 'b', pos: 'b8' },
        { name: 'B', color: 'b', pos: 'c8' },
        { name: 'Q', color: 'b', pos: 'd8' },
        { name: 'K', color: 'b', pos: 'e8' },
        { name: 'B', color: 'b', pos: 'f8' },
        { name: 'N', color: 'b', pos: 'g8' },
        { name: 'R', color: 'b', pos: 'h8' },
    ],
    figureHtml: {
        pw: '&#9817;',
        Bw: '&#9815;',
        Nw: '&#9816;',
        Rw: '&#9814;',
        Qw: '&#9813;',
        Kw: '&#9812;',

        pb: '&#9823;',
        Bb: '&#9821;',
        Nb: '&#9822;',
        Rb: '&#9820;',
        Qb: '&#9819;',
        Kb: '&#9818;',
    },

    renderMap() {
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

                // Добавляем каждому полю data аттрибуты о номере колонки и номере строки.
                cell.dataset.row = titleRow[row].toString();
                cell.dataset.col = titleCol[col].toString();

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
                        cell.style.backgroundColor = "gray";
                }
                trElem.appendChild(cell);
            }
        }
    },
    /**
     * Отображает фигуры на поле.
     */
    renderFigures() {
        // Перебираем все фигуры, которые есть в массиве.
        for (const figure of this.figures) {
            // Получаем колонку и строку, где стоит фигура.
            const col = figure.pos.charAt(0);
            const row = figure.pos.charAt(1);
            // Находим нужную ячейку, ставим ей innerHTML взятый из объекта this.figureHtml,
            // ключ - это два символа, имя фигуры и цвет, в итоге получим символ фигуры.
            document.querySelector(`[data-col='${col}'][data-row='${row}']`).innerHTML =
                this.figureHtml[figure.name + figure.color];
        }

    }
}

// Запускаем метод отображения карты.
chess.renderMap();
// Запускаем метод отображения фигур.
chess.renderFigures();