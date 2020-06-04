const vscode = require('vscode');

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
