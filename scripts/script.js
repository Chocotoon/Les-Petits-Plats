/*************************DOM Elements****************************** */

const galerie = document.getElementById("galerie");
const filtreSectionDOM = document.getElementById("tag_container");
const totalRecipe = document.querySelector(".nombre_recettes");
const listIngredientsFiltre = document.getElementById("btn_ingredients_list");
const listApplianceFiltre = document.getElementById("btn_appliance_list");
const listUstensileFiltre = document.getElementById("btn_ustensile_list");
const btnIngredient = document.getElementById("btn_ingredients");
const btnAppliance = document.getElementById("btn_appliances");
const btnUstensiles = document.getElementById("btn_ustensils");
const btnIngredientIcon = document.querySelector("#btn_ingredients i");
const btnApplianceIcon = document.querySelector("#btn_appliances i");
const btnUstensilesIcon = document.querySelector("#btn_ustensils i");

/***************************EventListeners des filtres****************************************** */

btnIngredient.addEventListener("click", () => {
    if (listIngredientsFiltre.getAttribute("aria-expanded") === "false") {
        listIngredientsFiltre.setAttribute("aria-expanded", "true");
        btnIngredientIcon.classList.remove("fa-chevron-down");
        btnIngredientIcon.classList.add("fa-chevron-up");
    }
    window.onclick = function (event) {
        if (event.target != btnIngredient) {
            listIngredientsFiltre.setAttribute("aria-expanded", "false");
            btnIngredientIcon.classList.remove("fa-chevron-up");
            btnIngredientIcon.classList.add("fa-chevron-down");
        }
    }
})

btnAppliance.addEventListener("click", () => {

    if (listApplianceFiltre.getAttribute("aria-expanded") === "false") {
        listApplianceFiltre.setAttribute("aria-expanded", "true");
        btnApplianceIcon.classList.remove("fa-chevron-down");
        btnApplianceIcon.classList.add("fa-chevron-up");
    }

    window.onclick = function (event) {
        if (event.target != btnAppliance) {
            listApplianceFiltre.setAttribute("aria-expanded", "false");
            btnApplianceIcon.classList.remove("fa-chevron-up");
            btnApplianceIcon.classList.add("fa-chevron-down");
        }
    }
})

btnUstensiles.addEventListener("click", () => {

    if (listUstensileFiltre.getAttribute("aria-expanded") === "false") {
        listUstensileFiltre.setAttribute("aria-expanded", "true");
        btnUstensilesIcon.classList.remove("fa-chevron-down");
        btnUstensilesIcon.classList.add("fa-chevron-up");
    }

    window.onclick = function (event) {
        if (event.target != btnUstensiles) {
            listUstensileFiltre.setAttribute("aria-expanded", "false");
            btnUstensilesIcon.classList.remove("fa-chevron-up");
            btnUstensilesIcon.classList.add("fa-chevron-down");
        }
    }
})

let nbeRecettes = 0;

/***************************************************************************************** */

async function getRecipeData() {
    const response = await fetch("./data/recipes.json");
    const data = await response.json();
    const recipes = data.recipes;
    return recipes;
}


getRecipeData().then(recipes => {

    const ingredientSet = new Set();
    /*******************************Création des fiches recettes******************************************* */

    recipes.forEach(recipeData => {
        const recipe = createRecipeCard(recipeData);
        const recipeCard = recipe.createRecipeDOM();
        galerie.appendChild(recipeCard);
        nbeRecettes += 1;

        recipeData.ingredients.forEach(ingredient => {
            ingredientSet.add(ingredient.ingredient);
        });
    });

    /*********************************Création des listes de filtres*********************************************************** */

    ingredientSet.forEach(ingredient => {
        const filtreIngredient = document.createElement("span");
        filtreIngredient.innerText = `${ingredient}`;
        filtreIngredient.classList.add("filtre_list_item");
        filtreIngredient.setAttribute("data-value", `${ingredient}`);
        listIngredientsFiltre.appendChild(filtreIngredient);
    });

    const applianceSet = new Set();
    recipes.forEach(recipeData => {
        applianceSet.add(recipeData.appliance);
    })

    applianceSet.forEach(appliance => {
        const filtreAppliance = document.createElement("span");
        filtreAppliance.innerText = `${appliance}`;
        filtreAppliance.classList.add("filtre_list_item");
        filtreAppliance.setAttribute("data-value", `${appliance}`);
        listApplianceFiltre.appendChild(filtreAppliance);
    });

    const ustensileSet = new Set();
    recipes.forEach(recipeData => {
        recipeData.ustensils.forEach(ustensil => {
            ustensileSet.add(ustensil);
        });
    });

    ustensileSet.forEach(ustensile => {
        const filtreUstensile = document.createElement("span");
        filtreUstensile.innerText = `${ustensile}`;
        filtreUstensile.classList.add("filtre_list_item");
        filtreUstensile.setAttribute("data-value", `${ustensile}`);
        listUstensileFiltre.appendChild(filtreUstensile);
    });


}).then(() => {
    /*************************************Création des tags**************************************** */

    const filtreItems = document.querySelectorAll(".filtre_list_item");
    filtreItems.forEach(filtreItem =>
        filtreItem.addEventListener("click", () => {
            const value = filtreItem.getAttribute("data-value");
            const tagCard = document.createElement("span");
            tagCard.classList.add("tag");
            tagCard.innerHTML = `${value} <i class="fa-solid fa-xmark"></i>`
            filtreSectionDOM.appendChild(tagCard);
            const tagCardIcon = tagCard.querySelector("i");
            tagCardIcon.addEventListener("click", () => {
                    tagCard.remove();
                })
            }))
        
}).then(() => {
    /*******************************************Update du nombre de recettes************************************************ */

    totalRecipe.innerText = `${nbeRecettes} recettes`;
})
