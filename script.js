const submit = document.getElementById('submit');
const search = document.getElementById('search');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const single_mealEl = document.getElementById('single-meal');

// --------------------Search meal and fetch from API--------------------

function searchMeal(e) {
    const prevent = e.preventDefault();

    // Clear results
    single_mealEl.innerHTML = '';

    // Get search term
    const term = search.value;
    
    // Check for Empty

    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {

            if(data.meals === null) {
                resultHeading.innerHTML = `<h3>'${term}' not found. please try again!</h3>`;
            } else {
                resultHeading.innerHTML = `<h3>Search result for '${term}':</h3>`;

                mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h4>${meal.strMeal}</h4>
                        </div>
                    </div>
                `)
                .join('');
            }
            // Clear search
            search.value = '';
        })

    } else {
        alert('Please enter a query')
    }
}

// --------------------Fetch meal by ID--------------------

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    });
}

// --------------------Fetch API and get random meal--------------------

function getRandomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';


    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}

// --------------------Add Meal To DOM--------------------

function addMealToDOM(meal) {
    const ingredients = [];

    for(let i = 1 ; i <= 20 ; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img class="single-meal-image" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p class="description">${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `
}

// --------------------Event listeners--------------------

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click' , e => {
    const mealInfo = e.target;

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID)
    }
});