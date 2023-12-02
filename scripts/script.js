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

/***************************EventListeners des filtres****************************************** */

function btnToggle(filtreList, btnIcon, btnClear, event) {
    if (filtreList.getAttribute("aria-expanded") === "false") {
        filtreList.setAttribute("aria-expanded", "true");
        btnIcon.classList.remove("fa-chevron-down");
        btnIcon.classList.add("fa-chevron-up");
    }
    else if (filtreList.getAttribute("aria-expanded") === "true" && event.target != btnClear) {
        filtreList.removeAttribute("aria-expanded");
        filtreList.setAttribute("aria-expanded", "false");
        btnIcon.classList.remove("fa-chevron-up");
        btnIcon.classList.add("fa-chevron-down");
        btnClear.style.display = "none";
    }
}
btnIngredient.addEventListener("click", function (event) {
    btnToggle(listIngredientsFiltre, btnIngredientIcon, valueIngredientClear, event);
})

btnAppliance.addEventListener("click", function (event) {
    btnToggle(listApplianceFiltre, btnApplianceIcon, valueApplianceClear, event);
})

btnUstensiles.addEventListener("click", function (event) {
    btnToggle(listUstensileFiltre, btnUstensilesIcon, valueUstensilsClear, event);
})

function updateFiltreIcon() {
    const filtreContainerChevrons = document.querySelectorAll(".fa-solid");
    filtreContainerChevrons.forEach(filtreContainerChevron => {
        if (filtreContainerChevron.classList.contains("fa-chevron-up")) {
            filtreContainerChevron.classList.remove("fa-chevron-up");
            filtreContainerChevron.classList.add("fa-chevron-down");
        }
    })
}
/**********************************Fonctions de création des filtres******************************************************* */

function constructIngredientList(ingredient) {
    const filtreIngredient = document.createElement("span");
    filtreIngredient.innerText = `${ingredient}`;
    filtreIngredient.classList.add("filtre_list_item");
    filtreIngredient.setAttribute("data-value", `${ingredient}`);
    listIngredientsFiltre.appendChild(filtreIngredient);

}

function constructApplianceList(appliance) {
    const filtreAppliance = document.createElement("span");
    filtreAppliance.innerText = `${appliance}`;
    filtreAppliance.classList.add("filtre_list_item");
    filtreAppliance.setAttribute("data-value", `${appliance}`);
    listApplianceFiltre.appendChild(filtreAppliance);
}

function constructUstensileList(ustensile) {
    const filtreUstensile = document.createElement("span");
    filtreUstensile.innerText = `${ustensile}`;
    filtreUstensile.classList.add("filtre_list_item");
    filtreUstensile.setAttribute("data-value", `${ustensile}`);
    listUstensileFiltre.appendChild(filtreUstensile);
}
function clearFilterListsDOM() {
    const filtreListsitems = document.querySelectorAll(".btn_item_list span");
    filtreListsitems.forEach(item => {
        item.remove();
    })
}
function constructFilterLists(ingredientSet, applianceSet, ustensileSet) {
    ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
    applianceSet.forEach(appliance => constructApplianceList(appliance));
    ustensileSet.forEach(ustensile => constructUstensileList(ustensile));
}

function clearFilters() {
    ingredientSet.clear();
    applianceSet.clear();
    ustensileSet.clear();
}

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

function setRecipeNumber(recipes) {
    nbeRecettes = recipes.length;
    totalRecipe.innerText = `${nbeRecettes} recettes`;
}

function advancedFilter(clearBtn, inputELEMENT) {
    clearBtn.style.display = "block";
    inputValue = inputELEMENT.value;
    Array.from(filtreSectionDOM.children).forEach(element => {
        value = element.getAttribute("data-value");
        activeFilters.push(value);
    })
    if (inputValue.length > 2) {
        const filteredRecipes = recipeArray.filter(recipe =>
            activeFilters.every(filterValue =>
                recipe.ingredients.some(ingredient => ingredient.ingredient === filterValue) ||
                recipe.ustensils.some(ustensil => ustensil === filterValue) ||
                recipe.appliance === filterValue
            ));
        clearFilterListsDOM();
        if (inputELEMENT === ingredientInput) {
            ingredientSet.clear()
            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach(ingredient => {
                    if (ingredient.ingredient.toLowerCase().includes(inputValue)) {
                        ingredientSet.add(ingredient.ingredient);
                    }
                });
            })
        }
        if (inputELEMENT === applianceInput) {
            applianceSet.clear()
            filteredRecipes.forEach(recipe => {
                if (recipe.appliance.toLowerCase().includes(inputValue)) {
                    applianceSet.add(recipe.appliance);
                }
            })
        }
        if (inputELEMENT === ustensilInput) {
            ustensileSet.clear()
            filteredRecipes.forEach(recipe => {
                recipe.ustensils.forEach(ustensil => {
                    if (ustensil.toLowerCase().includes(inputValue)) {
                        ustensileSet.add(ustensil);
                    }
                });
            })
        }
        constructFilterLists(ingredientSet, applianceSet, ustensileSet);
    }
    else if (inputValue.length < 3 && inputValue.length > 0) {
        if (filtreSectionDOM.children.length >= 1) {
            inputValue = "";
            Array.from(filtreSectionDOM.children).forEach(element => {
                value = element.getAttribute("data-value");
                activeFilters.push(value);
            })
            const filteredRecipes = recipeArray.filter(recipe =>
                activeFilters.every(filterValue =>
                    recipe.ingredients.some(ingredient => ingredient.ingredient === filterValue) ||
                    recipe.ustensils.some(ustensil => ustensil === filterValue) ||
                    recipe.appliance === filterValue
                ));
            clearFilterListsDOM();
            clearFilters()

            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach(ingredient => {
                    activeFilters.forEach(activeFilter => {

                        if (ingredient.ingredient.toLowerCase().includes(activeFilter)) {
                            ingredientSet.add(ingredient.ingredient);
                        }
                    })
                });

                filteredRecipes.forEach(recipe => {
                    recipe.ustensils.forEach(ustensil =>
                        ustensileSet.add(ustensil));
                });
                filteredRecipes.forEach(recipe => {
                    applianceSet.add(recipe.appliance);
                })
            })
            constructFilterLists(ingredientSet, applianceSet, ustensileSet);
        }
        else if (activeFilters.length === 0) {
            clearFilterListsDOM();
            clearFilters()
            recipeArray.forEach(recipeData => {
                recipeData.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                recipeData.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });
                applianceSet.add(recipeData.appliance);
            });
            constructFilterLists(ingredientSet, applianceSet, ustensileSet);

        }
    }

    else if (inputValue.length === 0) {
        clearBtn.style.display = "none";
        if (filtreSectionDOM.children.length >= 1) {
            inputELEMENT.value = "";
            inputValue = "";
            activeFilters.length = 0;
            clearFilterListsDOM();
            clearFilters()

            Array.from(filtreSectionDOM.children).forEach(element => {
                const value = element.getAttribute("data-value");
                activeFilters.push(value);
            })

            const filteredRecipes = recipeArray.filter(recipe =>
                recipe.ingredients.some(ingredient =>
                    activeFilters.includes(ingredient.ingredient)
                ) ||
                recipe.ustensils.some(ustensil =>
                    activeFilters.includes(ustensil)
                ) ||
                activeFilters.includes(recipe.appliance));

            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });
                applianceSet.add(filteredRecipe.appliance);

            });
            constructFilterLists(ingredientSet, applianceSet, ustensileSet);
        }
    }
    clearBtn.addEventListener("click", () => {
        inputELEMENT.value = "";
        inputValue = "";
        clearBtn.style.display = "none";
        activeFilters.length = 0;
        clearFilterListsDOM();
        clearFilters()
        if (filtreSectionDOM.children.length === 0) {
            recipeArray.forEach(filteredRecipe => {

                filteredRecipe.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });

                applianceSet.add(filteredRecipe.appliance);
            })
            constructFilterLists(ingredientSet, applianceSet, ustensileSet);

        }
        if (filtreSectionDOM.children.length >= 1) {
            Array.from(filtreSectionDOM.children).forEach(element => {
                const value = element.getAttribute("data-value");
                activeFilters.push(value);
            })

            const filteredRecipes = recipeArray.filter(recipe =>
                recipe.ingredients.some(ingredient =>
                    activeFilters.includes(ingredient.ingredient)
                ) ||
                recipe.ustensils.some(ustensil =>
                    activeFilters.includes(ustensil)
                ) ||
                activeFilters.includes(recipe.appliance));

            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });
                applianceSet.add(filteredRecipe.appliance);

            });
            constructFilterLists(ingredientSet, applianceSet, ustensileSet);
        }
    })
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
            recipes.forEach(recipe => {
                recipeArray.push(recipe)
            })
            filteredRecipes.length = 0;
            mainSearchClear.style.display = "block";
            mainSearchClear.addEventListener("click", () => {
                mainSearchClear.style.display = "none";
                mainSearchInput.value = "";
                mainInputValue = "";
                galerie.innerHTML = "";
                recipeArray.length = 0;
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
                constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                Array.from(filtreSectionDOM.children).forEach(item => {
                    item.remove();
                })
            })

            filteredRecipes = recipeArray.filter(recipe =>
                recipe.ingredients.some(ingredient => ingredient.ingredient.includes(mainInputValue)) ||
                recipe.name.includes(mainInputValue) ||
                recipe.description.includes(mainInputValue)
            );
            searchBtn.addEventListener("click", () => {
                if (mainInputValue != "") {
                    activeFilters.length = 0;
                    activeFilters.push(mainInputValue);
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
                    if (filteredRecipes.length === 0) {
                        galerie.innerHTML = ""
                        galerie.innerText = `Aucun résultat ne correspond à "${mainInputValue}". N'hésitez pas à essayer avec un nouveau mot-clé ! `
                    }
                }
            })
        }
    })
})