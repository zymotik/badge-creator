

const hummus = require('hummus');
const hummusRecipe = require('hummus-recipe');

module.exports = {
	replaceText: replaceText,
	mergePdfFiles: mergePdfFiles
}

function mergePdfFiles(fromFilenames, intoFilename) {
	const pdfDoc = new hummusRecipe(fromFilenames[0], intoFilename);
	fromFilenames.shift();
	fromFilenames.map((filename, index) => {
		pdfDoc.insertPage(1, filename, 1);
	});
	pdfDoc.endPDF();
}

/**
 * @desc Searches a PDF file and makes replacements to text elements
 * @param {string} filePath 
 * @param {string} newFilePath 
 * @param {[{regEx: string, text: string }]} replacements 
 */
function replaceText(filePath, newFilePath, replacements) {
	const modPdfWriter = loadPdf(filePath, newFilePath);
	const copyingContext = modPdfWriter.createPDFCopyingContextForModifiedFile();
	const objectsContext = modPdfWriter.getObjectsContext();
	const documentParser = copyingContext.getSourceDocumentParser();
	const numPages = copyingContext.getSourceDocumentParser().getPagesCount();

	for (let page = 0; page < numPages; page++) {
		const pageDictionary = documentParser.parsePage(page).getDictionary();
		const textStream = documentParser.queryDictionaryObject(pageDictionary, 'Contents');
		const textObjectID = pageDictionary.toJSObject().Contents.getObjectID();
		const readStream = documentParser.startReadingFromStream(textStream);
		const pdfPageAsString = readStreamIntoString(readStream);
		const processedPdf = makeReplacements(pdfPageAsString, replacements);
		
		objectsContext.startModifiedIndirectObject(textObjectID);

		const stream = objectsContext.startUnfilteredPDFStream();
		stream.getWriteStream().write(strToByteArray(processedPdf));
		objectsContext.endPDFStream(stream);
		objectsContext.endIndirectObject();
	}

	modPdfWriter.end();
}

function loadPdf(filePath, newFileName) {
	return hummus.createWriterToModify(filePath, { modifiedFilePath: newFileName, compress: false });
}

function makeReplacements(pdfPageAsString, replacements) {
	let processedPdf = pdfPageAsString;
	for(let replace of replacements) {
		processedPdf = processedPdf.replace(new RegExp(replace.regEx, 'g'), replace.text);
	}
	return processedPdf;
}

function readStreamIntoString(readStream) {
	let data = [];	
	while (readStream.notEnded()) {
		const readData = readStream.read(10000);
		data = data.concat(readData);
	}
	return Buffer.from(data).toString();
}

function strToByteArray (str) {
	let myBuffer = []
	let buffer = Buffer.from(str)
	for (let i = 0; i < buffer.length; i++) {
		myBuffer.push(buffer[i])
	}
	return myBuffer
}