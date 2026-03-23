const fs = require('fs');
const file = 'c:/Users/Admin/OneDrive/Desktop/projects/zapp/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/@theme inline \{[\s\S]*?\}/, `@theme inline {
  --color-primary: #00D4AA;
  --color-bg: #030712;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.06);
  --color-muted: rgba(255, 255, 255, 0.45);
  --color-subtle: rgba(255, 255, 255, 0.25);
  --font-sans: var(--font-geist-sans);
  --font-mono: 'JetBrains Mono', var(--font-geist-mono);
  
  --color-background: var(--color-bg);
  --color-foreground: #ffffff;
  --color-card: var(--color-surface);
  --color-card-foreground: #ffffff;
  --color-popover: var(--color-surface);
  --color-popover-foreground: #ffffff;
  --color-primary-foreground: #030712;
  --color-secondary: rgba(255, 255, 255, 0.05);
  --color-secondary-foreground: #ffffff;
  --color-muted-foreground: var(--color-muted);
  --color-accent: rgba(255, 255, 255, 0.1);
  --color-accent-foreground: #ffffff;
  --color-destructive: #F43F5E;
  --color-input: var(--color-border);
  --color-ring: var(--color-primary);
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}`);

content = content.replace(/:root \{[\s\S]*?\}/, `:root {
  --color-primary: #00D4AA;
  --color-bg: #030712;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.06);
  --color-muted: rgba(255, 255, 255, 0.45);
  --color-subtle: rgba(255, 255, 255, 0.25);
  --gradient-primary: #00D4AA;
  --radius: 0.75rem;
}`);

content = content.replace(/\.dark \{[\s\S]*?\}/, `.dark {
  --color-primary: #00D4AA;
  --color-bg: #030712;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.06);
  --color-muted: rgba(255, 255, 255, 0.45);
  --color-subtle: rgba(255, 255, 255, 0.25);
}`);

content = content.replace(/body\s*\{[^}]*\}/g, `body {
    background-color: var(--color-bg) !important;
    color: #ffffff !important;
  }`);

content = content.replace(/\.logo-text\s*\{[^}]*\}/g, `.logo-text {
    font-weight: 900;
    font-size: 1.5rem;
    line-height: 2rem;
    letter-spacing: -0.04em;
    color: #ffffff;
    transition: transform 0.3s ease;
  }`);

if (!content.includes('.glass-card {')) {
  content += `\n
  .glass-card {
    background: var(--color-surface);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
  }
  .glass-card-collapsed {
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255, 0.18);
    border-radius: 9999px;
  }\n`;
}

fs.writeFileSync(file, content, 'utf8');
console.log('Success');
