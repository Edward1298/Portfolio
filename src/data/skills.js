const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
const SIMPLE = 'https://cdn.simpleicons.org'

export const skills = [
  // Row 1 — backend
  { name: 'C#', icon: `${DEVICON}/csharp/csharp-original.svg`, row: 1 },
  { name: '.NET', icon: `${DEVICON}/dot-net/dot-net-original.svg`, row: 1 },
  { name: 'SQL', icon: `${DEVICON}/azuresqldatabase/azuresqldatabase-original.svg`, row: 1 },
  { name: 'Entity Framework', icon: null, monogram: 'EF', row: 1 },
  { name: 'JWT', icon: null, monogram: 'JWT', row: 1 },
  { name: 'Azure', icon: `${DEVICON}/azure/azure-original.svg`, row: 1 },

  // Row 2 — frontend core
  { name: 'React', icon: `${DEVICON}/react/react-original.svg`, row: 2 },
  { name: 'JavaScript', icon: `${DEVICON}/javascript/javascript-original.svg`, row: 2 },
  { name: 'HTML', icon: `${DEVICON}/html5/html5-original.svg`, row: 2 },
  { name: 'CSS', icon: `${DEVICON}/css3/css3-original.svg`, row: 2 },
  { name: 'Vite', icon: `${DEVICON}/vitejs/vitejs-original.svg`, row: 2 },
  { name: 'React Router', icon: null, monogram: 'RR', row: 2 },

  // Row 3 — tooling & infra
  { name: 'Framer Motion', icon: `${DEVICON}/framermotion/framermotion-original.svg`, row: 3 },
  { name: 'Git', icon: `${DEVICON}/git/git-original.svg`, row: 3 },
  { name: 'GitHub', icon: `${SIMPLE}/github/ffffff`, row: 3 },
  { name: 'Docker', icon: `${DEVICON}/docker/docker-original.svg`, row: 3 },
  { name: 'AWS', icon: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg`, row: 3 },
  { name: 'Php', icon: `${DEVICON}/php/php-original.svg`, row: 3 },

  // Row 4 — AI & platforms
  { name: 'OpenCode', icon: null, monogram: 'OC', row: 4 },
  { name: 'Claude Code', icon: null, monogram: 'CC', row: 4 },
  { name: 'Vercel', icon: `${SIMPLE}/vercel/ffffff`, row: 4 },
  { name: 'Supabase', icon: `${SIMPLE}/supabase`, row: 4 },
  { name: 'VSCode', icon: `${DEVICON}/vscode/vscode-original.svg`, row: 4 },
  { name: 'PowerBI', icon: `${SIMPLE}/powerbi`, row: 4 },
]
