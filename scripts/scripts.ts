/*************************DOM Elements****************************** */

const galerie = document.getElementById("galerie") as HTMLElement;
const filtreSectionDOM = document.getElementById("tag_container") as HTMLElement;
const totalRecipe = document.querySelector(".nombre_recettes") as HTMLElement;
const filtresContainers = document.querySelectorAll(".btn_item_list");
const listIngredientsFiltre = document.getElementById("btn_ingredients_list") as HTMLSelectElement;
const listApplianceFiltre = document.getElementById("btn_appliance_list") as HTMLSelectElement;
const listUstensileFiltre = document.getElementById("btn_ustensile_list") as HTMLSelectElement;
const btnIngredient = document.getElementById("btn_ingredients") as HTMLButtonElement;
const btnAppliance = document.getElementById("btn_appliances") as HTMLButtonElement;
const btnUstensiles = document.getElementById("btn_ustensils") as HTMLButtonElement;
const btnIngredientIcon = document.querySelector("#btn_ingredients i") as HTMLElement;
const btnApplianceIcon = document.querySelector("#btn_appliances i") as HTMLElement;
const btnUstensilesIcon = document.querySelector("#btn_ustensils i") as HTMLElement;
const ingredientInput = document.getElementById("ingredient_input") as HTMLInputElement;
const ustensilInput = document.getElementById("ustensile_input") as HTMLInputElement;
const applianceInput = document.getElementById("appliance_input") as HTMLInputElement;
const valueIngredientClear = document.querySelector("#btn_ingredients .fa-xmark") as HTMLElement;
const valueApplianceClear = document.querySelector("#btn_appliances .fa-xmark") as HTMLElement;
const valueUstensilsClear = document.querySelector("#btn_ustensils .fa-xmark") as HTMLElement;
const mainSearchInput = document.getElementById("search_bar") as HTMLInputElement;
const searchBtn = document.getElementById("search_btn") as HTMLButtonElement;
const mainSearchClear = document.querySelector("header .fa-xmark") as HTMLElement;
let mainInputValue = mainSearchInput?.value;
let nbeRecettes;

/*******************************Tableaux***************************************** */

const recipeArray: any[] = [];
const ingredientSet = new Set();
const applianceSet = new Set();
const ustensileSet = new Set();
let activeFilters: any[] = [];

/***************************EventListeners des filtres****************************************** */

function btnToggle(filtreList: HTMLElement, btnIcon: HTMLElement, btnClear: HTMLElement, event: MouseEvent) {
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
btnIngredient?.addEventListener("click", function (event) {
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

function constructIngredientList(ingredient: string) {
    const filtreIngredient = document.createElement("span");
    filtreIngredient.innerText = `${ingredient}`;
    filtreIngredient.classList.add("filtre_list_item");
    filtreIngredient.setAttribute("data-value", `${ingredient}`);
    listIngredientsFiltre.appendChild(filtreIngredient);

}

function constructApplianceList(appliance: string) {
    const filtreAppliance = document.createElement("span");
    filtreAppliance.innerText = `${appliance}`;
    filtreAppliance.classList.add("filtre_list_item");
    filtreAppliance.setAttribute("data-value", `${appliance}`);
    listApplianceFiltre.appendChild(filtreAppliance);
}

function constructUstensileList(ustensile: string) {
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
function constructFilterLists(ingredientSet: Set<any>, applianceSet: Set<any>, ustensileSet: Set<any>) {
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
function constructRecipe(recipeData: Recipe) {
    const recipe = createRecipeCard(recipeData);
    const recipeCard = recipe.createRecipeDOM();
    galerie?.appendChild(recipeCard);
}

async function getRecipeData() {
    const response = await fetch("./data/recipes.json");
    const data = await response.json();
    const recipes = data.recipes;
    return recipes;
}

function setRecipeNumber(recipes: Recipe[]) {
    nbeRecettes = recipes.length;
    totalRecipe.innerText = `${nbeRecettes} recettes`;
}

function advancedFilter(clearBtn: HTMLElement, inputELEMENT: HTMLInputElement) {
    clearBtn.style.display = "block";
    let inputValue = inputELEMENT.value;
    Array.from(filtreSectionDOM.children).forEach(element => {
        let value = element.getAttribute("data-value");
        activeFilters.push(value);
    })
    if (inputValue.length > 2) {
        const filteredRecipes = recipeArray.filter(recipe =>
            activeFilters.every(filterValue =>
                recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient === filterValue) ||
                recipe.ustensils.some((ustensil: string) => ustensil === filterValue) ||
                recipe.appliance === filterValue
            ));
        clearFilterListsDOM();
        if (inputELEMENT === ingredientInput) {
            ingredientSet.clear()
            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
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
                recipe.ustensils.forEach((ustensil: string) => {
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
            Array.from(filtreSectionDOM!.children).forEach(element => {
               let value = element.getAttribute("data-value");
                activeFilters.push(value);
            })
            const filteredRecipes = recipeArray.filter(recipe =>
                activeFilters.every(filterValue =>
                    recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient === filterValue) ||
                    recipe.ustensils.some((ustensil: string) => ustensil === filterValue) ||
                    recipe.appliance === filterValue
                ));
            clearFilterListsDOM();
            clearFilters()

            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                    activeFilters.forEach(activeFilter => {

                        if (ingredient.ingredient.toLowerCase().includes(activeFilter)) {
                            ingredientSet.add(ingredient.ingredient);
                        }
                    })
                });

                filteredRecipes.forEach(recipe => {
                    recipe.ustensils.forEach((ustensil: string) =>
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
                recipeData.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                    ingredientSet.add(ingredient.ingredient);
                });
                recipeData.ustensils.forEach((ustensil: string) => {
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
                recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) =>
                    activeFilters.includes(ingredient.ingredient)
                ) ||
                recipe.ustensils.some((ustensil: string) =>
                    activeFilters.includes(ustensil)
                ) ||
                activeFilters.includes(recipe.appliance));

            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach((ustensil: string) => {
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

                filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach((ustensil: string) => {
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
                recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) =>
                    activeFilters.includes(ingredient.ingredient)
                ) ||
                recipe.ustensils.some((ustensil: string) =>
                    activeFilters.includes(ustensil)
                ) ||
                activeFilters.includes(recipe.appliance));

            filteredRecipes.forEach(filteredRecipe => {
                filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                    ingredientSet.add(ingredient.ingredient);
                });
                filteredRecipe.ustensils.forEach((ustensil: string) => {
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

    recipes.forEach((recipeData: Recipe) => {
        constructRecipe(recipeData);
        recipeArray.push(recipeData)
        recipeData.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
            ingredientSet.add(ingredient.ingredient);
        });
        recipeData.ustensils.forEach((ustensil: string) => {
            ustensileSet.add(ustensil);
        });
        applianceSet.add(recipeData.appliance);
    });
    setRecipeNumber(recipes);

    /*********************************Création des listes de filtres*********************************************************** */

    constructFilterLists(ingredientSet, applianceSet, ustensileSet);


    /*************************************Création des tags**************************************** */
    filtresContainers.forEach(filtreContainer =>
        filtreContainer.addEventListener("click", (event) => {
            const target = event.target;
            if (target instanceof Element && target.classList.contains("filtre_list_item")) {
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
                        recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient.includes(mainInputValue)) ||
                        recipe.name.includes(mainInputValue) ||
                        recipe.description.includes(mainInputValue)).filter(recipe =>
                            recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) =>
                                ingredient.ingredient === value) ||
                            recipe.ustensils.some((ustensil: string) => ustensil === value) ||
                            recipe.appliance === value);

                    filteredRecipes.forEach(recipeData => {
                        constructRecipe(recipeData);
                        recipeArray.push(recipeData)
                        recipeData.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                            ingredientSet.add(ingredient.ingredient);
                        });
                        recipeData.ustensils.forEach((ustensil: string) => {
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
                            recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient === filterValue) ||
                            recipe.ustensils.some((ustensil: string) => ustensil === filterValue) ||
                            recipe.appliance === filterValue
                        ));

                    galerie.innerHTML = "";
                    setRecipeNumber(filteredRecipes);
                    clearFilters()
                    filteredRecipes.forEach(filteredRecipe => {
                        constructRecipe(filteredRecipe)
                        filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                            const isIngredientActive = activeFilters.every(activeFilter =>
                                ingredient.ingredient !== activeFilter
                            );

                            if (isIngredientActive) {
                                ingredientSet.add(ingredient.ingredient);
                            }
                        });

                        filteredRecipe.ustensils.forEach((ustensil: string) => {
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
                        recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient.includes(mainInputValue)) ||
                        recipe.name.includes(mainInputValue) ||
                        recipe.description.includes(mainInputValue)).filter(recipe =>
                            activeFilters.every(filterValue =>
                                recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) =>
                                    ingredient.ingredient === filterValue) ||
                                recipe.ustensils.some((ustensil: string) => ustensil === filterValue) ||
                                recipe.appliance === filterValue));

                    galerie.innerHTML = "";
                    setRecipeNumber(filteredRecipes);
                    clearFilters();
                    filteredRecipes.forEach(filteredRecipe => {
                        constructRecipe(filteredRecipe);
                        filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                            if (ingredient.ingredient != value) {
                                ingredientSet.add(ingredient.ingredient);
                            }
                        });
                        filteredRecipe.ustensils.forEach((ustensil: string) => {
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

                filtreSectionDOM.addEventListener("click", (event: MouseEvent) => {
                    const target: any = event.target;
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
                                recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient.includes(mainInputValue)) ||
                                recipe.name.includes(mainInputValue) ||
                                recipe.description.includes(mainInputValue)).filter(recipe =>
                                    activeFilters.every(filterValue =>
                                        recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) =>
                                            ingredient.ingredient === filterValue) ||
                                        recipe.ustensils.some((ustensil:string) => ustensil === filterValue) ||
                                        recipe.appliance === filterValue));

                            filteredRecipes.forEach(filteredRecipe => {
                                filteredRecipe.ingredients.forEach(((ingredient: {ingredient: string, quantity: number}) => {
                                    ingredientSet.add(ingredient.ingredient);
                                }));

                                filteredRecipe.ustensils.forEach((ustensil: string) => {
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
                                recipe.ingredients.some((ingredient: {ingredient: string, quantity: number}) => ingredient.ingredient.includes(mainInputValue)) ||
                                recipe.name.includes(mainInputValue) ||
                                recipe.description.includes(mainInputValue)
                            )
                            galerie.innerHTML = "";
                            clearFilterListsDOM();
                            clearFilters()
                            filteredRecipes.forEach(filteredRecipe => {
                                constructRecipe(filteredRecipe)
                                filteredRecipe.ingredients.forEach((ingredient: {ingredient: string, quantity: number}) => {
                                    ingredientSet.add(ingredient.ingredient);
                                });
                                filteredRecipe.ustensils.forEach((ustensil : string) => {
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
            for (let i = 0; i < recipes.length; i++) {
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
                for (let i = 0; i < recipes.length; i++) {
                    recipeArray.push(recipes[i])
                    constructRecipe(recipes[i])
                    for (let index = 0; index < recipes[i].ingredients.length; index++) {
                        ingredientSet.add(recipes[i].ingredients[index].ingredient)
                    }
                    for (let index = 0; index < recipes[i].ustensils.length; index++) {
                        ustensileSet.add(recipes[i].ustensils[index])
                    }
                    applianceSet.add(recipes[i].appliance)
                }
                setRecipeNumber(recipes);
                constructFilterLists(ingredientSet, applianceSet, ustensileSet);
                let children = Array.from(filtreSectionDOM.children)
                for (let i = 0; i < children.length; i++) {
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