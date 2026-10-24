const fs = require('fs');
const path = require('path');

function checkFile(relPath) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const bengaliRegex = /[\u0980-\u09FF]/;
  const findings = [];
  const binaryChecks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for binary checks that omit ja: language === "bn" ? ... : ...
    if (line.includes('language === "bn"') || line.includes("language === 'bn'")) {
      const surrounding = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 4)).join('\n');
      if (!surrounding.includes('"ja"') && !surrounding.includes("'ja'")) {
        binaryChecks.push({ line: i + 1, text: trimmed });
      }
    }

    if (bengaliRegex.test(line)) {
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
      // check if inside tr(...) or a translation object { bn: "...", en: "...", ja: "..." }
      const surrounding = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 6)).join('\n');
      if (surrounding.includes('tr(') || surrounding.includes('tr (') || surrounding.includes('bn:') || surrounding.includes('"bn":') || surrounding.includes("'bn':")) {
        continue;
      }
      findings.push({ line: i + 1, text: trimmed });
    }
  }

  console.log(`=== ${relPath} ===`);
  console.log(`  Raw/Untranslated Bengali lines: ${findings.length}`);
  findings.forEach(item => console.log(`    Line ${item.line}: ${item.text}`));
  console.log(`  Binary language checks omitting Japanese: ${binaryChecks.length}`);
  binaryChecks.forEach(item => console.log(`    Line ${item.line}: ${item.text}`));
}

const targetFiles = [
  'app/dashboard/page.tsx',
  'components/admin/LeadProfileModal.tsx',
  'components/admin/PartnerProfileModal.tsx',
  'components/admin/UserAccessControlPanel.tsx',
  'components/dashboard/StudentProfileView.tsx'
];

targetFiles.forEach(file => checkFile(file));
