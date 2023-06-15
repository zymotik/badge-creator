const xlsx = require('xlsx');
const input = require('./input');
const colors = require('colors');

module.exports = {
    getRows,
    saveRows,
}

const xlsxOptions = { cellStyles: true };

/**
 *
 * @param {*} filename
 * @returns { [ { AccessRequired: string, Department: string, Person: string, Timestamp: number, Generated: Date }] }
 */
function getRows(filename) {
    const workbook = xlsx.readFile(filename, xlsxOptions);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const cells = xlsx.utils.sheet_to_json(worksheet);
    return cells;
}

async function saveRows(rows, filename) {
    let success = false;
    while (!success) {
        try {
            const workbook = xlsx.readFile(filename, xlsxOptions);
            const worksheet = xlsx.utils.json_to_sheet(rows);
            workbook.Sheets[workbook.SheetNames[0]] = worksheet;
            xlsx.writeFile(workbook, filename, xlsxOptions);
            success = true;
        } catch (e) {
            console.log(colors.red(`\nError: ${e.message}`));
            await input.askQuestion('This could be because you have the file open.\nPlease close the file and press enter to try again.')
        }
    }
}
