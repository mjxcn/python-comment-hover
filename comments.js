'use strict';
function extract(lines, line, name) {
  const text = lines[line] || '';
  const indent = (text.match(/^\s*/) || [''])[0].length;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const declaration = new RegExp('^(?:async\\s+)?(?:def|class)\\s+' + escaped + '\\b');
  const assignment = new RegExp('^(?:self\\.|cls\\.)?' + escaped + '\\s*(?::[^=]+)?=(?!=)');
  if (!declaration.test(text.trim()) && !assignment.test(text.trim())) return '';
  const above = [];
  for (let i = line - 1; i >= 0; i--) {
    const m = lines[i].match(/^(\s*)#\s?(.*)$/);
    if (!m || m[1].length !== indent) break;
    if (/^(?:type:|noqa\b|pylint:|pyright:|ruff:|fmt:|coding[:=]|!)/.test(m[2])) break;
    above.unshift(m[2]);
  }
  // Assignment strings supply local-variable documentation absent from Pylance.
  // Class/function docstrings remain handled by Pylance itself.
  if (assignment.test(text.trim())) {
    const next = lines[line + 1] || '';
    const m = next.match(/^(\s*)("""|''')(.*)$/);
    if (m && m[1].length === indent) {
      const result = [];
      let rest = m[3];
      for (let i = line + 1; i < Math.min(lines.length, line + 100); i++) {
        if (i > line + 1) rest = lines[i];
        const end = rest.indexOf(m[2]);
        if (end >= 0) { result.push(rest.slice(0, end)); return result.join('\n').trim(); }
        result.push(rest);
      }
    }
  }
  return above.join('\n').trim();
}
module.exports = { extract };
