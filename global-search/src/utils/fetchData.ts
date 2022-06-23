import { funnelbackApiUrl } from './constants'

export const fetchData = async (url : string) => {
  const response = await fetch(`${funnelbackApiUrl + '?' + url}`)
  return await response.json()
}
