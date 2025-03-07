const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");
let countriesData = [];

async function loadCountriesData() {
    try {
        const response = await fetch('dataset/countries.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data: ' + response.statusText);
        }
        const countriesData = await response.json();
        populateCountries(countriesData);
    } catch (error) {
        console.error('Error fetching countries.json:', error);
    }
}

function populateCountries(countries) {
    countriesData = countries;
    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.name;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
    loadBio();
}

function populateStates() {
    stateSelect.innerHTML = "<option selected disabled>Select State</option>";
    const selectedCountry = countriesData.find(country => country.name === countrySelect.value);

    if (selectedCountry) {
        selectedCountry.states.forEach(state => {
            const option = document.createElement("option");
            option.value = state.name;
            option.textContent = state.name;
            stateSelect.appendChild(option);
        });
    }
    citySelect.innerHTML = "<option selected disabled>Select City</option>"; 
}

function populateCities() {
    citySelect.innerHTML = "<option selected disabled>Select City</option>";
    const selectedCountry = countriesData.find(country => country.name === countrySelect.value);
    const selectedState = selectedCountry?.states.find(state => state.name === stateSelect.value);

    if (selectedState) {
        selectedState.cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

async function loadBio() {
    try {
        const response = await fetch('php/bio.php');
        if (!response.ok) {
            throw new Error('Failed to fetch data: ' + response.statusText);
        }
        const existingData = await response.json();
        setBio(existingData);
    } catch (error) {
        console.error('Error fetching bio data:', error);
    }
}

function setBio(existingData) {
    document.getElementById("name").value = existingData.name;
    document.getElementById("email").value = existingData.email;
    document.getElementById("phone").value = existingData.phone;
    document.getElementById("address").value = existingData.address;
    countrySelect.value = existingData.country;
    populateStates();
    stateSelect.value = existingData.state;
    populateCities();
    citySelect.value = existingData.city;
    document.getElementById("zip").value = existingData.zip;
}

countrySelect.addEventListener("change", populateStates);
stateSelect.addEventListener("change", populateCities);
loadCountriesData();

const genresContainer = document.getElementById("genresContainer");
const platformsContainer = document.getElementById("platformsContainer");
const tagsContainer = document.getElementById("tagsContainer");
const tagSearch = document.getElementById("tagSearch");

let genresData = [];
let platformsData = [];
let tagsData = [];

async function loadPreferencesData() {
    try {
        const response = await fetch('php/store_preferences.php');
        if (!response.ok) {
            throw new Error('Failed to fetch data: ' + response.statusText);
        }

        const data = await response.json();
        genresData = data.genres;
        platformsData = data.platforms;
        tagsData = data.tags;

        populateGenres();
        populatePlatforms();
        populateTags();
        setPreferences(data.preferences);
    } catch (error) {
        console.error('Error fetching store preferences data:', error);
    }
}

function populateGenres() {
    genresContainer.innerHTML = "";
    genresData.forEach(genre => {
        const div = document.createElement("div");
        div.innerHTML = `<input type="checkbox" name="genres[]" value="${genre.name}" id="genre-${genre.name}">
                            <label for="genre-${genre.name}">${genre.name}</label>`;
        genresContainer.appendChild(div);
    });
}

function populatePlatforms() {
    platformsContainer.innerHTML = "";
    platformsData.forEach(platform => {
        const div = document.createElement("div");
        div.innerHTML = `<input type="checkbox" name="platforms[]" value="${platform.name}" id="platform-${platform.name}">
                            <label for="platform-${platform.name}">${platform.name}</label>`;
        platformsContainer.appendChild(div);
    });
}

function populateTags() {
    tagsContainer.innerHTML = "";
    tagsData.forEach(tag => {
        const div = document.createElement("div");
        div.innerHTML = `<input type="checkbox" name="tags[]" value="${tag.name}" id="tag-${tag.name}">
                            <label for="tag-${tag.name}">${tag.name}</label>`;
        tagsContainer.appendChild(div);
    });
}

function filterTags() {
    const searchTerm = tagSearch.value.toLowerCase();
    const filteredTags = tagsData.filter(tag => tag.name.toLowerCase().includes(searchTerm));
    tagsContainer.innerHTML = "";
    filteredTags.forEach(tag => {
        const div = document.createElement("div");
        div.innerHTML = `<input type="checkbox" name="tags[]" value="${tag.name}" id="tag-${tag.name}">
                            <label for="tag-${tag.name}">${tag.name}</label>`;
        tagsContainer.appendChild(div);
    });
}

function setPreferences(preferences) {
    preferences.genres.forEach(genre => {
        document.getElementById(`genre-${genre}`).checked = true;
    });
    preferences.platforms.forEach(platform => {
        document.getElementById(`platform-${platform}`).checked = true;
    });
    preferences.tags.forEach(tag => {
        document.getElementById(`tag-${tag}`).checked = true;
    });
}

tagSearch.addEventListener("input", filterTags);
loadPreferencesData();