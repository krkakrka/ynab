const fs = require('fs');
const moment = require('moment');
const CSV_HEADER_ROW = require('./ynab');

const ATTR_INDEX_TO_KEY = {
	2: 'date', // 20191124
	3: 'time', // 181119
	5: 'amount', // in cents
	6: 'opType', // D|C (debit|credit) (output|input)
	13: 'description',
	17: 'payee'
};

function rawRowToProcessedRow(row) {
	const keyValues = Object.keys(ATTR_INDEX_TO_KEY)
		.map(index => {
			const value = row[index];
			const key = ATTR_INDEX_TO_KEY[index];
			return { [key]: value };
		});
	return Object.assign({}, ...keyValues);
}

function processedRowsToCSV(rows) {
	return rows.map(row => [
		moment(row.date, 'YYYYMMDD').format('DD/MM/YYYY'),
		// have to replace commas, otherwise YNAB can't parse
		row.payee.replace(/,/g, '-'),
		row.description.replace(/,/g, '-'),
		`${row.opType === 'D' ? '-' : ''}${row.amount / 100}`
	].join(' ,')).join('\n');
}

function convertSEBACC(fileName) {
	const rawText = fs.readFileSync(fileName, 'utf8');
	const rawRows = rawText.split('\r\n').map(row => row.split('\t')).filter(row => row[0] === '010');
	const processedRows = rawRows.map(rawRowToProcessedRow);
  const csv = processedRowsToCSV(processedRows);
	return `${CSV_HEADER_ROW}\n${csv}`;
}

module.exports = {
  convertSEBACC
};
