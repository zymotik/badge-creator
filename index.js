
const pdf = require('./pdf');
const excel = require('./excel');
const colors = require('colors');
const moment = require('moment-mini');

function main() {
    const rows = excel.getRows('pass-list.xlsx');
    const accessEarly = rows.filter((r) => !r.Generated && simplifyString(r.AccessRequired) === 'early');
    const accessBackstage = rows.filter((r) => !r.Generated && simplifyString(r.AccessRequired) === 'backstage');
    const accessEarlyBackstage = rows.filter((r) => !r.Generated && simplifyString(r.AccessRequired) === 'earlybackstage');

    console.log(`Generating: 
                ${colors.green(accessEarly.length.toString().padStart(3, '0'))} early passes 
                ${colors.green(accessBackstage.length.toString().padStart(3, '0'))} backstage passes
                ${colors.green(accessEarlyBackstage.length.toString().padStart(3, '0'))} early & backstage passes`);

    accessEarly.length > 0 && generateFile('template-early', accessEarly);
    accessBackstage.length > 0 && generateFile('template-backstage', accessBackstage);
    accessEarlyBackstage.length > 0 && generateFile('template-early-backstage', accessEarlyBackstage);

    // save those generated
}

function generateFile(templateFile, passList) {
    const totalCount = passList.length;
    const passesPerPage = 10;
    const timestamp = moment();
    let page = 1;
    const generatedFiles = [];

    for(let i=0; i<totalCount; i+=passesPerPage){
        let replacements = generateReplacements(passList, i, passesPerPage);
        const generateFilename = `./temp/${templateFile}-${page}.pdf`;
        pdf.replaceText(`./${templateFile}.pdf`, generateFilename, replacements);
        page+=1;
        generatedFiles.push(generateFilename);
    }

    pdf.mergePdfFiles(generatedFiles, `./export/${timestamp.format('YYYYMMDD-HHmmss')}-${templateFile}.pdf`);
}

function generateReplacements(passList, pageIndex, passesPerPage) {
    let replacements = [];
    for(let i=0; i<passesPerPage; i++){
        replacements = [...replacements, ...generatePassReplacement(passList, pageIndex + i, i)];
    }
    return replacements;
}

function generatePassReplacement(passList, passIndex, tokenIndex){
    const pass = passList[passIndex];
    const token = (tokenIndex + 1).toString().padStart(2, '0');

    if (pass){
        return [
            {
                regEx: `{{n${token}}}`,
                text: pass.Person
            },
            {
                regEx: `{{d${token}}}`,
                text: pass.Department
            }
        ];
    }
    return [
        {
            regEx: `{{n${token}}}`,
            text: 'THIS PASS IS VOID'
        },
        {
            regEx: `{{d${token}}}`,
            text: 'INVALID - DESTROY'
        }
    ];
}

/**
 * Simplify string to protect against users entering lowercase or incorrect values
 * @param {string} input 
 */
function simplifyString(input) {
    return input.toLowerCase().replace(/ /g, '').replace('&', '').replace('and', '');
}

main();
