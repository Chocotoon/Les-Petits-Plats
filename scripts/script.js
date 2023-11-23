/*************************DOM Elements****************************** */

const galerie = document.getElementById("galerie");
const filtreSectionDOM = document.getElementById("tag_container");
const totalRecipe = document.querySelector(".nombre_recettes");
const filtresContainers = document.querySelectorAll(".btn_item_list");
const listIngredientsFiltre = document.getElementById("btn_ingredients_list");
const listApplianceFiltre = document.getElementById("btn_appliance_list");
const listUstensileFiltre = document.getElementById("btn_ustensile_list");
const btnIngredient = document.getElementById("btn_ingredients");
const btnAppliance = document.getElementById("btn_appliances");
const btnUstensiles = document.getElementById("btn_ustensils");
const btnIngredientIcon = document.querySelector("#btn_ingredients i");
const btnApplianceIcon = document.querySelector("#btn_appliances i");
const btnUstensilesIcon = document.querySelector("#btn_ustensils i");

/*******************************Tableaux***************************************** */

const recipeArray = [];
const ingredientSet = new Set();
const applianceSet = new Set();
const ustensileSet = new Set();
const tagArray = new Set();
const activeFilters = [];

/***************************EventListeners des filtres****************************************** */

btnIngredient.addEventListener("click", () => {
    if (listIngredientsFiltre.getAttribute("aria-expanded") === "false") {
        listIngredientsFiltre.setAttribute("aria-expanded", "true");
        btnIngredientIcon.classList.remove("fa-chevron-down");
        btnIngredientIcon.classList.add("fa-chevron-up");
    }
    else if (listIngredientsFiltre.getAttribute("aria-expanded") === "true") {
        listIngredientsFiltre.removeAttribute("aria-expanded");
        listIngredientsFiltre.setAttribute("aria-expanded", "false");
        btnIngredientIcon.classList.remove("fa-chevron-up");
        btnIngredientIcon.classList.add("fa-chevron-down");
    }
})

btnAppliance.addEventListener("click", () => {

    if (listApplianceFiltre.getAttribute("aria-expanded") === "false") {
        listApplianceFiltre.setAttribute("aria-expanded", "true");
        btnApplianceIcon.classList.remove("fa-chevron-down");
        btnApplianceIcon.classList.add("fa-chevron-up");
    }
    else if (listApplianceFiltre.getAttribute("aria-expanded") === "true") {
        listApplianceFiltre.removeAttribute("aria-expanded");
        listApplianceFiltre.setAttribute("aria-expanded", "false");
        btnApplianceIcon.classList.remove("fa-chevron-up");
        btnApplianceIcon.classList.add("fa-chevron-down");

    }
})

btnUstensiles.addEventListener("click", () => {

    if (listUstensileFiltre.getAttribute("aria-expanded") === "false") {
        listUstensileFiltre.setAttribute("aria-expanded", "true");
        btnUstensilesIcon.classList.remove("fa-chevron-down");
        btnUstensilesIcon.classList.add("fa-chevron-up");
    }

    else if (listUstensileFiltre.getAttribute("aria-expanded") === "true") {
        listUstensileFiltre.removeAttribute("aria-expanded");
        listUstensileFiltre.setAttribute("aria-expanded", "false");
        btnUstensilesIcon.classList.remove("fa-chevron-up");
        btnUstensilesIcon.classList.add("fa-chevron-down");

    }
})

/***************************************************************************************** */

let nbeRecettes = 0;

async function getRecipeData() {
    const response = await fetch("./data/recipes.json");
    const data = await response.json();
    const recipes = data.recipes;
    return recipes;
}


getRecipeData().then(recipes => {

    /*******************************Création des fiches recettes******************************************* */

    recipes.forEach(recipeData => {
        const recipe = createRecipeCard(recipeData);
        const recipeCard = recipe.createRecipeDOM();
        galerie.appendChild(recipeCard);
        nbeRecettes += 1;
        recipeArray.push(recipeData)
        recipeData.ingredients.forEach(ingredient => {
            ingredientSet.add(ingredient.ingredient);
        });
        recipeData.ustensils.forEach(ustensil => {
            ustensileSet.add(ustensil);
        });
        applianceSet.add(recipeData.appliance);
    });

    totalRecipe.innerText = `${nbeRecettes} recettes`;

    /*********************************Création des listes de filtres*********************************************************** */

    ingredientSet.forEach(ingredient => {
        const filtreIngredient = document.createElement("span");
        filtreIngredient.innerText = `${ingredient}`;
        filtreIngredient.classList.add("filtre_list_item");
        filtreIngredient.setAttribute("data-value", `${ingredient}`);
        listIngredientsFiltre.appendChild(filtreIngredient);
    });

    applianceSet.forEach(appliance => {
        const filtreAppliance = document.createElement("span");
        filtreAppliance.innerText = `${appliance}`;
        filtreAppliance.classList.add("filtre_list_item");
        filtreAppliance.setAttribute("data-value", `${appliance}`);
        listApplianceFiltre.appendChild(filtreAppliance);
    });

    ustensileSet.forEach(ustensile => {
        const filtreUstensile = document.createElement("span");
        filtreUstensile.innerText = `${ustensile}`;
        filtreUstensile.classList.add("filtre_list_item");
        filtreUstensile.setAttribute("data-value", `${ustensile}`);
        listUstensileFiltre.appendChild(filtreUstensile);
    });



    /*************************************Création des tags**************************************** */
    const filteredRecipeArray = [];
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


                /*******************************Gestion des filtres par tag******************************************* */

                if (filtreSectionDOM.children.length === 1) {
                    const filteredRecipes = recipeArray.filter(recipe =>
                        recipe.ingredients.some(ingredient =>
                            ingredient.ingredient === value) ||
                        recipe.ustensils.some(ustensil => ustensil === value) ||
                        recipe.appliance === value);
                    filteredRecipeArray.push(...filteredRecipes);

                    filteredRecipeArray.forEach(filteredRecipe => {
                        tagArray.add(filteredRecipe);
                    });
                    nbeRecettes = 0;
                    galerie.innerHTML = "";
                }

                else if (filtreSectionDOM.children.length > 1) {

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
                    filteredRecipeArray.length = 0;

                    filteredRecipeArray.push(...filteredRecipes);

                    filteredRecipeArray.forEach(filteredRecipe => {
                        tagArray.add(filteredRecipe);
                    });
                }

                nbeRecettes = 0;
                galerie.innerHTML = "";
                /****************************************Mise à jour des filtres disponibles et des recettes************************ */

                const filtreListsitems = document.querySelectorAll(".btn_item_list span");
                filtreListsitems.forEach(item => {
                    item.remove();
                })
                ingredientSet.clear()
                applianceSet.clear()
                ustensileSet.clear()


                filteredRecipeArray.forEach(filteredRecipe => {
                    const recipe = createRecipeCard(filteredRecipe);
                    const recipeCard = recipe.createRecipeDOM();
                    galerie.appendChild(recipeCard);
                    nbeRecettes += 1;
                    totalRecipe.innerText = `${nbeRecettes} recettes`;
                    filteredRecipe.ingredients.forEach(ingredient => {
                        ingredientSet.add(ingredient.ingredient);
                    });

                    filteredRecipe.ustensils.forEach(ustensil => {
                        ustensileSet.add(ustensil);
                    });
                    ;
                    applianceSet.add(filteredRecipe.appliance);

                })

                ingredientSet.forEach(ingredient => {
                    const filtreIngredient = document.createElement("span");
                    filtreIngredient.innerText = `${ingredient}`;
                    filtreIngredient.classList.add("filtre_list_item");
                    filtreIngredient.setAttribute("data-value", `${ingredient}`);
                    listIngredientsFiltre.appendChild(filtreIngredient);
                });

                applianceSet.forEach(appliance => {
                    const filtreAppliance = document.createElement("span");
                    filtreAppliance.innerText = `${appliance}`;
                    filtreAppliance.classList.add("filtre_list_item");
                    filtreAppliance.setAttribute("data-value", `${appliance}`);
                    listApplianceFiltre.appendChild(filtreAppliance);
                });

                ustensileSet.forEach(ustensile => {
                    const filtreUstensile = document.createElement("span");
                    filtreUstensile.innerText = `${ustensile}`;
                    filtreUstensile.classList.add("filtre_list_item");
                    filtreUstensile.setAttribute("data-value", `${ustensile}`);
                    listUstensileFiltre.appendChild(filtreUstensile);
                });

                /**************************************Suppression des tags*************************************************** */


                filtreSectionDOM.addEventListener("click", () => {
                    const target = event.target;
                    if (target.classList.contains("fa-xmark")) {
                        const filtreListsitems = document.querySelectorAll(".btn_item_list span");
                        filtreListsitems.forEach(item => {
                            item.remove();
                        })
                        ingredientSet.clear()
                        applianceSet.clear()
                        ustensileSet.clear()

                        tagArray.forEach(filteredRecipe => {
                            filteredRecipe.ingredients.forEach(ingredient => {
                                ingredientSet.add(ingredient.ingredient);
                            });

                            filteredRecipe.ustensils.forEach(ustensil => {
                                ustensileSet.add(ustensil);
                            });
                            ;
                            applianceSet.add(filteredRecipe.appliance);

                        })

                        ingredientSet.forEach(ingredient => {
                            const filtreIngredient = document.createElement("span");
                            filtreIngredient.innerText = `${ingredient}`;
                            filtreIngredient.classList.add("filtre_list_item");
                            filtreIngredient.setAttribute("data-value", `${ingredient}`);
                            listIngredientsFiltre.appendChild(filtreIngredient);
                        });

                        applianceSet.forEach(appliance => {
                            const filtreAppliance = document.createElement("span");
                            filtreAppliance.innerText = `${appliance}`;
                            filtreAppliance.classList.add("filtre_list_item");
                            filtreAppliance.setAttribute("data-value", `${appliance}`);
                            listApplianceFiltre.appendChild(filtreAppliance);
                        });

                        ustensileSet.forEach(ustensile => {
                            const filtreUstensile = document.createElement("span");
                            filtreUstensile.innerText = `${ustensile}`;
                            filtreUstensile.classList.add("filtre_list_item");
                            filtreUstensile.setAttribute("data-value", `${ustensile}`);
                            listUstensileFiltre.appendChild(filtreUstensile);
                        });

                        const tagArrayAsArray = Array.from(tagArray);
                        const filteredTagArray = tagArrayAsArray.filter(recipe =>
                            activeFilters.every(filterValue =>
                                recipe.ingredients.some(ingredient => ingredient.ingredient === filterValue) ||
                                recipe.ustensils.some(ustensil => ustensil === filterValue) ||
                                recipe.appliance === filterValue
                            ));
                        filteredTagArray.forEach(filteredRecipe => {
                            tagArray.add(filteredRecipe);
                        });
                        galerie.innerHTML = "";
                        nbeRecettes = 0;
                        target.parentElement.remove();
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

                        filteredRecipeArray.length = 0;

                        filteredRecipeArray.push(...filteredRecipes);

                        filteredRecipeArray.forEach(filteredRecipe => {
                            const recipe = createRecipeCard(filteredRecipe);
                            const recipeCard = recipe.createRecipeDOM();
                            galerie.appendChild(recipeCard);
                            nbeRecettes += 1;
                            totalRecipe.innerText = `${nbeRecettes} recettes`;
                        })

                        totalRecipe.innerText = `${nbeRecettes} recettes`;
                        if (filtreSectionDOM.children.length === 0) {

                            galerie.innerHTML = "";
                            nbeRecettes = 0;
                            filteredRecipeArray.length = 0;
                            activeFilters.length = 0;
                            tagArray.clear();
                            ingredientSet.clear();
                            applianceSet.clear();
                            ustensileSet.clear();
                            recipeArray.forEach(filteredRecipe => {

                                filteredRecipe.ingredients.forEach(ingredient => {
                                    ingredientSet.add(ingredient.ingredient);
                                });
                                filteredRecipe.ustensils.forEach(ustensil => {
                                    ustensileSet.add(ustensil);
                                });
                                applianceSet.add(filteredRecipe.appliance);

                                const recipe = createRecipeCard(filteredRecipe);
                                const recipeCard = recipe.createRecipeDOM();
                                galerie.appendChild(recipeCard);
                                nbeRecettes += 1;

                            })
                            ingredientSet.forEach(ingredient => {
                                const filtreIngredient = document.createElement("span");
                                filtreIngredient.innerText = `${ingredient}`;
                                filtreIngredient.classList.add("filtre_list_item");
                                filtreIngredient.setAttribute("data-value", `${ingredient}`);
                                listIngredientsFiltre.appendChild(filtreIngredient);
                            });

                            applianceSet.forEach(appliance => {
                                const filtreAppliance = document.createElement("span");
                                filtreAppliance.innerText = `${appliance}`;
                                filtreAppliance.classList.add("filtre_list_item");
                                filtreAppliance.setAttribute("data-value", `${appliance}`);
                                listApplianceFiltre.appendChild(filtreAppliance);
                            });

                            ustensileSet.forEach(ustensile => {
                                const filtreUstensile = document.createElement("span");
                                filtreUstensile.innerText = `${ustensile}`;
                                filtreUstensile.classList.add("filtre_list_item");
                                filtreUstensile.setAttribute("data-value", `${ustensile}`);
                                listUstensileFiltre.appendChild(filtreUstensile);
                            });
                        }
                    }
                })
            }
        }))
})