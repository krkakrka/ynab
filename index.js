const commander = require('commander');
const { getFileExtension } = require('./utils');
const { convertSEBACC } = require('./adapters/seb');

// todo no input - show help
// option to create a property named file, not to stdout
// adapters have a pattern, could reuse
commander
	.description('Converts SEB .acc OR Revolut .csv exports to YNAB .csv\'s.')
	.arguments('<file>')
	.option('-t, --type <type>', 'File type: acc or csv. Will try to deduce by file extension.')
	.action((file, { type }) => {
		const fileType = type || getFileExtension(file); 

		// todo map file extension to function (conversion or unsupported)
		if (fileType === '.acc') {
			const out = convertSEBACC(file);
			console.log(out);
		} else
		if (fileType === '.csv') {
			const out = convertRevoCSV(file);
			console.log(out);
		} else {
			console.log(`Unknow file extension ${fileType}`);
		}
	});

commander.parse(process.argv);
