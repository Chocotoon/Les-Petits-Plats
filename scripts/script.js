const galerie = document.getElementById("galerie");
const totalRecipe = document.querySelector(".nombre_recettes");
const listIngredientsFiltre = document.getElementById("btn_ingredients_list");
let nbeRecettes = 0;

async function getRecipeData() {
    const response = await fetch("./data/recipes.json");
    const data = await response.json();
    const recipes = data.recipes;
    return recipes;
}

getRecipeData().then(recipes =>
    recipes.forEach(recipeData => {
        const recipe = createRecipeCard(recipeData);
        const recipeCard = recipe.createRecipeDOM();
        galerie.appendChild(recipeCard)
        nbeRecettes += 1;
        recipeData.ingredients.forEach(ingredient => {
           const filtreIngredient =  document.createElement("span");
           filtreIngredient.innerText = `${ingredient.ingredient}`
           filtreIngredient.classList.add("filtre_ingredient");
           filtreIngredient.setAttribute("value", `${ingredient.ingredient}`)
           listIngredientsFiltre.appendChild(filtreIngredient);
            
        })
    })
).then(() => {
    totalRecipe.innerText = `${nbeRecettes} recettes`;
}
)