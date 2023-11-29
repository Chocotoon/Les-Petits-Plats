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


/*******************************Tableaux***************************************** */

const recipeArray = [];
const ingredientSet = new Set();
const applianceSet = new Set();
const ustensileSet = new Set();
const tagArray = new Set();
const activeFilters = [];

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

let nbeRecettes = 0;

async function getRecipeData() {
    const response = await fetch("./data/recipes.json");
    const data = await response.json();
    const recipes = data.recipes;
    return recipes;
}

function advancedFilter(clearBtn, inputELEMENT, inputValue) {
    clearBtn.style.display = "block";
    inputValue = inputELEMENT.value;
    let value;
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
        const filtreListsitems = document.querySelectorAll(".btn_item_list span");
        filtreListsitems.forEach(item => {
            item.remove();
        })

        ingredientSet.clear()
        applianceSet.clear()
        ustensileSet.clear()

        filteredRecipes.forEach(filteredRecipe => {
            filteredRecipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toLowerCase().includes(inputValue)) {
                    ingredientSet.add(ingredient.ingredient);
                }
            });

            recipeArray.forEach(recipe => {
                recipe.ustensils.forEach(ustensil =>
                    ustensileSet.add(ustensil));
            });
            recipeArray.forEach(recipe => {
                applianceSet.add(recipe.appliance);
            })
        })

        if (filtreSectionDOM.children.length >= 1) {
            const filtreListsitems = document.querySelectorAll(".btn_item_list span");
            filtreListsitems.forEach(item => {
                item.remove();
            })

            ingredientSet.clear()
            applianceSet.clear()
            ustensileSet.clear()
        }
        filteredRecipes.forEach(filteredRecipe => {
            filteredRecipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toLowerCase().includes(inputValue)
                    && !ingredientSet.has(ingredient.ingredient)) {
                    ingredientSet.add(ingredient.ingredient);
                }
            });

            filteredRecipe.ustensils.forEach(ustensil =>
                ustensileSet.add(ustensil));

            applianceSet.add(filteredRecipe.appliance);
        }
        );

        ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
        applianceSet.forEach(appliance => constructApplianceList(appliance));
        ustensileSet.forEach(ustensile => constructUstensileList(ustensile));
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
            const filtreListsitems = document.querySelectorAll(".btn_item_list span");
            filtreListsitems.forEach(item => {
                item.remove();
            })

            ingredientSet.clear()
            applianceSet.clear()
            ustensileSet.clear()

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
            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
            applianceSet.forEach(appliance => constructApplianceList(appliance));
            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));
        }
        else if (filtreSectionDOM.children.length === 0) {
            const filtreListsitems = document.querySelectorAll(".btn_item_list span");
            filtreListsitems.forEach(item => {
                item.remove();
            })
            ingredientSet.clear()
            applianceSet.clear()
            ustensileSet.clear()
            recipeArray.forEach(recipeData => {
                recipeData.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                recipeData.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });
                applianceSet.add(recipeData.appliance);
            });
            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
            applianceSet.forEach(appliance => constructApplianceList(appliance));
            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));

        }
    }

    else if (inputValue.length === 0) {
        clearBtn.style.display = "none";
        if (filtreSectionDOM.children.length >= 1) {
            inputELEMENT.value = "";
            inputValue = "";
            activeFilters.length = 0;
            const filtreListsitems = document.querySelectorAll(".btn_item_list span");
            filtreListsitems.forEach(item => {
                item.remove();
            })
            ingredientSet.clear()
            applianceSet.clear()
            ustensileSet.clear()

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
            filteredRecipeArray.length = 0;
            filteredRecipeArray.push(...filteredRecipes);

            filteredRecipeArray.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });
                applianceSet.add(filteredRecipe.appliance);

            });
            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
            applianceSet.forEach(appliance => constructApplianceList(appliance));
            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));
        }
    }
    clearBtn.addEventListener("click", () => {
        inputELEMENT.value = "";
        inputValue = "";
        clearBtn.style.display = "none";
        activeFilters.length = 0;
        const filtreListsitems = document.querySelectorAll(".btn_item_list span");
        filtreListsitems.forEach(item => {
            item.remove();
        })
        ingredientSet.clear()
        applianceSet.clear()
        ustensileSet.clear()
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
            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
            applianceSet.forEach(appliance => constructApplianceList(appliance));
            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));

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
            filteredRecipeArray.length = 0;
            filteredRecipeArray.push(...filteredRecipes);

            filteredRecipeArray.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach(ingredient => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach(ustensil => {
                    ustensileSet.add(ustensil);
                });
                applianceSet.add(filteredRecipe.appliance);

            });
            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
            applianceSet.forEach(appliance => constructApplianceList(appliance));
            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));
        }

    })
}

getRecipeData().then(recipes => {

    /*******************************Création des fiches recettes******************************************* */

    recipes.forEach(recipeData => {
        const recipe = createRecipeCard(recipeData);
        const recipeCard = recipe.createRecipeDOM();
        galerie.appendChild(recipeCard);
        recipeArray.push(recipeData)
        recipeData.ingredients.forEach(ingredient => {
            ingredientSet.add(ingredient.ingredient);
        });
        recipeData.ustensils.forEach(ustensil => {
            ustensileSet.add(ustensil);
        });
        applianceSet.add(recipeData.appliance);
    });
    nbeRecettes = recipes.length;
    totalRecipe.innerText = `${nbeRecettes} recettes`;

    /*********************************Création des listes de filtres*********************************************************** */

    ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
    applianceSet.forEach(appliance => constructApplianceList(appliance));
    ustensileSet.forEach(ustensile => constructUstensileList(ustensile));


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
                ingredientInput.value = "";
                ustensilInput.value = "";
                applianceInput.value = "";
                filtreContainer.setAttribute("aria-expanded", "false");
                updateFiltreIcon();
                valueIngredientClear.style.display = "none";
                valueApplianceClear.style.display = "none";
                valueUstensilsClear.style.display = "none";

                /*******************************Gestion des filtres par tag******************************************* */

                if (filtreSectionDOM.children.length === 1) {
                    Array.from(filtreSectionDOM.children).forEach(element => {
                        const value = element.getAttribute("data-value");
                        activeFilters.push(value);
                    })
                    const filteredRecipes = recipeArray.filter(recipe =>
                        recipe.ingredients.some(ingredient =>
                            ingredient.ingredient === value) ||
                        recipe.ustensils.some(ustensil => ustensil === value) ||
                        recipe.appliance === value);
                    filteredRecipeArray.push(...filteredRecipes);
                    filteredRecipeArray.forEach(filteredRecipe => {
                        tagArray.add(filteredRecipe);
                    });

                }

                else if (filtreSectionDOM.children.length > 1) {
                    activeFilters.length = 0
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

                    filteredRecipe.ingredients.forEach(ingredient => {
                        if (!activeFilters.some(activeFilter => activeFilter === ingredient.ingredient)) {
                            ingredientSet.add(ingredient.ingredient);
                        }
                    });
                    filteredRecipe.ustensils.forEach(ustensil => {
                        if (!activeFilters.some(activeFilter => activeFilter === ustensil)) {
                            ustensileSet.add(ustensil);
                        }
                    });
                    ;
                    if (!activeFilters.some(activeFilter => activeFilter === filteredRecipe.appliance)) {
                        applianceSet.add(filteredRecipe.appliance);
                    }
                })
                console.log(filteredRecipeArray.length)
                nbeRecettes = filteredRecipeArray.length;
                totalRecipe.innerText = `${nbeRecettes} recettes`;
                ingredientSet.forEach(ingredient => constructIngredientList(ingredient))
                applianceSet.forEach(appliance => constructApplianceList(appliance));
                ustensileSet.forEach(ustensile => constructUstensileList(ustensile));

                /**************************************Suppression des tags*************************************************** */


                filtreSectionDOM.addEventListener("click", () => {
                    const target = event.target;
                    if (target.classList.contains("fa-xmark")) {
                        target.parentElement.remove();
                        const filtreListsitems = document.querySelectorAll(".btn_item_list span");
                        filtreListsitems.forEach(item => {
                            item.remove();
                        })

                        ingredientSet.clear()
                        applianceSet.clear()
                        ustensileSet.clear()

                        if (filtreSectionDOM.children.length >= 1) {
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

                            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
                            applianceSet.forEach(appliance => constructApplianceList(appliance));
                            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));

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
                            })
                            nbeRecettes = filteredRecipeArray.length;
                            totalRecipe.innerText = `${nbeRecettes} recettes`;
                        }
                        if (filtreSectionDOM.children.length === 0) {

                            galerie.innerHTML = "";
                            nbeRecettes = 0;
                            filteredRecipeArray.length = 0;
                            activeFilters.length = 0;

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
                                nbeRecettes = recipeArray.length;
                                totalRecipe.innerText = `${nbeRecettes} recettes`;

                            })
                            ingredientSet.forEach(ingredient => constructIngredientList(ingredient));
                            applianceSet.forEach(appliance => constructApplianceList(appliance));
                            ustensileSet.forEach(ustensile => constructUstensileList(ustensile));
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
}
)