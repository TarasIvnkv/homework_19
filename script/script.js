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
    favouriteCheckbox.addEventListener("change", () => updateFavourite(hero.id, favouriteCheckbox.checked));
    favouriteCell.append(favouriteCheckbox);
    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-id", hero.id);
    deleteButton.addEventListener("click", () => deleteHero(hero.id));
    actionsCell.append(deleteButton);
    row.append(nameCell);
    row.append(comicsCell);
    row.append(favouriteCell);
    row.append(actionsCell);
    row.setAttribute("data-id", hero.id);
    heroTable.append(row);
}

const fetchHeroes = () => {
    fetch(API)
        .then((data) => {
            if (data.ok) return data.json();
            else return Promise.reject(data.status);
        })
        .then(heroes => {
            heroes.forEach(hero => {
                const existingRow = document.querySelector(`tr[data-id="${hero.id}"]`);
                if (existingRow) {
                    const favouriteCheckbox = existingRow.querySelector("input[type='checkbox']");
                    favouriteCheckbox.checked = hero.favourite;
                } else {
                    renderHero(hero);
                }
            });
        })
        .catch(err => console.log(`in catch ${err}`));
}

function addHero() {
    const heroName = document.querySelector("heroName").value;
    const heroComics = document.querySelector("heroComics").value;
    const heroFavourite = document.querySelector("heroFavourite").checked;

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: heroName,
            comics: heroComics,
            favourite: heroFavourite
        })
    })
        .then((data) => {
            if(data.ok) return data.json();
            else return Promise.reject(data.status);
        })
        .then(() => {
            console.log("New hero added!");
            fetchHeroes();
        })
        .catch(error => console.error(error));
}

function updateFavourite(id, favourite) {
    fetch(API + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ favourite })
    })
        .then(() => {
            console.log("Favourite updated!");
            fetchHeroes();
        })
        .catch(err => console.log(err));
}

function deleteHero(id) {
    fetch(API + "/" + id, {
        method: "DELETE"
    })
        .then(() => {
            console.log("Hero deleted!");
            const deletedRow = document.querySelector(`tr[data-id="${id}"]`);
            if (deletedRow) {
                deletedRow.remove();
            }
        })
        .catch(err => console.log(err));
}

addHeroForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addHero();
});

function fillComicsSelect() {
    fetch(comicsAPI)
        .then((data) => {
            if(data.ok) return data.json();
            else return Promise.reject(data.status);
        })
        .then(comics => {
            const heroComics = document.querySelector("#heroComics");
            comics.forEach(comic => {
                const option = document.createElement("option");
                option.value = comic.name;
                option.text = comic.name;
                heroComics.append(option);
            });
        })
        .catch(err => console.log(`in catch ${err}`));
}

fillComicsSelect();
fetchHeroes();