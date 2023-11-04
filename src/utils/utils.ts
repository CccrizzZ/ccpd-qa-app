export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
export const server = import.meta.env.VITE_APP_SERVER

// sealed = primary
// new = success
// used like new = secondary
// used = dark
// damaged = danger
// missing parts = warning
export const getVariant = (condition: string) => {
  switch (condition) {
    case 'Sealed':
      return 'primary'
    case 'New':
      return 'success'
    case 'Used Like New':
      return 'secondary'
    case 'Used':
      return 'dark'
    case 'Damaged':
      return 'dark'
    case 'As Is':
      return 'warning'
    default:
      'secondary'
  }
}
