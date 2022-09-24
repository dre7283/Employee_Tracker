const colors = require('colors/safe'),
	eval = require('eval'),
	fs = require('fs'),
	args = require('minimist')(process.argv.slice(2));

const files = args._;

const BACKSLASH_REGEX = /\\/g;
const QUOTE_REGEX = /"/g;
const SPACE_REGEX = /spaces\((\s+?)\)/g;
const FUNC_REGEX = /([A-Za-z]+)\((\s*([^)]+?)\s*)\)/g;

const EVAL_HEAD = 'var colors=require("colors");exports.text=';

for (let file of files) {
	fs.readFile(file, 'utf-8', (err, text) => {
		if (err) {
			console.log('error reading file:', err);
			return;
		}

		text = text.replace(BACKSLASH_REGEX, '\\\\\\\\');
		text = text.replace(QUOTE_REGEX, '\\\\"');
		text = text.replace(SPACE_REGEX, '"$1"+');
		text = text.replace(FUNC_REGEX, 'colors.$1\("$2"\)+');
		let art = eval(text).art
			.split('\n')
			.filter(l => l != '')
			.map(l => EVAL_HEAD + l.substring(0, l.length-1) + ';')
			.map(l => eval(l, true).text);
		
		art.forEach(l => console.log(l));
	});
}
