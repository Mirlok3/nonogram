// Prevent right click for right click function
document.addEventListener('contextmenu', event => event.preventDefault());
width = 10;
height = 10;

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
        this.cell = [];
        this.table = document.createElement('table');
        this.count = 1;
    }

    renderTable(height, width) {
        for (let i = 0; i < height; i++) {
            let row = picross.table.insertRow();

            for (let j = 0; j < width; j++) {
                let rand = Math.random() > 0.5;
                let cell = new Cell(rand, row); // Create cell
                picross.cell[picross.count] = cell; // Add cell to table

                // Add onclick func for evaluating cell to attribute
                cell.tableCell.setAttribute("onclick", `cellClick(${picross.count})`);
                // Add on left click func for marking cell
                cell.tableCell.setAttribute("oncontextmenu", `rightClick(${picross.count})`);

                //cell.tableCell.innerText = cell.getColor();  // Cheat

                // Add row maps
                if (j == width - 1) {
                    let mapCell = row.insertCell()
                    mapCell.style.backgroundColor = "gray"; // set background
                    mapCell.innerHTML = this.mapRow(i, j)
                }

                picross.count++;
            }
        }

        document.getElementById('myCanvas').appendChild(picross.table);
    }

    mapRow(x) {
        let counter = 0, group = 0;
        let row = [];

        for (let i = width; i > 0; i--) {
            // Count marked cells,
            // when an unmarked is reached, add count to array
            if (picross.cell[(x * width) + i].getColor()) counter++;
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
        let rows = [], row = [];

        // Go through Table()
        for (let i = 1; i < this.count; i++) {
            // Count marked cells, when a unmarked is reached, add to array
            if (picross.cell[i].getColor()) counter++;
            else if (counter !== 0) {
                row[group] = counter;
                group++;
                counter = 0;
            }

            // Add to array, start new row and reset
            if (i % width == 0 && i != 0) {
                if (counter !== 0) row[group] = counter; // avoid adding 0
                rows[rowNum] = row;
                rowNum++;

                counter = group = 0;
                row = [];
            }
        }

        console.log("rows:");
        console.log(rows);
        return rows;
    }

    mapCols() {
        let colNum = 0, counter = 0, group = 0;
        let cols = [], col = [];

        // Go through table horizontaly by adding the width
        for (let i = 1; i < this.count; i += width) {
            // Count marked cells, when a unmarked is reached, add to array
            if (picross.cell[i].getColor()) counter++;
            else if (counter !== 0) {
                col[group] = counter;
                group++;
                counter = 0;
            }

            // Add to array, start new row and reset
            if (i + width >= this.count && colNum <= width - 1) {
                if (counter !== 0) col[group] = counter;
                cols[colNum] = col;
                colNum++;

                i = colNum - width + 1; // Reset i by one for new col
                counter = group = 0;
                col = [];
            }
        }

        console.log("cols:");
        console.log(cols);
    }

}

let picross = new Table()
picross.renderTable(height, width);
picross.mapRows();
picross.mapCols();

function cellClick(count) {
    if (picross.cell[count].marked) return

    // If colored cell, color blue, if not color gray and add X
    if (!picross.cell[count].getColor()) {
        picross.cell[count].tableCell.style.backgroundColor = "gray";
        picross.cell[count].tableCell.innerHTML = "X";
    } else {
        picross.cell[count].marked = true;
        picross.cell[count].tableCell.style.backgroundColor = "dodgerblue";
    }
}

function rightClick(count) {
    if (picross.cell[count].marked) return

    // If colored cell, color gray, if not color blue and add X
    if (picross.cell[count].getColor()) {
        picross.cell[count].tableCell.style.backgroundColor = "dodgerblue";
        picross.cell[count].tableCell.innerHTML = "X";
    } else {
        picross.cell[count].marked = true;
        picross.cell[count].tableCell.style.backgroundColor = "gray";
    }
}

// // Ensure the script runs after the DOM is fully loaded
// document.addEventListener("DOMContentLoaded", function() {
//     // Attach event listener to the button
//     document.getElementById("evaluateButton").addEventListener("click", evaluate);
// });
