const searchBar = document.querySelector('#search-area');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup-content');
const body = document.body;
const inputs = document.querySelectorAll('.search__form__inputs');
const buttonText = document.querySelector('.button-text');

function updateButtonText() {
  const anyFilled = Array.from(inputs).some((input) => input.value !== '');
  buttonText.innerHTML = anyFilled ? 'Find brewery' : 'Show all';
}

inputs.forEach((input) => {
  input.addEventListener('keyup', updateButtonText);
});

updateButtonText();

const renderBrewery = (brewery) => {
  const lockPaddingValue = window.innerWidth - body.offsetWidth + 'px';

  popupContent.innerHTML = `
      <h2 class="list_brewery__title">${brewery.name}</h2>
      <p class="list_brewery__description"><strong>Type:</strong> ${brewery.brewery_type}</p>
      <p class="list_brewery__description"><strong>Address:</strong> ${brewery.street}</p>
      <p class="list_brewery__description"><strong>City:</strong> ${brewery.city}</p>
      <p class="list_brewery__description"><strong>State:</strong> ${brewery.state}</p>
      <p class="list_brewery__description"><strong>Postal Code:</strong> ${brewery.postal_code}</p>
      <p class="list_brewery__description"><strong>Country:</strong> ${brewery.country}</p>
      <p class="list_brewery__description"><strong>Phone:</strong> ${brewery.phone}</p>
      <button class="learn-more">
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span><a class="button-text" href="#info" onclick="closePopup()">Close</a></span>
      </button>
  `;
  popup.style.display = 'block';
  body.classList.add('locked');
  body.style.paddingRight = lockPaddingValue;
};

const fetchBrewery = async (id) => {
  const brewURL = `https://api.openbrewerydb.org/v1/breweries/${id}`;
  const response = await fetch(brewURL);
  const data = await response.json();
  renderBrewery(data);
};

const handleClick = (event) => {
  if (event.target.id === 'show-more') {
    event.preventDefault();
    const id = event.target.dataset.id;
    fetchBrewery(id);
  }
};

const closePopup = () => {
  popup.style.display = 'none';
  popupContent.innerHTML = '';
  body.classList.remove('locked');
  body.style.paddingRight = 0;
};

searchBar.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchTerm = document.querySelector('#search-bar').value.trim();
  const stateTerm = document.querySelector('#state-bar').value.trim();
  const cityTerm = document.querySelector('#city-bar').value.trim();

  let url = 'https://api.openbrewerydb.org/v1/breweries?';

  if (cityTerm) {
    url += `by_city=${cityTerm}`;
  } else {
    url += `by_name=${searchTerm}&by_state=${stateTerm}`;
  }
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const info = document.querySelector('#info');
      info.textContent = '';
      if (data.length > 0) {
        data.forEach(brewery => {
          const websiteUrl = brewery.website_url ? `<a href="${brewery.website_url}" class="brewery__description-web" target="_blank">${brewery.website_url}</a>` : 'N/A';
          const html = `
            <section class="list_brewery">
              <h2 class="list_brewery__title">${brewery.name}</h2>
              <p class="list_brewery__description"><strong>Type:</strong> ${brewery.brewery_type}</p>
              <p class="list_brewery__description"><strong>Address:</strong> ${brewery.street}, ${brewery.city}, ${brewery.state}, ${brewery.country}</p>
              <p class="list_brewery__description"><strong>Website:</strong> ${websiteUrl}</p>
              <button class="learn-more">
                <span class="circle" aria-hidden="true">
                  <span class="icon arrow"></span>
                </span>
                <span><a id="show-more" class="button-text" href="#" data-id="${brewery.id}">Show more</a></span>
              </button>
            </section>
          `;
          info.insertAdjacentHTML('beforeend', html);
        });
      } else {
        info.insertAdjacentHTML('beforeend', '<h2 class="title">No results found</h2>');
      }
    });
});

document.addEventListener('click', handleClick);