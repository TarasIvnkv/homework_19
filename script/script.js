const API = `https://6519440e818c4e98ac60353a.mockapi.io/heroes`;
const comicsAPI = `https://6519440e818c4e98ac60353a.mockapi.io/comics`;

const addHeroForm = document.querySelector("#addHeroForm");
const heroTable = document.querySelector("#heroTable");

function renderHero(hero) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = hero.name;
    const comicsCell = document.createElement("td");
    comicsCell.textContent = hero.comics;
    const favouriteCell = document.createElement("td");
    const favouriteCheckbox = document.createElement("input");
    favouriteCheckbox.type = "checkbox";
    favouriteCheckbox.checked = hero.favourite;
    favouriteCell.append(favouriteCheckbox);
    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-id", hero.id);
    actionsCell.append(deleteButton);
    row.append(nameCell);
    row.append(comicsCell);
    row.append(favouriteCell);
    row.append(actionsCell);
    heroTable.append(row);
}

const fetchHeroes = () => {
    fetch(API)
        .then((data) => {
            if (data.ok) return data.json();
            else return Promise.reject(data.status);
        })
        .then(heroes => {
            heroTable.innerHTML = "";
            heroes.forEach(hero => {
                renderHero(hero);
            });
        })
        .catch(err => console.log(`in catch ${err}`));
}

const fetchComics = () => {
    fetch(comicsAPI)
        .then((data) => {
            if(data.ok) return data.json();
            else return Promise.reject(data.status);}
        )
        .then(comics => {
            const heroComics = document.querySelector("#heroComics");
            comics.forEach(comic => {
                const option = document.createElement("option");
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