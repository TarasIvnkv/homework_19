const API = `https://6519440e818c4e98ac60353a.mockapi.io/heroes`;
const comicsAPI = `https://6519440e818c4e98ac60353a.mockapi.io/comics`;

const addHeroForm = document.querySelector(`#addHeroForm`);
const heroTable = document.querySelector(`#heroTable`);


const fetchHeroes = () => {
    fetch(API)
        .then((data) => {
            if(data.ok) return data.json();
            else return Promise.reject(data.status);}
        )
        .then(heroes => {
            heroTable.innerHTML = ``;
            heroes
                .forEach(hero => {
                    const row = document.createElement(`tr`);
                    row.innerHTML = `
                        <td>${hero.name}</td>
                        <td>${hero.comics}</td>
                        <td>${hero.favourite ? "Yes" : "No"}</td>
                        <td><button data-id="${hero.id}">Delete</button></td>
                    `;
                    heroTable.append(row);
                });
        })
        .catch(err => console.log(`in catch ${err}`))
}

const fetchComics = () => {
    fetch(comicsAPI)
        .then((data) => {
            if(data.ok) return data.json();
            else return Promise.reject(data.status);}
        )
        .then(comics => {
            const heroComics = document.querySelector("heroComics");
            comics.forEach(comic => {
                const option = document.createElement("option");
                // option.value = comic.name;
                option.innerHTML = comic.name;
                heroComics.append(option);
            });
        })
        .catch(err => console.log(`in catch ${err}`))
}

function addHero() {
    const heroName = document.getElementById("heroName").value;
    const heroComics = document.getElementById("heroComics").value;
    const heroFavourite = document.getElementById("heroFavourite").checked;

    fetch(API)
        .then((data) => {
            if(data.ok) return data.json();
            else return Promise.reject(data.status);}
        )
        .then(heroes => {
            if (heroes.some(hero => hero.name === heroName)) {
                console.log("Hero with the same name already exists!");
            } else {
                const newHero = {
                    name: heroName,
                    comics: heroComics,
                    favourite: heroFavourite
                };

                fetch(API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newHero)
                })
                    .then((data) => {
                        if(data.ok) return data.json();
                        else return Promise.reject(data.status);}
                    )
                    .then(() => {
                        console.log("New hero added!");
                        fetchHeroes();
                    })
                    .catch(error => console.error(error));
            }
        })
        .catch(err => console.log(err));
}

function deleteHero(id) {
    fetch(API + "/" + id, {
        method: "DELETE"
    })
        .then(() => {
            console.log("Hero deleted!");
            fetchHeroes();
        })
        .catch(err => console.log(err));
}

addHeroForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addHero();
});


heroTable.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
        const heroId = e.target.getAttribute("data-id");
        deleteHero(heroId);
    }
});

fetchHeroes();
fetchComics();