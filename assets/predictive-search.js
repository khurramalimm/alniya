class PredictiveSearch extends HTMLElement{constructor(){super(),this.selectors={searchQuery:"[data-query]",searchMessage:"[data-message]",input:"[data-search-input]",submit:'button[type="submit"]',loading:"[data-spinner]",clear:"[data-clear-search]",popularSearchItems:["[data-ps-item]"],moreResultIcon:"[data-more-result-icon]"},this.container=document.querySelector("[data-search-popup]"),this.domNodes=queryDomNodes(this.selectors,this.container),this.cachedResults={},this.transitionDuration=300,this.input=this.querySelector('input[type="search"]'),this.predictiveSearchResults=this.querySelector("[data-predictive-search]"),this.popularSearches=this.querySelector("[data-popular-searches]"),this.searchCount=this.querySelector("[data-search-count]"),this.setupEventListeners()}setPopularSearchesLink=()=>{const{popularSearchItems:e}=this.domNodes;e.forEach((e=>e.href=createSearchLink(e.dataset.psQuery)))};setupEventListeners(){const{clear:e}=this.domNodes;this.querySelector("form.m-search-form").addEventListener("submit",this.onFormSubmit.bind(this)),this.input.addEventListener("input",debounce((e=>{this.onChange(e)}),300).bind(this)),e.addEventListener("click",this.onClearSearch.bind(this))}getQuery(){return this.input.value.trim()}onChange(){const e=this.getQuery();e.length?this.getSearchResults(e):this.close(!0)}onFormSubmit(e){this.getQuery().length&&!this.querySelector('[aria-selected="true"] a')||e.preventDefault()}onClearSearch(e){e.preventDefault(),this.input.value="",this.onChange()}getSearchResults(e){const t=e.replace(" ","-").toLowerCase();this.toggleSpinnerLoading(!0),this.toggleClearSearch(!1);const s="true"===this.dataset.searchByTag,i="true"===this.dataset.searchByBody,r=this.dataset.unavailableProductsOption;let a="title,product_type,vendor,variants.sku,variants.title";if(s&&(a+=",body"),i&&(a+=",tag"),this.cachedResults[t])return void this.renderSearchResults(this.cachedResults[t]);let h=`${window.MinimogSettings.routes.predictive_search_url}?q=${encodeURIComponent(e)}&resources[type]=product&resources[options][unavailable_products]=${r}&resources[options][fields]=${a}&section_id=predictive-search`;fetch(`${h}`).then((e=>{if(!e.ok){var t=new Error(e.status);throw this.close(),t}return e.text()})).then((e=>{const s=(new DOMParser).parseFromString(e,"text/html").querySelector("#shopify-section-predictive-search").innerHTML;this.cachedResults[t]=s,this.renderSearchResults(s)})).catch((e=>{throw this.close(),e}))}renderSearchResults(e){this.predictiveSearchResults.innerHTML=e,this.setAttribute("results",!0);this.querySelector("[data-search-items-wrapper]").childElementCount>0?this.renderSearchQueryAndMessage(!0):this.renderSearchQueryAndMessage(!1),this.toggleSpinnerLoading(!1),this.toggleClearSearch(!0),this.open()}renderSearchQueryAndMessage(e){const{input:t,searchQuery:s,searchMessage:i,moreResultIcon:r}=this.domNodes,a=t.value,{resultsTitle:h}=i.dataset;s.textContent=a,e?(i.textContent=h,this.predictiveSearchResults.classList.remove("m:hidden"),r.classList.add("m:hidden")):(i.textContent=i.dataset.resultsTitle,r.classList.remove("m:hidden"),this.predictiveSearchResults.classList.add("m:hidden"))}toggleSpinnerLoading(e){const{loading:t,submit:s}=this.domNodes;s.style.visibility=e?"hidden":"visible",t.style.visibility=e?"visible":"hidden"}toggleClearSearch(e){const{clear:t}=this.domNodes;t.style.visibility=e?"visible":"hidden"}open(){this.setAttribute("open",!0),this.input.setAttribute("aria-expanded",!0),this.isOpen=!0,this.popularSearches&&this.popularSearches.classList.add("m:hidden"),this.searchCount.classList.remove("m:hidden")}close(e=!1){e&&(this.input.value="",this.removeAttribute("results"),this.toggleClearSearch(!1)),this.removeAttribute("open"),this.predictiveSearchResults.classList.add("m:hidden"),this.popularSearches&&this.popularSearches.classList.remove("m:hidden"),this.searchCount.classList.add("m:hidden")}}customElements.define("predictive-search",PredictiveSearch);