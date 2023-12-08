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

/**************************Fonction pour l'input de recherche avancée*************************** */

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