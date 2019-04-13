const xlsx = require('xlsx');

module.exports = {
    getRows: getRows
}

/**
 * 
 * @param {*} filename 
 * @returns { [ { AccessRequired: string, Department: string, Person: string, Timestamp: number, Generated: Date }] }
 */
function getRows(filename) {
    const workbook = xlsx.readFile(filename);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const cells = xlsx.utils.sheet_to_json(worksheet);
    return cells;
}

