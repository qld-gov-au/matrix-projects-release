import { html } from 'lit-html'

export function relatedResultsTemplate (contextualNavigation: { categories: any; }) {
  const { categories } = contextualNavigation
  if (categories[0]?.name === 'topic') {
    return html` <p class="related-search__title">Related search</p>
        <section class="related-search__tags test">
            ${categories[0]?.clusters.map((item: any) =>
                html`<a href="${item.href}&start_rank=1" class="qg-btn btn-outline-dark m-1">${item.query}</a>`
            )}
        </section>`
  }
}
