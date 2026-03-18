const fs = require('fs');
let content = fs.readFileSync('eslint_report.json', 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}
const results = JSON.parse(content);
const out = [];
results.forEach(r => {
    r.messages.forEach(m => {
        if (m.severity === 2) {
            out.push(r.filePath + ':' + m.line + ':' + m.column + ' - ' + m.message);
        }
    });
});
fs.writeFileSync('parsed_errs.txt', out.join('\n'));
