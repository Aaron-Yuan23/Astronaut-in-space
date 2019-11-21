const astrosUrl = 'http://api.open-notify.org/astros.json'; // return eveyone in space
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Make an AJAX request
function getJSON(url, callback) { 
  const xhr = new XMLHttpRequest(); // create xhr object
  xhr.open('GET', url); // open request
  xhr.onload = () => { // callback function
    if(xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      return callback(data);
    }
  };
  xhr.send(); // send request
}

function getProfiles(json){
  json.people.map( person => {
    getJSON(wikiUrl + person.name, generateHTML);
  });
}

// Generate the markup for each profile
function generateHTML(data) {
  //console.log(data);
  const section = document.createElement('section');
  if(data.thumbnail != null){ // API error only 4 people have thumbnail
  peopleList.appendChild(section);
  }
  //displaying astronaut
  if(data.thumbnail != null){
  section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>${data.extract}</p>
  `;
  }
}

btn.addEventListener('click', (event) => { 
  getJSON(astrosUrl,getProfiles); // get the array of people
    //console.log(json);
  event.target.remove(); // remove the button after click
});