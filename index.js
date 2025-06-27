const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need????

let oldTab = userTab;//oldtab is previous/current tab,,jis tab par mein abhi hu
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();




//Jab bhi kisi div/element ko hide krana hota hai uski opacity ko 0 krdo,,visible ke liye 1 Css ko aap js ke dwara kaise change
//krte by using classList ,,ek active naam ki class banate hai ,,aapko kisi ko visible krana hai to ham active vali class add 
//krte hai usme,,aur agar ham kisi ko remove krana chahate hai ki ye na dikhe at some time to usme ham remove krte hai active 
//vali class… active{ opacity:1 , scale:1}kahi iss class ko add krunga to vo element visible hoga aur isse remove krdunga active 
//class ko to vo invisible hoga .. Jab ham ek UI mein aese lage ki kabhi koi tab open hoti hai kabhi koi aur jaise in weather
//app do tab aati hai for your weather and search weather vo do alag tab nahi ,,ham bas us time kisi ko hide krdete hai aur 
//kisi ko visible … tab ek hi hai aur sab usi jagah pr hai bas hide krdete hai…see weather project
//active class is not default class, we have to create it in css
// To Add a Class:
// element.classList.add("class-name");
// To Remove a Class:
// element.classList.remove("class-name");
//classList is a built-in property of HTML elements in JavaScript that lets you easily work with the classes (CSS class names) on an element.

function switchTab(newTab) {//newtab is clicked tab
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //usertab pr click hua hai, toh usertab ko active karna hai uspr switch krdo 
    //pass clicked tab as input paramter
    //mein jis bhi tab pr click krunga usse mein switchTab function mein pass karunga
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //searchTab pr click hua hai, toh searchTab ko active karna hai uspr switch krdo
    //mein jis bhi tab pr click krunga usse mein switchTab function mein pass karunga
    //searchTab ko active karna hai, toh searchTab ko switchTab function mein
    //pass karna hai
    //searchTab ko active karne ka matlab hai ki search form ko visible karna hai
    //search form ko visible karne ka matlab hai ki search form ko active class add kar
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);//JSON.parse() is a JavaScript method that converts a JSON string into a JavaScript object.
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW
        //show an alert that something went wrong
        console.error("Error fetching weather data:", err);
        alert("Failed to fetch weather data. Please try again later.");
    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation() {
    if(navigator.geolocation) {//is 135 line ka matlab hai ki agar browser geolocation feature ko support karta hai toh hi aage check kro
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
        //HW - show an alert for no gelolocation support available

    }
}

function showPosition(position) {//position is an object that contains the coordinates of the user 
    //and position is given by navigator.geolocation.getCurrentPosition() method it returns the current position of the user with this position object
    //position.coords.latitude and position.coords.longitude are the coordinates of the user
    //and we will use these coordinates to fetch the weather information of the user

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    //sessionStorage is a web storage API that allows you to store data for the duration of the page session.
    //sessionStorage.setItem() is a method that allows you to store data in the session
    //sessionStorage.getItem() is a method that allows you to retrieve data from the session
    //sessionStorage.removeItem() is a method that allows you to remove data from the session
    //sessionStorage.clear() is a method that allows you to clear all data from the session
    //sessionStorage is similar to localStorage, but the data stored in sessionStorage is cleared
    //when the page session ends, which is when the browser tab or window is closed.
    //sessionStorage is used to store data that is needed for the duration of the page session
    //and is not needed after the page session ends.
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}



//see loading vala concept from api notes 