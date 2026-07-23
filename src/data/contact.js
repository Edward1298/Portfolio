export const contactConfig = {
  envVar: 'VITE_FORMSPREE_ID',
  subject: 'Contact from Portfolio',
  getEndpoint() {
    const id = import.meta.env[this.envVar]
    return `https://formspree.io/f/${id}`
  },
  isConfigured() {
    const id = import.meta.env[this.envVar]
    return id && id !== 'your_form_id_here' && id !== 'your_id_here'
  },
}
