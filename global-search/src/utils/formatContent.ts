export const formatNumber = (num:number) => {
  const parts = num.toString().split('.')
  const numberPart = parts[0]
  const decimalPart = parts[1]
  const thousands = /\B(?=(\d{3})+(?!\d))/g
  return numberPart.replace(thousands, ',') + (decimalPart ? '.' + decimalPart : '')
}

export const formatDate = (timestamp:number) => {
  const dateObj = new Date(timestamp)
  const month = dateObj.toLocaleString('en-AU', { month: 'long' })
  const year = dateObj.getFullYear()
  const date = dateObj.getDate()
  return date + ' ' + month + ' ' + year
}

export const formatSize = (num:number) => {
  return Math.floor(num / 1024) + 'k'
}
