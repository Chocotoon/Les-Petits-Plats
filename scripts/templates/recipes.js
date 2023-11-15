function createRecipeCard(data) {
    const { id, image, name, servings, ingredients, time, description, appliance, ustensils} = data;

    function createRecipeDOM() {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe_card");

        const recipeImg = document.createElement("img");
        recipeImg.setAttribute("src", `././assets/photos/${image}`);

        const recipeTitle = document.createElement("h2");
        recipeTitle.innerText = name;

        const recetteSection = document.createElement("div");
        recetteSection.classList.add("recette_section")
        const recetteTitle = document.createElement("h3");
        recetteTitle.innerText = "recette";
        const recetteDescription = document.createElement("p");
        recetteDescription.innerText = description
        const duree = document.createElement("span");
        duree.classList.add("duree");
        duree.innerText = `${time}min`
        const ingredientsSection = document.createElement("div");
        ingredientsSection.classList.add("ingredients_section")
        const ingredientsList = document.createElement("div");
        ingredientsList.classList.add("ingredients_list")
        const ingredientsTitle = document.createElement("h3");
        ingredientsTitle.innerText = "ingrédients";
        ingredientsSection.appendChild(ingredientsTitle);
        ingredientsSection.appendChild(ingredientsList);
        ingredients.forEach(ingredientData => {
            const ingredientsBloc = document.createElement("div");
            ingredientsBloc.classList.add("ingredient_bloc")
            const ingredientElement = document.createElement("span");
            ingredientElement.innerText = `${ingredientData.ingredient}`;
            const quantity = document.createElement("span");
            quantity.classList.add("quantity")
            if (!ingredientData.quantity) {
                quantity.innerText="";
            }
            else if (!ingredientData.unit ) {
                quantity.innerText = `${ingredientData.quantity}`
            }
            else {
                quantity.innerText = `${ingredientData.quantity} ${ingredientData.unit}`;
            }
            ingredientsBloc.appendChild(ingredientElement);
            ingredientsBloc.appendChild(quantity);
            ingredientsList.appendChild(ingredientsBloc);
        })
        
        
        recetteSection.appendChild(recetteTitle);
        recetteSection.appendChild(recetteDescription);
        recipeCard.appendChild(duree);
        recipeCard.appendChild(recipeImg);
        recipeCard.appendChild(recipeTitle);
        recipeCard.appendChild(recetteSection);
        recipeCard.appendChild(ingredientsSection);

        return recipeCard;
    }
    return { id, image, name, servings, ingredients, time, description, appliance, ustensils, createRecipeDOM };
}