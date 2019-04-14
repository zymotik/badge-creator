const xlsx = require('xlsx');

module.exports = {
    getRows: getRows,
    saveRows: saveRows,
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

function saveRows(rows, filename) {
    const workbook = xlsx.readFile(filename, xlsxOptions);
    const worksheet = xlsx.utils.json_to_sheet(rows);
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    xlsx.writeFile(workbook, filename, xlsxOptions);
}