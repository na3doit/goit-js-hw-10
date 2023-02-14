import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
const searchBoxEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBoxEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  evt.preventDefault();

  const country = evt.target.value.trim();

  if (!country) {
    return;
  }
  clearData();
  fetchCountries(country).then(renderData).catch(getError);
}

function clearData() {
  countryListEl.innerHTML = '';
  searchBoxEl.focus();
}

function getWarning() {
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
function getError() {
  return Notiflix.Notify.warning('Oops, there is no country with that name.');
}

function countryListBox(coutries) {
  return coutries
    .map(country => {
      return `<li class="country-list__item">
  <img class="country-list__flag" src="${country.flags.png}" alt="${country.name.official}" width = "40" />
  <p class="country-list__name">${country.name.official}</p>
</li>`;
    })
    .join('');
}

function countryInfoBox(countries) {
  return countries.map(country => {
    return `<div class="country-info__container">
  <div class="country-info__title">
  <img class="country-info__flag" src="${country.flags.png}" alt="${
      country.name.official
    }" width = "40"/>
  <h2 class="country-info__name">${country.name.official}</h2>
  </div>
  <p class="card-info">
  <span class="card-info__prop">Capital: </span>${country.capital}
  </p>
  <p class="card-info">
  <span class="card-info__prop">Population: </span>${country.population}
  </p>
  <p class="card-info">
  <span class="card-info__prop">Languages: </span>${Object.values(
    country.languages
  ).join(', ')}
  </p>
</div> `;
  });
}

function renderData(items) {
  if (items.length >= 10) {
    getWarning();
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
  } else if (items.length >= 2 && items.length < 10) {
    const markupList = countryListBox(items);
    countryListEl.insertAdjacentHTML('beforeend', markupList);
    countryInfoEl.innerHTML = '';
  } else {
    const markupInfo = countryInfoBox(items);
    countryInfoEl.innerHTML = markupInfo;
    countryListEl.innerHTML = '';
  }
}
