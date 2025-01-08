const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const showAllCard = document.getElementById("view-all-card");
const myModal = new bootstrap.Modal(document.getElementById("details-modal"));
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const addElementToCart = document.getElementById("cart-body");
const modal_body = document.getElementById("modal-body");
const cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchCocktails("cocktail");
});

const ErrorPage = `
  <div class="container cnt m-auto border p-5 d-flex align-items-center justify-content-center text-center">
    <div class="p-5">
      <div class="error-container">
        <h1>The Item is Not Found</h1>
        <p>Oops! This item does not exist.</p>
        <button onclick="returnToHome()" id="returnToHome" class="btn btn-primary">Go Back Home</button>
      </div>
    </div>
  </div>
`;

const ErrorPage2 = `
  <div class="container cnt m-auto border p-5 d-flex align-items-center justify-content-center text-center">
    <div class="p-5">
      <div class="error-container">
        <h1>The Item is Not Found</h1>
        <p>Oops! This item does not exist.</p>
        <h3>Please search some drinks </h3>
      </div>
    </div>
  </div>
`;

const returnToHome = () => {
  if (cart.length === 0) {
    window.location.href = "index.html";
  } else {
    showAllCard.innerHTML = ErrorPage2;
  }
}

//fatch all data from api
const fetchCocktails = (query) => {
  showAllCard.innerHTML = "";

  fetch(`${API_URL}${query}`)
    .then((response) => response.json())
    .then((data) => {
      displayDrinks(data.drinks);
    })
    .catch(() => (showAllCard.innerHTML = ErrorPage));
};

searchButton.addEventListener("click", () => {
  const query = searchBox.value.trim();
  if (query === "") {
    alert("please Enter a drinks name ");
  } else {
    fetchCocktails(query);
  }
});

//====display all drinks in card
const displayDrinks = (drinks) => {
  if (!drinks) {
    showAllCard.innerHTML = ErrorPage;
    return;
  } else {
    drinks.forEach((drink) => {
      const drinksCard = document.createElement("div");
      drinksCard.classList.add(
        "col-md-6",
        "col-lg-6",
        "mb-3",
        "mt-3",
        "col-xl-4"
      );
      drinksCard.innerHTML = `
        <div class="card">
          <img src="${drink.strDrinkThumb}" class="card-img-top" alt="...">
          <div class="card-body" style="line-height:1.8">
            <h5 class="card-title"> <strong>${drink.strDrink}</strong>  </h5>
             <p class="card-subtitle"><strong> Category: </strong> ${drink.strCategory
        } </p>
            <p class="card-text"> <strong> Instruction: </strong> ${drink.strInstructionsDE
          ? drink.strInstructionsDE.slice(0,15)
          : "No instructions available"
        }...</p>
            <button type="button" data-bs-toggle="modal" 
            data-bs-target="#details-modal" class="btn btn-outline-secondary showdetails-btn"
            onclick="showCardDetails('${drink.strDrinkThumb}','${drink.strDrink}', '${drink.strCategory}','${drink.strInstructions}','${drink.strGlass}','${drink.strAlcoholic}',)">details</button>
            <button type="button" class="btn btn-outline-success addTocart-btn"
            data-id="${drink.idDrink}" onclick="addToCart('${drink.idDrink}','${drink.strDrinkThumb}','${drink.strDrink}')">add to cart</button>
          </div>
          </div>`;
      showAllCard.appendChild(drinksCard);
    });
  }
};



const addToCart = (drinkId, drinkImage, drink_name) => {
  const sirial_num = cart.length;
  const addbtn = document.querySelector(`.addTocart-btn[data-id="${drinkId}"]`);
  if (addbtn.classList.contains("disabled")) {
    return;
  }
  if (cart.some((drink) => drink.id === drinkId)) {
    return;
  }


  if (sirial_num >= 7) {
    alert('Already You take 7 drinks..\nif you can remove by refreshing your browser !!!');
    disableAllAddToCartButtons();
    return;
  } else {
    addbtn.textContent = "Already Added";
    addbtn.classList.add("disabled", "btn-danger");
    addbtn.classList.remove("btn-outline-success");
  }
  cart.push({
    id: drinkId,
    name: drink_name,
    image: drinkImage,
  });

  updateCartDisplay();

}


const updateCartDisplay = () => {
  addElementToCart.innerHTML = " ";
  cart.forEach((drink, index) => {
    addElementToCart.innerHTML +=
      `
       <tr>
          <td>${index + 1}</td>
          <td><img class="img img-fluid rounded rounded-5" src="${drink.image}" alt="${drink.name}e"></td>
          <td>${drink.name}</td>
      </tr>
      `
  });
  document.getElementById(
    "total-cart"
  ).innerHTML = `Total Cart : <strong> ${cart.length} </strong>`;
}


const showCardDetails = (image, name, category, instructions, glass, alcoholic) => {
  if (!modal_body) {
    console.error("Element with ID 'modal-body' not found.");
    return;
  } else {
    modal_body.innerHTML = `
     <div class="row container-fluid">
      <div class="col-12 d-block">
        <img src="${image}" class="card-img-top rounded" alt="...">
          <p class="card-text my-2"><strong>Name: </strong> ${name}</p>
          <p class="card-text my-2"><strong>Category: </strong> ${category}</p>
          <p class="card-text my-2"><strong>Instructions: </strong> ${instructions}</p>
          <p class="card-text my-2"><strong>Glass: </strong> ${glass}</p>
          <p class="card-text my-2"><strong>Alcoholic: </strong> ${alcoholic}</p>
       </div>
      </div>
    `;
  }

};