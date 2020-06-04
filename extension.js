const vscode = require('vscode');

const typos = {
  'a': ['q', 'w', 's', 'z'],
  'b': ['v', 'g', 'h', 'n'],
  'c': ['x', 'd', 'f', 'v'],
  'd': ['s', 'e', 'r', 'f', 'c', 'x'],
  'e': ['w', 'r', 'd', 's', '3'],
  'f': ['d', 'r', 't', 'g', 'v', 'c'],
  'g': ['f', 't', 'y', 'h', 'b', 'v'],
  'h': ['g', 'y', 'u', 'j', 'n', 'b'],
  'i': ['o', 'k', 'j', 'u', '8'],
  'j': ['k', 'm', 'n', 'h', 'u', 'i'],
  'k': ['l', ',', 'm', 'j', 'i', 'o',],
  'l': ['~', '.', ',', 'k', 'o', 'p'],
  'm': [',', 'n', 'j', 'k'],
  'n': ['b', 'h', 'j', 'm'],
  'o': ['p', 'l', 'k', 'i', '9'],
  'p': ['0', '´', '~', 'l', 'o'],
  'q': ['1', '2', 'w', 'a'],
  'r': ['t', 'f', 'd', 'e', '4'],
  's': ['w', 'e', 'd', 'x', 'z', 'a'],
  't': ['5', 'y', 'g', 'f', 'r',],
  'u': ['7', 'i', 'j', 'h', 'y'],
  'v': ['c', 'f', 'g', 'b'],
  'w': ['2', 'e', 's', 'a', 'q'],
  'x': ['z', 's', 'd', 'c'],
  'y': ['6', 'u', 'h', 'g', 't'],
  'z': ['a', 's', 'x'],
  '<': ['m', 'k', 'l', '>'],
  '>': ['<', 'l', '~', ':'],
}

function delay(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function run() {
	const text = await vscode.env.clipboard.readText();
	const activeTextEditor = vscode.window.activeTextEditor;
	if (!activeTextEditor) return;
	for (var i = 0; i < text.length; i++) {
		activeTextEditor.edit((builder) => {
			activeTextEditor.selections.forEach((selection) => {
				const position = selection.end;
				const character = text.charAt(i);
				if(character !== "\n") {
					builder.insert(position, character);
				}
			});
		});
		await delay(100);
	}
}

async function activate(context) {
	let disposable = vscode.commands.registerCommand('replay-clipboard.run', run);
	context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
