import { html, render } from 'lit-html'
import { mainTemplate } from './main'
import { urlParameterMap } from '../utils/urlParameter'
import { fetchData } from '../utils/fetchData'

export function filterResultsTemplate () {
  let label: string = ''
  const currUrlParameterMap = urlParameterMap()
  const labelFromSession = sessionStorage.getItem('fcLabel')
  const profileFromSession = sessionStorage.getItem('fcProfile')
  const scopeFromSession = sessionStorage.getItem('fcScope')
  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  // apply filter button click
  const applyFilter = (e: any) => {
    e.preventDefault()
    const params = new URLSearchParams(location.search)
    const selectedRadioBtn = document.querySelector('input[name="filterBy"]:checked')
    params.set('scope', selectedRadioBtn?.getAttribute('data-scope') || '')
    params.set('profile', selectedRadioBtn?.getAttribute('data-profile') || '')
    params.set('page', '1')
    params.set('start_rank', '1')
    history.pushState({}, '', `?${params.toString()}`)
    fetchData(params.toString()).then(data => {
      render(mainTemplate(data?.response, currUrlParameterMap), document.getElementById('qg-search-results__container') as HTMLBodyElement)
    })
  }

  // on radio button change for filtering
  const onFilterChange = (e: any) => {
    const selectedVal = e.target.value
    switch (selectedVal) {
      case 'qld':
      case 'custom':
        sessionStorage.setItem('rcSelectedRadiobutton', selectedVal)
        break
    }
  }

  // building label value
  if (labelFromSession) {
    label = capitalizeFirstLetter(labelFromSession)
  } else if (scopeFromSession) {
    // @ts-ignore
    label = html`Results from <strong>${scopeFromSession}</strong>`
  } else if (profileFromSession) {
    label = capitalizeFirstLetter(profileFromSession)
  }

  // initial loading of the component
  window.addEventListener('load', (event) => {
    const filterButton = document.querySelector('.qg-btn__filter')
    filterButton?.addEventListener('click', e => {})
    filterButton?.dispatchEvent(new Event('click'))
  })

  return html`<div class="qg-filter-by-results">
              <p class="qg-filter-by-results__title">Filter results by</p>
              <form class="form qg-forms-v2 qg-filter-by-results__form">
              <ol class="questions pt-2">
                <li>
                  <fieldset>
                    <legend>
                      <span class="label">Content type</span>
                    </legend>
                    <ol class="choices qg-forms-v2__radio">
                      <li>
                        <input checked name="filterBy" id="customOption" type="radio" value="custom"
                               data-scope="${scopeFromSession}" 
                               data-profile="${profileFromSession}"
                               data-label="${labelFromSession}" @click="${onFilterChange}" />
                        <label for="customOption">${label}</label>
                      </li>
                      <li>
                        <input name="filterBy" id="qld" type="radio" value="qld" data-profile='qld' data-scope='' @click="${onFilterChange}" ?checked=${sessionStorage.getItem('rcSelectedRadiobutton') === 'qld'}/>
                        <label for="qld">all Queensland Government</label>
                      </li>
                    </ol>
                  </fieldset>
                </li>
              </ol>
            </form>
            <button type="button" class="qg-btn qg-btn__filter btn-primary mb-2" @click="${applyFilter}">Apply filters</button>
           </div>`
}
