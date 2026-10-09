'use strict';
const vscode = require('vscode');
const { extract } = require('./comments');
function activate(context) {
  context.subscriptions.push(vscode.languages.registerHoverProvider('python', {
    async provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position, /[\p{L}_][\p{L}\p{N}_]*/u);
      if (!range) return;
      const name = document.getText(range);
      let definitions;
      try {
        definitions = await vscode.commands.executeCommand('vscode.executeDefinitionProvider', document.uri, position);
      } catch { return; }
      if (token.isCancellationRequested) return;
      const targets = definitions && definitions.length ? definitions.map(d => ({
        uri: d.targetUri || d.uri,
        range: d.targetSelectionRange || d.range
      })) : [{uri: document.uri, range}];
      const notes = [];
      const seen = new Set();
      for (const target of targets.slice(0, 8)) {
        if (!target.uri || !target.range || token.isCancellationRequested) continue;
        const key = target.uri.toString() + ':' + target.range.start.line;
        if (seen.has(key)) continue;
        seen.add(key);
        try {
          const source = await vscode.workspace.openTextDocument(target.uri);
          if (source.languageId !== 'python') continue;
          const note = extract(source.getText().split(/\r?\n/), target.range.start.line, name);
          if (note) notes.push({note, source, line: target.range.start.line});
        } catch { /* Missing or virtual definitions need no extra hover. */ }
      }
      if (!notes.length || token.isCancellationRequested) return;
      const markdown = new vscode.MarkdownString();
      markdown.isTrusted = false;
      for (const item of notes) {
        if (markdown.value) markdown.appendMarkdown('\n\n---\n\n');
        markdown.appendMarkdown('**定义处注释**\n\n');
        markdown.appendText(item.note);
        if (notes.length > 1) markdown.appendText('\n\n' + vscode.workspace.asRelativePath(item.source.uri) + ':' + (item.line + 1));
      }
      return new vscode.Hover(markdown, range);
    }
  }));
}
module.exports = { activate };
