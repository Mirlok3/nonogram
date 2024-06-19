width = 5;
height = 5;

// Cell class
class Cell {
    constructor(color, row) {
        this.color = color;
        this.tableCell = row.insertCell();
    }

    getColor() { return this.color; }
}

class Table {
    constructor() {
        this.cell = [];
        this.table = document.createElement('table');
        this.count = 1;
    }

    renderTable(width, height) {
        for (let i = 0; i < height; i++) {
            let row = picross.table.insertRow();

            for (let j = 0; j < width; j++) {
                let rand = Math.random() > 0.5;
                let cell = new Cell(rand, row); // Create cell
                picross.cell[picross.count] = cell; // Add cell to table

                // Add onclick func to attribute
                cell.tableCell.setAttribute("onclick", `cellClick(${picross.count})`);
                // cell.tableCell.innerText = cell.getColor();  // Cheat

                picross.count++;
            }
        }

        document.getElementById('myCanvas').appendChild(picross.table);
    }

    // console.log(i + "." + picross.cell[i].getColor() + "." + j + "," + counter + '|' + x)
    mapRowsX() {
        let rowNum = 0, counter = 0, group = 0;
        let rows = [], row = [];

        // Go through Table()
        for (let i = 1; i < this.count; i++) {
            // Count marked cells, when a unmarked is reached, add to array
            if (picross.cell[i].getColor()) {
                counter++;
            } else {
                if (counter !== 0) {
                    row[group] = counter;
                    group++;
                }

                counter = 0;
            }

            // Start new row and reset
            if (i % width == 0 && i != 0) {
                // console.log(rowNum);
                if (counter !== 0) row[group] = counter;
                rows[rowNum] = row;
                rowNum++;

                row = [];
                group = 0;
                counter = 0;
            }
        }

        console.log("rows:");
        console.log(rows);
    }

    mapRowsY() {
        let colNum = 0, counter = 0, group = 0;
        let cols = [], col = [];

        // Go through table horizontaly by adding the width
        for (let i = 1; i < this.count; i += width) {
            // Count marked cells, when a unmarked is reached, add to array
            if (picross.cell[i].getColor()) {
                counter++;
            } else {
                if (counter !== 0) {
                    col[group] = counter;
                    group++;
                }

                counter = 0;
            }

            if (i + width >= this.count && colNum <= height - 1) {
                // Add current column to column array
                if (counter !== 0) col[group] = counter;
                cols[colNum] = col;

                // Set for next column
                colNum++;
                i = colNum - width + 1;
                col = [];
                group = 0;
                counter = 0;

            }
        }

        console.log("cols:");
        console.log(cols);
    }
}

let picross = new Table()
picross.renderTable(height, width);
picross.mapRowsX();
picross.mapRowsY();

function cellClick(count) {
    console.log(count);
    console.log(picross.cell[count].getColor());

    picross.cell[count].tableCell.innerText = picross.cell[count].getColor();
}
