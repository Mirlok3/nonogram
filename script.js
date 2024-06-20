const width = 20;
const height = 20;
let leftMouseDown = false;
let rightMouseDown = false;
let middleMouseDown = false;

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
        this.renderColIndexMap();

        for (let i = 0; i < height; i++) {
            const row = this.table.insertRow();

            // Add index cells
            const indexCell = row.insertCell();
            indexCell.innerHTML = i + 1;
            indexCell.className = "indexCell";

            for (let j = 0; j < width; j++) {
                const rand = Math.random() > 0.5;
                const cell = new Cell(rand, row); // Create cell
                this.cells.push(cell); // Add cell to table

                // EVENT LISTENERS FOR CELL
                // Single cell click mark
                cell.tableCell.addEventListener('mousedown', (e) => {
                    leftMouseDown = e.button === 0;
                    rightMouseDown = e.button === 2;
                    middleMouseDown = e.button === 1;

                    e.preventDefault(); // prevent text selection

                    if (leftMouseDown) {
                        this.cellClick(cell);
                    } else if (rightMouseDown) {
                        this.rightClick(cell);
                    } else if (middleMouseDown) {
                        this.markCell(cell);
                    }
                });

                // Drag marking
                cell.tableCell.addEventListener('mouseover', () => {
                    if (leftMouseDown) {
                        this.cellClick(cell);
                    } else if (rightMouseDown) {
                        this.rightClick(cell);
                    }
                });

                // row and col highlighting
                cell.tableCell.addEventListener('mouseover', () => this.highlightCell(cell.tableCell));
                cell.tableCell.addEventListener('mouseout', () => this.clearHighlights(cell.tableCell));

                // prevent context menu
                cell.tableCell.addEventListener('contextmenu', (e) => e.preventDefault());
                //cell.tableCell.innerText = cell.getColor();  // Cheat

                // Map current row
                if (j === width - 1) {
                    const mapCell = row.insertCell()
                    mapCell.className = "mapCellRows";
                    mapCell.innerHTML = this.mapRow(i, j)
                }
            }
        }

        this.renderColMap();
        document.getElementById('myCanvas').appendChild(this.table);
        document.addEventListener('mouseup', () => {
            leftMouseDown = false;
            rightMouseDown = false;
        });
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

        return cols;
    }

    renderColMap() {
        const row = this.table.insertRow();
        row.insertCell();

        const cols = this.mapCols();
        for (let i = 0; i < cols.length; i++) {
            const cell = row.insertCell()
            cell.innerHTML = cols[i].join('<br>'); // Separate array nums with <br>
            cell.className = "mapCellCols";
        }

        row.insertCell();
    }

    cellClick(cell) {
        if (cell.marked) return;
        cell.marked = true;

        // If colored cell, color blue, if not color gray and add X
        if (!cell.getColor()) {
            cell.tableCell.style.backgroundColor = "gray";
            cell.tableCell.innerHTML = "X";
        } else {
            cell.tableCell.style.backgroundColor = "dodgerblue";
        }
    }

    // TODO: drag click in only one direction

    rightClick(cell) {
        if (cell.marked) return;
        cell.marked = true;

        // If colored cell, color gray, if not color blue and add X
        if (cell.getColor()) {
            cell.tableCell.style.backgroundColor = "dodgerblue";
            cell.tableCell.innerHTML = "X";
        } else {
            cell.tableCell.style.backgroundColor = "gray";
        }

    }

    markCell(cell) {
        if (cell.marked) return;

        if (cell.tableCell.style.backgroundColor === "red") {
            cell.tableCell.style.backgroundColor = "";
        } else {
            cell.tableCell.style.backgroundColor = "red";
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

    renderColIndexMap() {
        const row = this.table.insertRow();
        row.insertCell();
        for (let i = 0; i < width; i++) {
            const cell = row.insertCell();
            cell.innerHTML = i + 1;
            cell.className = "indexCellCol";
        }
        row.insertCell();
    }
}

let picross = new Table()
picross.renderTable(height, width);
// picross.mapRows();
// picross.mapCols();

