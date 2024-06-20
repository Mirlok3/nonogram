// Prevent right click for right click function
document.addEventListener('contextmenu', event => event.preventDefault());
const width = 10;
const height = 10;

// Cell class
class Cell {
    constructor(color, row) {
        this.color = color;
        this.tableCell = row.insertCell();
        this.marked = false;
    }

    getColor() { return this.color; }
}

class Table {
    constructor() {
        this.cells = [];
        this.table = document.createElement('table');
    }

    renderTable(height, width) {
        for (let i = 0; i < height; i++) {
            const row = this.table.insertRow();

            for (let j = 0; j < width; j++) {
                const rand = Math.random() > 0.5;
                const cell = new Cell(rand, row); // Create cell
                this.cells.push(cell); // Add cell to table

                // Add onclick func for evaluating cell to attribute
                // Add on left click func for marking cell
                cell.tableCell.addEventListener('click', () => this.cellClick(cell));
                cell.tableCell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.rightClick(cell);
                });

                // Add hover event listeners for row and col highlighting
                cell.tableCell.addEventListener('mouseover', () => this.highlightCell(cell.tableCell));
                cell.tableCell.addEventListener('mouseout', () => this.clearHighlights(cell.tableCell));

                //cell.tableCell.innerText = cell.getColor();  // Cheat

                // Add row maps
                if (j === width - 1) {
                    const mapCell = row.insertCell()
                    mapCell.style.backgroundColor = "gray"; // set background
                    mapCell.innerHTML = this.mapRow(i, j)
                }
            }
        }

        document.getElementById('myCanvas').appendChild(this.table);
    }

    mapRow(x) {
        let counter = 0, group = 0;
        const row = [];

        for (let i = width - 1; i >= 0; i--) {
            const cell = this.cells[(x * width) + i]; // current cell
            // Count marked cells,
            // when an unmarked is reached, add count to array
            if (cell && cell.getColor()) counter++;
            else if (counter !== 0) {
                row[group] = counter;
                group++;
                counter = 0;
            }
        }

        if (counter) row[group] = counter; // remove zero
        return row.reverse();
    }

    // console.log(i + "." + picross.cell[i].getColor() + "." + j + "," + counter + '|' + x)
    mapRows() {
        let rowNum = 0, counter = 0, group = 0;
        const rows = [];
        let row = [];

        // Go through Table()
        for (let i = 0; i < this.cells.length; i++) {
            // Count marked cells, when a unmarked is reached, add to array
            if (this.cells[i].getColor()) counter++;
            else if (counter !== 0) {
                row[group] = counter;
                group++;
                counter = 0;
            }

            // Add to array, start new row and reset
            if ((i + 1) % width === 0 && i !== 0) {
                if (counter !== 0) row[group] = counter; // avoid adding 0
                rows[rowNum] = row;
                rowNum++;

                counter = group = 0;
                row = [];
            }
        }

        console.log("rows:", rows);
        return rows;
    }

    mapCols() {
        let colNum = 0, counter = 0, group = 0;
        const cols = [];
        let col = [];

        for (let i = 0; i < width; i++) {
            for (let j = i; j < this.cells.length; j += width) {
                // Count marked cells, when a unmarked is reached, add to array
                if (this.cells[j].getColor()) counter++;
                else if (counter !== 0) {
                    col[group] = counter;
                    group++;
                    counter = 0;
                }
            }

            // Add to array
            if (counter !== 0) col[group] = counter;
            cols[colNum] = col;
            colNum++;

            counter = group = 0;
            col = [];
        }

        console.log("cols:", cols);
        return cols;
    }

    cellClick(cell) {
        if (cell.marked) return;

        const cellIndex = this.cells.indexOf(cell);
        const row = Math.floor(cellIndex / width);
        this.highlightRow(row);
        this.highlightColumn(cellIndex % width);

        // If colored cell, color blue, if not color gray and add X
        if (!cell.getColor()) {
            cell.tableCell.style.backgroundColor = "gray";
            cell.tableCell.innerHTML = "X";
        } else {
            cell.marked = true;
            cell.tableCell.style.backgroundColor = "dodgerblue";
        }
    }

    rightClick(cell) {
        if (cell.marked) return;

        const cellIndex = this.cells.indexOf(cell);
        const row = Math.floor(cellIndex / width);
        this.highlightRow(row);
        this.highlightColumn(cellIndex % width);

        // If colored cell, color gray, if not color blue and add X
        if (cell.getColor()) {
            cell.tableCell.style.backgroundColor = "dodgerblue";
            cell.tableCell.innerHTML = "X";
        } else {
            cell.marked = true;
            cell.tableCell.style.backgroundColor = "gray";
        }
    }

    highlightColumn(index) {
        for (let i = index; i < this.cells.length; i += width) {
            this.cells[i].tableCell.classList.add('highlight');
        }
    }

    highlightRow(row) {
        const rowStartIndex = row * width;
        const rowEndIndex = rowStartIndex + width;
        for (let i = rowStartIndex; i < rowEndIndex; i++) {
            this.cells[i].tableCell.classList.add('highlight');
        }
    }


    highlightCell(cell) {
        this.clearHighlights();
        const cellIndex = this.cells.findIndex(c => c.tableCell === cell);
        const row = Math.floor(cellIndex / width);
        this.highlightRow(row);
        this.highlightColumn(cellIndex % width);
    }

    clearHighlights() {
        const cells = document.querySelectorAll('td');
        cells.forEach(cell => cell.classList.remove('highlight'));
    }
}

let picross = new Table()
picross.renderTable(height, width);
picross.mapRows();
picross.mapCols();

