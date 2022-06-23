import type { Response } from '../types/funnelback-data'
import { html } from 'lit-html'
import { featuredResultsTemplate } from './featured-results'
import { paginationTemplate } from './pagination'
import { searchResultsTemplate } from './search-results'
import { ParamMap } from '../types/url-parameters'

export function mainTemplate (response: Response, paramMap: ParamMap) {
  const { resultPacket, curator } = response
  const { exhibits } = curator

  return html`
        ${exhibits.length > 0 ? featuredResultsTemplate(exhibits) : ''}
        ${searchResultsTemplate(resultPacket)}
        ${paginationTemplate(response, paramMap)}
    `
}
