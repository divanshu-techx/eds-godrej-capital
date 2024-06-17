import ffetch from '../utils/ffetch.js';
import {
  div, p, h2, select, option, label, input, button,
} from '../utils/dom-helper.js';
import createMap from '../utils/google-map.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

const stateToCities = {};
const filterContainer = document.querySelector('.filters-dropdown');
const mapContainer = document.querySelector('.google-map');
const stateSelect = select({ id: 'stateSelect' });
const citySelect = select({ id: 'citySelect' });
const pincodeInput = input({
  id: 'pincodeInput',
  type: 'text',
  placeholder: 'Enter Pincode',
});

function updateMapCard(item) {
  document.getElementById('mapCardTitle').textContent = item.location;
  document.getElementById('mapCardAddress').textContent = item.address;
  document.getElementById('mapCardPhone').textContent = `Phone No.: ${item.phone}`;
  document.getElementById('mapCardHours').textContent = item.hours;
  document.getElementById('map-card').style.display = 'block'; // Show the card
}

/**
 * Displays filtered location results within a container element.
 *
 * This function renders the filtered location results by dynamically creating and appending
 * HTML elements representing each location as a card within the specified container.
 *
 * @param {Array} filteredLocations - Array of location objects to display.
 * Each object should include properties like 'location', 'address', 'phone', and 'hours'.
 */
function displayResults(filteredLocations) {
  const container = document.querySelector('.branchlocator');
  const cardContainer = div({ class: 'address-cards' });
  if (!container) {
    console.error('Container with class "branchlocator" not found');
    return;
  }

  container.innerHTML = '';

  filteredLocations.forEach((item) => {
    // Extract coordinates from the item
    const { coordinate } = item;
    const [lat, lng] = coordinate.split(',').map((coord) => parseFloat(coord.trim()));

    const card = div(
      { class: 'card' },
      h2(item.location),
      p(item.address),
      p({ class: 'phone' }, `Phone No.: ${item.phone}`),
      p({ class: 'hours' }, item.hours),
    );
    // Add click listener to the card to create a map on click
    card.addEventListener('click', (event) => {
      createMap(lat, lng, 'map-canvas');
      updateMapCard(item);
      document.querySelectorAll('.card').forEach((c) => {
        c.classList.remove('active');
      });
      // Add active class to the clicked card
      event.currentTarget.classList.add('active');
    });

    cardContainer.appendChild(card);
  });
  container.appendChild(cardContainer);
}

/**
 * Filters the provided locations based on selected state, city, and pincode input.
 *
 * This function filters the locations array based on the currently selected state, city,
 * and entered pincode. It then calls the displayResults function to render the filtered
 * locations in the UI.
 *
 * @param {Array} locations - Array of location objects to filter.
 *
 */

function filterResults(locations) {
  const selectedState = stateSelect.value;
  const selectedCity = citySelect.value;
  const enteredPincode = pincodeInput.value.trim();

  const filteredLocations = locations.filter(
    (location) => (!selectedState || location.state === selectedState)
      && (!selectedCity || location.city === selectedCity)
      && (!enteredPincode || location.pincode.startsWith(enteredPincode)),
  );
  displayResults(filteredLocations);
}

/**
 * Handle state selection and update city options accordingly.
 * @param {Array} entries - All location entries.
 */
function handleStateChange(entries) {
  const selectedState = stateSelect.value;
  const cities = stateToCities[selectedState] || [];
  citySelect.innerHTML = '';
  citySelect.appendChild(option({ value: '' }, 'All Cities'));

  cities.forEach((city) => {
    citySelect.appendChild(option({ value: city }, city));
  });

  filterResults(entries);
}

/**
 * Debounce function to limit the rate of invoking the input handler.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - Time to wait in milliseconds.
 * @returns {Function} - A debounced function.
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Renders dropdown filters for states and cities, and an input field for pincode.
 *
 * This function dynamically generates and adds dropdowns for selecting states and cities,
 * as well as an input field for entering pincode. It extracts unique states from the given
 * location data, maps each state to its cities, and populates the state dropdown.
 *
 * @param {Array} locations - Array of location objects.
 */
function renderFilters(locations) {
  // Create filter dropdown

  filterContainer.appendChild(
    div(
      { class: 'filters' },
      label({ for: 'stateSelect' }, 'Select State:'),
      stateSelect,
      label({ for: 'citySelect' }, 'Select City:'),
      citySelect,
      label({ for: 'pincodeInput' }, 'Select Pincode:'),
      pincodeInput,
    ),
  );

  // Extract unique states and map state to cities
  const uniqueStates = [
    ...new Set(locations.map((location) => location.state)),
  ];

  locations.forEach((location) => {
    const { state, city } = location;
    if (!stateToCities[state]) stateToCities[state] = new Set();
    stateToCities[state].add(city);
  });

  // Populate state dropdown
  stateSelect.appendChild(option({ value: '' }, 'All States'));
  uniqueStates.forEach((state) => {
    stateSelect.appendChild(option({ value: state }, state));
  });

  filterResults(locations);
}

/**
 * Initialize the Google Maps API and setup event listeners for filter inputs.
 * @param {Array} entries - All location entries.
 */
function initialize(entries) {
  mapContainer.appendChild(div({ id: 'map-canvas', style: 'height: 500px;' }));

  renderFilters(entries);

  stateSelect.addEventListener('change', () => handleStateChange(entries));
  citySelect.addEventListener('change', () => filterResults(entries));
  pincodeInput.addEventListener('input', debounce(() => filterResults(entries), 300)); // Debounced input
  const coordinates = entries[0].coordinate;
  const defaultLat = coordinates.split(',')[0];
  const defaultLong = coordinates.split(',')[1];
  // Initialize the map

  mapContainer.appendChild(
    div(
      { id: 'map-card' },
      h2({ id: 'mapCardTitle' }, entries[0].location),
      p({ id: 'mapCardAddress' }, entries[0].address),
      p({ id: 'mapCardPhone' }, `Phone No.: ${entries[0].phone}`),
      p({ id: 'mapCardHours' }, entries[0].hours),
      button({ id: 'getDirections' }, 'Get Directions'),
    ),
  );
  createMap(defaultLat, defaultLong, 'map-canvas');
}

/**
 * Load the Google Maps API script and execute a callback once loaded.
 */
function loadGoogleMaps() {
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.50&key=AIzaSyCb_eIYqj93ZiAqN5AQiyWWn4RsjXjlglQ&libraries=places';
  script.defer = true;
  script.async = true;

  document.head.appendChild(script);
}

export default async function decorate() {
// Load Google Maps API
  loadGoogleMaps();

  const allentries = await ffetch('/website/book.json').all();

  initialize(allentries);
}
