const fs = require('fs');
const path = require('path');

// Load Jest coverage data
const coverageData = JSON.parse(fs.readFileSync(path.join(__dirname, 'coverage/coverage-summary.json')));

const totalTests = coverageData.total.statements.total;
const totalPassed = coverageData.total.statements.passed;

const passPercentage = (totalPassed / totalTests) * 100;

let grade = '';
if (passPercentage >= 80) {
  grade = 'A';
} else if (passPercentage >= 60) {
  grade = 'B';
} else {
  grade = 'C';
}

console.log(`Test Coverage: ${passPercentage}%`);
console.log(`Grade: ${grade}`);
  