const fs = require('fs');
const moment = require('moment');
const CSV_HEADER_ROW = require('./ynab');

function processedRowsToCSV(rows) {
	return rows.map(row => [
		moment(row[0], 'MMM DD, YYYY').format('DD/MM/YYYY'),
		// have to replace commas, otherwise YNAB can't parse
		row[1].replace('To ', '').replace('From ', '').replace(/,/g, '-'), // payee
		row[8].replace(/,/g, '-'), // description
		row[2] ? `-${row[2]}` : row[3] // amount
	].join()).join('\n');
}

function convertRevoCSV(fileName) {
	const rawText = fs.readFileSync(fileName, 'utf8');
	const rawRows = rawText.split('\n').map(row => row.split(';')).splice(1).filter(row => row.filter(i => i).length).map(i => i.map(i => i.trim()));
	const csv = processedRowsToCSV(rawRows);
  return `${CSV_HEADER_ROW}\n${csv}`;
}

module.exports = {
  convertRevoCSV 
};
