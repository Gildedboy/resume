import fs from "fs";

const out = "public/CV.pdf";

const pageWidth = 612;
const pageHeight = 792;
const margin = 45;
const bodySize = 9.2;
const smallSize = 8.2;
const titleSize = 20;
const sectionSize = 10.5;
const leading = 12;

let ops = [];
let y = pageHeight - margin;

const escapePdfString = (value) => {
  const bytes = Buffer.from(value, "latin1");
  let result = "";
  for (const byte of bytes) {
    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) {
      result += "\\" + String.fromCharCode(byte);
    } else if (byte < 32 || byte > 126) {
      result += "\\" + byte.toString(8).padStart(3, "0");
    } else {
      result += String.fromCharCode(byte);
    }
  }
  return result;
};

const text = (value, x, yy, size = bodySize, font = "F1") => {
  ops.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${yy.toFixed(2)} Td (${escapePdfString(value)}) Tj ET`);
};

const line = (x1, yy1, x2, yy2) => {
  ops.push(`${x1.toFixed(2)} ${yy1.toFixed(2)} m ${x2.toFixed(2)} ${yy2.toFixed(2)} l S`);
};

const wrap = (value, maxChars) => {
  const words = value.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const section = (label) => {
  y -= 14;
  text(label.toUpperCase(), margin, y, sectionSize, "F2");
  line(margin, y - 3, pageWidth - margin, y - 3);
  y -= 14;
};

const paragraph = (value, maxChars = 112, size = bodySize) => {
  for (const wrapped of wrap(value, maxChars)) {
    text(wrapped, margin, y, size);
    y -= leading;
  }
};

const bullet = (value, maxChars = 105) => {
  const lines = wrap(value, maxChars);
  text("-", margin, y, bodySize);
  text(lines[0], margin + 12, y, bodySize);
  y -= leading;
  for (const continuation of lines.slice(1)) {
    text(continuation, margin + 12, y, bodySize);
    y -= leading;
  }
};

const role = (company, title, dates) => {
  text(company, margin, y, bodySize, "F2");
  text(`${title} | ${dates}`, margin + 220, y, bodySize);
  y -= leading;
};

text("Omar Millán Cázares", margin, y, titleSize, "F2");
y -= 18;
text("QA Automation Engineer", margin, y, 12, "F1");
y -= 15;
text("Mazatlán, Sinaloa, México | (+52) 669 381 8142 | (+52) 669 217 9643 | contact@gilded.dev", margin, y, smallSize);
y -= 10;
text("https://gilded.dev | LinkedIn: linkedin.com/in/gilded", margin, y, smallSize);

section("Profile");
paragraph("QA Automation Engineer with a strong manual QA foundation and growing expertise in Playwright, TypeScript automation, REST/SOAP API testing, and AI-assisted QA workflows. Focused on clear test evidence, defect reporting, regression coverage, and practical improvements that make testing faster and more reliable.");

section("Professional Experience");
role("OUTPOSTQA", "Mid Manual QA Tester", "2025 - Present");
bullet("Execute manual testing across mobile, API, regression, smoke, and functional testing workflows.");
bullet("Validate tickets, document defects with clear evidence, and collaborate with the team to improve product quality.");
bullet("Support reliable releases through test case execution, bug reporting, Jira tracking, and QA process improvement.");
y -= 4;

role("GRUPO STI", "QA Automation Engineer", "2024 - September 2025");
bullet("Created test cases, documented evidence, and executed manual, automation, API, and stress testing across client projects.");
bullet("Used Playwright, JavaScript/TypeScript, Postman, JMeter, OWASP ZAP, Git, SQL, and NoSQL during QA activities.");
bullet("Reported defects and provided UX/UI and logic improvement suggestions when issues affected client experience.");
y -= 4;

role("ACUICULTEC SA DE CV", "QA Tester", "2022 - 2024");
bullet("Tested software and hardware products for aquaculture solutions, including web, mobile, and related systems.");
bullet("Wrote test cases, documented defects, performed manual and automation testing, and suggested UX/UI improvements.");

section("Projects");
role("HSR Team Builder", "Personal Web Project", "hsr-team-builder.gilded.dev");
bullet("Built a data-driven tool for exploring Honkai: Star Rail team compositions, character data, and light cone references.");
bullet("Used as a practical project for frontend development, QA thinking, automation practice, and AI-assisted workflow improvements.");
y -= 4;

role("ani-cli-mx", "Personal CLI Project", "Private");
bullet("Customized terminal-based anime search and playback workflows while practicing Bash, Linux tooling, Git, debugging, and iterative testing.");

section("Skills");
paragraph("QA: Manual testing, test cases, regression, smoke, functional, defect reporting, Jira, Xray, test evidence.", 118, smallSize);
paragraph("Automation/API: Playwright, JavaScript/TypeScript, Node.js, Mocha, REST API testing, SOAP API testing, Postman, Yaak.", 118, smallSize);
paragraph("Security/Performance/Data: JMeter, OWASP ZAP, DAST, SAST concepts, SQL, NoSQL, HeidiSQL, Studio 3T.", 118, smallSize);
paragraph("AI-assisted QA: Codex, ChatGPT, Claude, OpenCode, AI-assisted testing workflows.", 118, smallSize);

section("Education & Learning");
paragraph("Bachelor degree in Computer Science | Universidad Autónoma de Sinaloa | 2009 - 2013", 118, smallSize);
paragraph("ISTQB Foundation Level: In progress | Playwright and TypeScript automation: Independent learning | AI-assisted QA workflows: Independent learning", 118, smallSize);
paragraph("Languages: Spanish native | English conversational-advanced", 118, smallSize);

const content = `q
0.35 0.39 0.46 RG
${ops.join("\n")}
Q`;

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
];

let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, "latin1");
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets.slice(1)) {
  pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

fs.writeFileSync(out, Buffer.from(pdf, "latin1"));
console.log(`Generated ${out}`);
