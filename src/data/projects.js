import weddingInvate from '../assets/images/wedding-invate-1.png'
import budgetApi from '../assets/images/budget-api-1.png'
import migolazo from '../assets/images/migolazo-1.png'
import portfolio from '../assets/images/portfolio-1.png'

export const projects = [
  {
    title: 'VyN-Wedding-Invate',
    category: 'PRODUCT',
    repo: 'https://github.com/Edward1298/V-N-Wedding-Invate',
    live: 'https://v-n-wedding-invate.vercel.app/',
    liveBadge: 'Live',
    images: [weddingInvate],
    story: 'A digital invite for the best day of your life — RSVPs, gallery, and all the important details in one elegant page.',
  },
  {
    title: 'BudgetPilot-API',
    category: 'PERSONAL',
    repo: 'https://github.com/Edward1298/BudgetPilot-API',
    live: null,
    liveBadge: 'Local (Docker)',
    images: [budgetApi],
    story: 'My .NET playground turned budget assistant — RESTful, clean, and ready to keep your finances in check.',
  },
  {
    title: 'MiGolazo',
    category: 'PRODUCT',
    repo: 'https://github.com/Edward1298/golazo',
    live: 'https://www.migolazo.com/',
    liveBadge: 'Live',
    images: [migolazo],
    story: 'Where your Sunday league meets World Cup energy — built for the 2026 journey. Matches, scores, leaderboards. Fútbol, minus the WhatsApp chaos.',
  },
  {
    title: 'Portfolio',
    category: 'PERSONAL',
    repo: 'https://github.com/Edward1298/Portfolio',
    live: 'https://www.eduardocespedes.com/',
    liveBadge: 'Live',
    images: [portfolio],
    story: 'Handcrafted with React, Framer Motion, and the power of lightning. This site is my skills, my taste, and my energy — all in one scroll.',
  },
]
