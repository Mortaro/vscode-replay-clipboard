const vscode = require('vscode');

const settings = vscode.workspace.getConfiguration('replay-clipboard');

let running = false;

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

function randomTypo(character) {
  if(character.length > 1) return false;
  if(randomInt(0, 100) > settings.typoChance) return false;
  const neighbor = {
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
  }[character.toLowerCase()];
  if(!neighbor) return false;
  return neighbor[randomInt(0, neighbor.length -1)];
}

function delay() {
  const milliseconds = randomInt(settings.minimumDelay, settings.maximumDelay);
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function groupConsecutiveCharacters(text) {
  const result = [];
  for (var i = 0; i < text.length; i++) {
    const character = text.charAt(i);
    const last = result[result.length - 1];
    if(!last) {
      result.push([character]);
    } else {
      const comparable = last[last.length - 1];
      if(comparable == character) {
        last.push(character);
      } else {
        result.push([character]);
      }
    }
  }
  return result.map((characters) => characters.join(''));
}

async function type(character) {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) return;
  activeTextEditor.edit((builder) => {
    activeTextEditor.selections.forEach((selection) => {
      const position = selection.end;
      if(character !== "\n") {
        builder.insert(position, character);
      }
    });
  });
}

async function backspace() {
  return vscode.commands.executeCommand('deleteLeft');
}

async function run() {
  running = !running;
  const text = await vscode.env.clipboard.readText();
  const characters = groupConsecutiveCharacters(text);
	for (const character of characters) {
    if(!running) break;
    const typo = randomTypo(character);
    if(typo) {
      type(typo);
      await delay();
      backspace();
      await delay();
    }
		type(character);
    await delay();
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
