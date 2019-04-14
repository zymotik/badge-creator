
const pdf = require('./pdf');
const excel = require('./excel');
const colors = require('colors');
const moment = require('moment-mini');
const file = require('./files');
const readline = require('readline');

const excelPassListFile = './pass-list.xlsx';
const pdfTemplates = ['early', 'backstage', 'early-backstage'];
const passesPerPage = 10;

async function main() {
    const timestamp = moment();
    const rows = excel.getRows(excelPassListFile);
    const accessEarly = rows.filter((r) => !r.Generated && simplifyString(r.AccessRequired) === 'early');
    const accessBackstage = rows.filter((r) => !r.Generated && simplifyString(r.AccessRequired) === 'backstage');
    const accessEarlyBackstage = rows.filter((r) => !r.Generated && simplifyString(r.AccessRequired) === 'earlybackstage');

    if (rows.filter((r) => !r.Generated).length > 0){
        console.log(`Ready to generate: 
        ${colors.green(accessEarly.length.toString().padStart(3, '0'))} early passes 
        ${colors.green(accessBackstage.length.toString().padStart(3, '0'))} backstage passes
        ${colors.green(accessEarlyBackstage.length.toString().padStart(3, '0'))} early & backstage passes`);

        await askQuestion('Press enter to continue:');
    
        accessEarly.length > 0 && generateFile(pdfTemplates[0], accessEarly, timestamp);
        accessBackstage.length > 0 && generateFile(pdfTemplates[1], accessBackstage, timestamp);
        accessEarlyBackstage.length > 0 && generateFile(pdfTemplates[2], accessEarlyBackstage, timestamp);
    
        markRowsAsGenerated([...accessEarly, ...accessBackstage, ...accessEarlyBackstage], timestamp);
        
        excel.saveRows(rows, excelPassListFile);    

        return await askQuestion('Done. Press enter to quit.');
    }

    await askQuestion('No records to process. Press enter to quit.');
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(`\n${query}`, ans => {
        rl.close();
        console.log();
        resolve(ans);
    }))
}

function markRowsAsGenerated(passList, timestamp) {
    passList.map(pass => pass.Generated = timestamp.toDate());
}

function generateFile(templateFile, passList, timestamp) {
    const totalCount = passList.length;
    let page = 1;
    const generatedFiles = [];
    const outputFileName = `./export/${timestamp.format('YYYYMMDD-HHmmss')}-${templateFile}.pdf`;

    for(let i=0; i<totalCount; i+=passesPerPage){
        let replacements = generateReplacements(passList, i, passesPerPage);
        const generateFilename = `./temp/${templateFile}-${page}.pdf`;
        pdf.replaceText(`./templates/${templateFile}.pdf`, generateFilename, replacements);
        page+=1;
        generatedFiles.push(generateFilename);
    }
    
    pdf.mergePdfFiles(generatedFiles, outputFileName);
    console.log(`Generated ${colors.green(totalCount.toString().padStart(3,'0'))} passes into ${colors.green(outputFileName)}`)
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

function init() {
    try {
        pdfTemplates.map((filename) => {
            const fileAndPath = `./templates/${filename}.pdf`;
            if (!file.checkExists(fileAndPath)) {
                throw new Error(`File '${fileAndPath}' cannot be found!`);
            }
        });
        file.createDirectory('./temp');    
        file.createDirectory('./export');
        file.emptyDirectory('temp');
    } catch (e) {
        console.log(colors.red(e.message));
        return false;
    }

    return true;
}

if (init()) {
    main();
}

