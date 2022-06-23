import { html, render } from 'lit-html'
import { Response } from '../types/funnelback-data'
import { ParamMap } from '../types/url-parameters'
import { mainTemplate } from './main'
import { urlParameterMap } from '../utils/urlParameter'
import { fetchData } from '../utils/fetchData'

export function paginationTemplate (response: Response, paramMap: ParamMap) {
  let timer: any
  const { resultPacket } = response
  const { totalMatching } = resultPacket.resultsSummary
  const paginationOnPage = 10
  const currUrlParameterMap = urlParameterMap()
  const numberOfPages: number = Math.ceil(totalMatching / paginationOnPage)
  const startRankVal: number = Math.floor(parseInt(String(currUrlParameterMap.startRank / 10)) / 10)

  const buildHref = `?query=${currUrlParameterMap.query}&num_ranks=${currUrlParameterMap.numRanks || paginationOnPage}&tiers=10&collection=${currUrlParameterMap.collection}&profile=${currUrlParameterMap.profile}&second_profile=&scope=${currUrlParameterMap.scope}&label=`

  // determine pagination start value
  const paginationStartValue = function () {
    return startRankVal * 10 + 1
  }

  // determine pagination end value
  const paginationEndValue = function () {
    const rankVal = startRankVal * 10 + 10
    if (numberOfPages > rankVal) {
      return rankVal
    } else {
      return Math.ceil(numberOfPages)
    }
  }

  const onPageClick = (e: any) => {
    e.preventDefault()
    clearTimeout(timer)
    document.getElementById('qg-search-results')?.scrollIntoView({
      behavior: 'smooth'
    })
    if (e.target?.href) {
      timer = setTimeout(() => {
        history.pushState({}, '', e.target.href)
        fetchData(e.target?.href?.split('?')[1]).then(data => {
          render(mainTemplate(data?.response, currUrlParameterMap), document.getElementById('qg-search-results__container') as HTMLBodyElement)
        })
      })
    }
  }

  function range (start: number, end: number) {
    return Array(end - start + 1).fill(start).map((_, idx) => start + idx)
  }

  if (numberOfPages > 1) {
    return html`
  <div class="pagination-container">
        <ul class="pagination">
            
            <li class="page-item">
                ${currUrlParameterMap.startRank > 1 ? html`<a class="page-link"  @click="${onPageClick}" href="${buildHref}&page=${currUrlParameterMap.activePage - 1}&start_rank=${currUrlParameterMap.startRank - 10}"><span aria-hidden="true">«</span> Previous</a>` : ''}
            </li>
            ${range(paginationStartValue(), paginationEndValue()).map(i => {
      const addParam = buildHref + `&page=${i}&start_rank=${((currUrlParameterMap.numRanks || paginationOnPage) * (i - 1)) + 1}`
      const determineActivePage = currUrlParameterMap.activePage === i ? 'active' : ''
      return html`<li class="page-item ${determineActivePage}"><a class="page-link" @click="${onPageClick}"  href=${addParam}>${i}</a></li>`
    })}
            <li class="page-item">
                ${numberOfPages > currUrlParameterMap.activePage ? html`<a class="page-link" @click="${onPageClick}" href="${buildHref}&page=${currUrlParameterMap.activePage + 1}&start_rank=${currUrlParameterMap.startRank + 10}">Next<span aria-hidden="true">&nbsp;»</span></a>` : ''}
            </li>
            
        </ul>
    </div>
  `
  }
}
