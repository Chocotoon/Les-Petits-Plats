/***************************EventListeners des filtres****************************************** */
const btnIngredient = document.getElementById("btn_ingredients");
const btnAppliance = document.getElementById("btn_appliances");
const btnUstensiles = document.getElementById("btn_ustensils");


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