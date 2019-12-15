const commander = require('commander');
const { getFileExtension } = require('./utils');
const { convertSEBACC } = require('./adapters/seb');
const { convertRevoCSV } = require('./adapters/revolut');
const { CSV_HEADER_ROW } = require('./adapters/ynab');

// todo no input - show help
// option to create a property named file, not to stdout
// adapters have a pattern, could reuse
// todo list of files
// todo invoke like a command
commander
	.description('Converts SEB .acc and Revolut .csv exports to YNAB .csv\'s.')
	.arguments('<files...>')
	.action((files) => {
		const csvs = files.map(file => {
			const fileType = getFileExtension(file); 
			// todo map file extension to function (conversion or unsupported)
			if (fileType === '.acc') {
				return convertSEBACC(file);
			} else
			if (fileType === '.csv') {
				return convertRevoCSV(file);
			} else {
				throw new Error(`Unsupported file type: ${file}. Type: ${fileType}`);
			}
		});
		const out = [CSV_HEADER_ROW, ...csvs].join('\n');
		console.log(out);
	});

commander.parse(process.argv);
