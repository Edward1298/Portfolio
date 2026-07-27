import weddingInvate1 from '../assets/images/wedding-invate-1.png'
import weddingInvate2 from '../assets/images/wedding-invate-2.png'
import budgetApi1 from '../assets/images/budget-api-1.png'
import budgetApi2 from '../assets/images/budget-api-2.png'
import migolazo1 from '../assets/images/migolazo-1.png'
import migolazo2 from '../assets/images/migolazo-2.png'
import portfolio1 from '../assets/images/portfolio-1.png'
import portfolio2 from '../assets/images/portfolio-2.png'

export const projects = [
  {
    title: 'VyN-Wedding-Invate',
    category: 'PRODUCT',
    repo: 'https://github.com/Edward1298/V-N-Wedding-Invate',
    live: 'https://v-n-wedding-invate.vercel.app/',
    liveBadge: 'Live',
    images: [weddingInvate1, weddingInvate2],
    story: 'A digital invite for the best day of your life — RSVPs, gallery, and all the important details in one elegant page.',
  },
  {
    title: 'BudgetPilot-API',
    category: 'PERSONAL',
    repo: 'https://github.com/Edward1298/BudgetPilot-API',
    live: null,
    liveBadge: 'Local (Docker)',
    images: [budgetApi1, budgetApi2],
    story: 'My .NET playground turned budget assistant — RESTful, clean, and ready to keep your finances in check.',
  },
  {
    title: 'MiGolazo',
    category: 'PRODUCT',
    repo: 'https://github.com/Edward1298/golazo',
    live: 'https://www.migolazo.com/',
    liveBadge: 'Live',
    images: [migolazo1, migolazo2],
    story: 'Where your Sunday league meets World Cup energy — built for the 2026 journey. Matches, scores, leaderboards. Fútbol, minus the WhatsApp chaos.',
  },
  {
    title: 'Portfolio',
    category: 'PERSONAL',
    repo: 'https://github.com/Edward1298/Portfolio',
    live: 'https://www.eduardocespedes.com/',
    liveBadge: 'Live',
    images: [portfolio1, portfolio2],
    story: 'Handcrafted with React, Framer Motion, and the power of lightning. This site is my skills, my taste, and my energy — all in one scroll.',
  },
]
