/*************************DOM Elements****************************** */

const galerie = document.getElementById("galerie");
const filtreSectionDOM = document.getElementById("tag_container");
const totalRecipe = document.querySelector(".nombre_recettes");
const filtresContainers = document.querySelectorAll(".btn_item_list");
const listIngredientsFiltre = document.getElementById("btn_ingredients_list");
const listApplianceFiltre = document.getElementById("btn_appliance_list");
const listUstensileFiltre = document.getElementById("btn_ustensile_list");
const btnIngredientIcon = document.querySelector("#btn_ingredients i");
const btnApplianceIcon = document.querySelector("#btn_appliances i");
const btnUstensilesIcon = document.querySelector("#btn_ustensils i");
const ingredientInput = document.getElementById("ingredient_input");
const ustensilInput = document.getElementById("ustensile_input");
const applianceInput = document.getElementById("appliance_input");
const valueIngredientClear = document.querySelector("#btn_ingredients .fa-xmark");
const valueApplianceClear = document.querySelector("#btn_appliances .fa-xmark");
const valueUstensilsClear = document.querySelector("#btn_ustensils .fa-xmark");
const mainSearchInput = document.getElementById("search_bar");
const searchBtn = document.getElementById("search_btn");
const mainSearchClear = document.querySelector("header .fa-xmark");
let mainInputValue = mainSearchInput.value;
let nbeRecettes;

/*******************************Tableaux***************************************** */

const recipeArray = [];
const ingredientSet = new Set();
const applianceSet = new Set();
const ustensileSet = new Set();
let activeFilters = [];

/*************************************************************************************************************** */
function constructRecipe(recipeData) {
    const recipe = createRecipeCard(recipeData);
    const recipeCard = recipe.createRecipeDOM();
    galerie.appendChild(recipeCard);
}

async function getRecipeData() {
    const response = await fetch("./data/recipes.json");
    const data = await response.json();
    const recipes = data.recipes;
    return recipes;
}

function setRecipeNumber(array) {
    nbeRecettes = array.length;
    totalRecipe.innerText = `${nbeRecettes} recettes`;
}

getRecipeData().then(recipes => {

    /*******************************Création des fiches recettes******************************************* */

    recipes.forEach(recipeData => {
        constructRecipe(recipeData);
        recipeArray.push(recipeData)
        recipeData.ingredients.forEach(ingredient => {
            ingredientSet.add(ingredient.ingredient);
        });
        recipeData.ustensils.forEach(ustensil => {
            ustensileSet.add(ustensil);
        });
        applianceSet.add(recipeData.appliance);
    });
    setRecipeNumber(recipes);

    /*********************************Création des listes de filtres*********************************************************** */

    constructFilterLists(ingredientSet, applianceSet, ustensileSet);


    /*************************************Création des tags**************************************** */
    filtresContainers.forEach(filtreContainer =>
        filtreContainer.addEventListener("click", () => {
            const target = event.target;
            if (target.classList.contains("filtre_list_item")) {
                const value = target.getAttribute("data-value");
                const tagCard = document.createElement("span");
                tagCard.setAttribute("data-value", `${value}`)
                tagCard.classList.add("tag");
                tagCard.innerHTML = `${value} <i class="fa-solid fa-xmark"></i>`
                filtreSectionDOM.appendChild(tagCard);
                ingredientInput.value = "";
                ustensilInput.value = "";
                applianceInput.value = "";
                filtreContainer.setAttribute("aria-expanded", "false");
                updateFiltreIcon();
                valueIngredientClear.style.display = "none";
                valueApplianceClear.style.display = "none";
                valueUstensilsClear.style.display = "none";

                /*******************************Gestion des filtres par tag******************************************* */

                if (activeFilters.length === 1 && filtreSectionDOM.children.length === 0) {
                    Array.from(filtreSectionDOM.children).forEach(element => {
                        const value = element.getAttribute("data-value");
                        activeFilters.push(value);
                    })
                    const filteredRecipes = recipeArray.filter(recipe =>
                        recipe.ingredients.some(ingredient => ingredient.ingredient.includes(mainInputValue)) ||
                        recipe.name.includes(mainInputValue) ||
                        recipe.description.includes(mainInputValue)).filter(recipe =>
                            recipe.ingredients.some(ingredient =>
                                ingredient.ingredient === value) ||
                            recipe.ustensils.some(ustensil => ustensil === value) ||
                            recipe.appliance === value);

                    filteredRecipes.forEach(recipeData => {
                        constructRecipe(recipeData);
                        recipeArray.push(recipeData)
                        recipeData.ingredients.forEach(ingredient => {
                            ingredientSet.add(ingredient.ingredient);
                        });
                        recipeData.ustensils.forEach(ustensil => {
                            ustensileSet.add(ustensil);
                        });
                        applianceSet.add(recipeData.appliance);
                    });

                }

                if (filtreSectionDOM.children.length >= 1 && mainInputValue == "") {
                    clearFilterListsDOM();
                    activeFilters.length = 0;
                    Array.from(filtreSectionDOM.children).forEach(element => {
                        const value = element.getAttribute("data-value");
                        activeFilters.push(value);
                    })
                    const filteredRecipes = recipeArray.filter(recipe =>

                        activeFilters.every(filterValue =>
                            recipe.ingredients.some(ingredient => ingredient.ingredient === filterValue) ||
                            recipe.ustensils.some(ustensil => ustensil === filterValue) ||
                            recipe.appliance === filterValue
                        ));

                    galerie.innerHTML = "";
                    setRecipeNumber(filteredRecipes);
                    clearFilters()
                    filteredRecipes.forEach(filteredRecipe => {
                        constructRecipe(filteredRecipe)
                        filteredRecipe.ingredients.forEach(ingredient => {
                            const isIngredientActive = activeFilters.every(activeFilter =>
                                ingredient.ingredient !== activeFilter
                            );

                            if (isIngredientActive) {
                                ingredientSet.add(ingredient.ingredient);
                            }
                        });

                        filteredRecipe.ustensils.forEach(ustensil => {
                            const isUstensilActive = activeFilters.every(activeFilter =>
                                ustensil !== activeFilter
                            );

                            if (isUstensilActive) {
                                ustensileSet.add(ustensil);
                            }
                        });
                        const isApplianceActive = activeFilters.every(activeFilter =>
                            filteredRecipe.appliance !== activeFilter
                        )
                        if (isApplianceActive) {
                            applianceSet.add(filteredRecipe.appliance);
                        }
                    })
                    constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                }

                else if (filtreSectionDOM.children.length >= 1 && mainInputValue !== "") {
                    activeFilters.length = 0;
                    Array.from(filtreSectionDOM.children).forEach(element => {
                        const value = element.getAttribute("data-value");
                        activeFilters.push(value);
                    })
                    clearFilterListsDOM();
                    const filteredRecipes = recipeArray.filter(recipe =>
                        recipe.ingredients.some(ingredient => ingredient.ingredient.includes(mainInputValue)) ||
                        recipe.name.includes(mainInputValue) ||
                        recipe.description.includes(mainInputValue)).filter(recipe =>
                            activeFilters.every(filterValue =>
                                recipe.ingredients.some(ingredient =>
                                    ingredient.ingredient === filterValue) ||
                                recipe.ustensils.some(ustensil => ustensil === filterValue) ||
                                recipe.appliance === filterValue));

                    galerie.innerHTML = "";
                    setRecipeNumber(filteredRecipes);
                    clearFilters();
                    filteredRecipes.forEach(filteredRecipe => {
                        constructRecipe(filteredRecipe);
                        filteredRecipe.ingredients.forEach(ingredient => {
                            if (ingredient.ingredient != value) {
                                ingredientSet.add(ingredient.ingredient);
                            }
                        });
                        filteredRecipe.ustensils.forEach(ustensil => {
                            if (ustensil != value) {
                                ustensileSet.add(ustensil);
                            }
                        });
                        if (filteredRecipe.appliance != value) {
                            applianceSet.add(filteredRecipe.appliance);
                        }
                    })
                    constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                };

                /**************************************Suppression des tags*************************************************** */

                filtreSectionDOM.addEventListener("click", () => {
                    const target = event.target;
                    if (target.classList.contains("fa-xmark")) {
                        target.parentElement.remove();
                        if (filtreSectionDOM.children.length >= 1) {
                            activeFilters.length = 0;
                            clearFilterListsDOM();
                            clearFilters()
                            galerie.innerHTML = "";
                            Array.from(filtreSectionDOM.children).forEach(element => {
                                const value = element.getAttribute("data-value");
                                activeFilters.push(value);
                            })
                            const filteredRecipes = recipeArray.filter(recipe =>
                                recipe.ingredients.some(ingredient => ingredient.ingredient.includes(mainInputValue)) ||
                                recipe.name.includes(mainInputValue) ||
                                recipe.description.includes(mainInputValue)).filter(recipe =>
                                    activeFilters.every(filterValue =>
                                        recipe.ingredients.some(ingredient =>
                                            ingredient.ingredient === filterValue) ||
                                        recipe.ustensils.some(ustensil => ustensil === filterValue) ||
                                        recipe.appliance === filterValue));

                            filteredRecipes.forEach(filteredRecipe => {
                                filteredRecipe.ingredients.forEach(ingredient => {
                                    ingredientSet.add(ingredient.ingredient);
                                });

                                filteredRecipe.ustensils.forEach(ustensil => {
                                    ustensileSet.add(ustensil);
                                });
                                ;
                                applianceSet.add(filteredRecipe.appliance);
                                constructRecipe(filteredRecipe);
                            })

                            constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                            setRecipeNumber(filteredRecipes);
                        }

                        if (filtreSectionDOM.children.length === 0) {
                            activeFilters.length = 0
                            const filteredRecipes = recipeArray.filter(recipe =>
                                recipe.ingredients.some(ingredient => ingredient.ingredient.includes(mainInputValue)) ||
                                recipe.name.includes(mainInputValue) ||
                                recipe.description.includes(mainInputValue)
                            )
                            galerie.innerHTML = "";
                            clearFilterListsDOM();
                            clearFilters()
                            filteredRecipes.forEach(filteredRecipe => {
                                constructRecipe(filteredRecipe)
                                filteredRecipe.ingredients.forEach(ingredient => {
                                    ingredientSet.add(ingredient.ingredient);
                                });
                                filteredRecipe.ustensils.forEach(ustensil => {
                                    ustensileSet.add(ustensil);
                                });
                                applianceSet.add(filteredRecipe.appliance);
                            });
                            setRecipeNumber(filteredRecipes);
                            constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                        }
                    }
                })
            }
        }))

    /**********************Champs de recherche Avancée Ingrédients *************************************************** */

    ingredientInput.addEventListener("input", () => {
        advancedFilter(valueIngredientClear, ingredientInput)
    })
    applianceInput.addEventListener("input", () => {
        advancedFilter(valueApplianceClear, applianceInput)
    })
    ustensilInput.addEventListener("input", () => {
        advancedFilter(valueUstensilsClear, ustensilInput)
    })

    /*******************************************Recherche principale*********************************************** */

    mainSearchInput.addEventListener("input", () => {
        mainInputValue = mainSearchInput.value;
        let filteredRecipes = [];
        if (mainInputValue.length > 2) {
            recipeArray.length = 0;
            for (i = 0; i < recipes.length; i++) {
                recipeArray.push(recipes[i])
            }
            filteredRecipes.length = 0;
            mainSearchClear.style.display = "block";
            mainSearchClear.addEventListener("click", () => {
                mainSearchClear.style.display = "none";
                mainSearchInput.value = "";
                mainInputValue = "";
                galerie.innerHTML = "";
                recipeArray.length = 0;
                for (i = 0; i < recipes.length; i++) {
                    recipeArray.push(recipes[i])
                    constructRecipe(recipes[i])
                    for (index = 0; index < recipes[i].ingredients.length; index++) {
                        ingredientSet.add(recipes[i].ingredients[index].ingredient)
                    }
                    for (index = 0; index < recipes[i].ustensils.length; index++) {
                        ustensileSet.add(recipes[i].ustensils[index])
                    }
                    applianceSet.add(recipes[i].appliance)
                }
                setRecipeNumber(recipes);
                constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                let children = Array.from(filtreSectionDOM.children)
                for (i = 0; i < children.length; i++) {
                    children[i].remove()
                }
            })

            for (let i of recipeArray) {
                if (i.ingredients.includes(mainInputValue) ||
                    i.name.includes(mainInputValue) ||
                    i.description.includes(mainInputValue)) {
                        filteredRecipes.push(i)
                    }
                }

            searchBtn.addEventListener("click", () => {
                if (mainInputValue != "") {
                    activeFilters.length = 0;
                    activeFilters.push(mainInputValue);
                    galerie.innerHTML = "";
                    clearFilterListsDOM();
                    clearFilters()
                    for(let i = 0; i < filteredRecipes.length; i++) {
                        constructRecipe(filteredRecipes[i])
                        for(let index = 0; index < filteredRecipes[i].ingredients.length; index ++) {
                            ingredientSet.add(filteredRecipes[i].ingredients[index].ingredient)
                        }
                        for (let index = 0; index < filteredRecipes[i].ustensils.length; index++) {
                            ustensileSet.add(filteredRecipes[i].ustensils[index])
                        }
                        applianceSet.add(filteredRecipes[i].appliance)                        
                    }
                    setRecipeNumber(filteredRecipes);
                    constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                    if (filteredRecipes.length === 0) {
                        galerie.innerHTML = ""
                        galerie.innerText = `Aucun résultat ne correspond à "${mainInputValue}". N'hésitez pas à essayer avec un nouveau mot-clé ! `
                    }
                }
            })
        }
    })
})