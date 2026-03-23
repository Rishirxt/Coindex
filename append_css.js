const fs = require('fs');
const file = 'c:/Users/Admin/OneDrive/Desktop/projects/zapp/app/globals.css';
const appendText = `
@layer utilities {
  .animate-marquee {
    animation: marquee 35s linear infinite;
  }
}
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
`;
fs.appendFileSync(file, appendText, 'utf8');
console.log('Appended marquee animations successfully');
