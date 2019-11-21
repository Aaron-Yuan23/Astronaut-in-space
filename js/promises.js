const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getJSON(url) {
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if(xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = ()=> reject(Error('A network error occurred'));
    xhr.send();
  });
  
}

function getProfiles(json) {
  const profiles = json.people.map( person => {
    return getJSON(wikiUrl + person.name);      
  }); 
  return Promise.all(profiles); //return single promise when all of the iterables resolved
}

function generateHTML(data) {
  data.map(person => {
    const section = document.createElement('section'); // creates HTML by tagName
    peopleList.appendChild(section);
    if (person.type === "standard") {
      section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>`;
    } else {
      section.innerHTML = `
      <h2>${person.title}</h2>
      <p>No description available</p>`;
    }
  })
}

btn.addEventListener('click', (event) => {
  event.target.textContent = "loading...";
  getJSON(astrosUrl)
    .then(getProfiles)
    .then(generateHTML)
    .catch(err => {
      peopleList.innerHTML = '<h3>Ooops some error occured.</h3>';
      console.log(err)
    })
    .finally(event.target.remove()) // removes the button regardless fetch succeed or not
});