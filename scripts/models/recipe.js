class Recipe {
    constructor(data) {
        this._id = data.id,
        this._image = data.image,
        this._name = data.name,
        this._servings = data.servings,
        this._ingredients = data.ingredients,
        this._time = data.time,
        this._description = data.description,
        this._appliance = data.appliance,
        this._ustensils = data.ustensils
    }

    get id () {
        return this._id;
    }

    get image () {
        return this._image;
    }

    get name () {
        return this._name;
    }

    get servings () {
        return this._servings;
    }

    get ingedients () {
        return this._ingredients;
    }

    get time () {
        return this._time;
    }

    get description () {
        return this._description;
    }

    get appliance () {
        return this._appliance;
    }

    get ustensils () {
        return this._ustensils;
    }

    createRecipeCard() {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe_card");

        const recipeImg = document.createElement("img");
        recipeImg.setAttribute("src", `././assets/photos/${this._image}`);

        const recipeTitle = document.createElement("h2");
        recipeTitle.innerText = this._name;

        const recetteSection = document.createElement("div");
        const recetteTitle = document.createElement("h3");
        recetteTitle.innerText = "recette";
        const recetteDescription = document.createElement("p");
        recetteDescription.innerText = this._description

        const ingredientsSection = document.createElement("div");
        const ingredientsTitle = document.createElement("h3");
        ingredientsTitle.innerText = "ingrédients";
        this._ingredients.forEach(ingredient, () => {
            const ingredient = document.createElement("span");
            ingredient.innerText = `${ingredient.ingredient}`;
            const quantity = document.createElement("span");
            quantity.innerText = `${ingredient.quantity} ${ingredient.unit}`;
            ingredientsSection.appendChild(ingredient);
            ingredientsSection.appendChild(quantity);
        })
        
        ingredientsSection.appendChild(ingredientsTitle);
        recetteSection.appendChild(recetteTitle);
        recetteSection.appendChild(recetteDescription);
        recipeCard.appendChild(recetteSection);
        recipeCard.appendChild(ingredientsSection);

        return recipeCard;
    }
}