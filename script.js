// fetch('./data.json').then(res=>console.log(res.json()))
let totalQty = 0;
let totalPrice = 0;
const menu = document.querySelector(".menu");
let yourcart = [];
const yourCartEle = document.querySelector(".your--cart");
const orderModalEle = document.querySelector(".order--modal");

let menuData = [];
//for filling the menu from data.json file
async function fillMenu() {
  const res = await fetch("./data.json");
  const data = await res.json();
  menuData = data;
  console.log(data);
  data.map((element, index) => {
    menu.innerHTML += `
   <div class="item">
        <div class="item--order">
          <img class="item--img" src=${element.image.desktop}  />
          <button class="cart--btn" data-id=${index}><img src="./assets/images/icon-add-to-cart.svg" />Add to Cart</button>
        </div>
        <div class="item--desc">
          <p class="category">${element.category}</p>
          <h6>${element.name}</h6>
          <p class="price">$${element.price}</p>
        </div>
      </div>
  `;
  });
}
//adding cart items
function addItemsToCart(index) {
  const { name, price, image } = menuData[index];
  let exists = false;

  for (let i = 0; i < yourcart.length; i++) {
    console.log(yourcart[i].name);
    if (yourcart[i].id === index) {
      yourcart[i].quantity++;
      exists = true;
      return;
    }
  }
  if (!exists) yourcart.push({ name, price, quantity: 1, id: index, image });
  console.log(yourcart);
}
async function init() {
  await fillMenu();
  const addToCartBtns = document.querySelectorAll(".cart--btn");
  console.log(addToCartBtns);
  // Not optimised code
  // addToCartBtns.forEach((ele) =>
  //   ele.addEventListener("click", (e) => {
  //     addItemsToCart(e.target.dataset.id);
  //   })
  // );
  menu.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart--btn")) {
      console.log("yo");
      console.log(e.target.dataset.id);
      addItemsToCart(e.target.dataset.id);
      yourCartDisplay();
    }
  });
}
init();

function yourCartDisplay() {
  totalPrice = 0;
  totalQty = 0;
  yourcart.forEach((el) => {
    totalQty += el.quantity;
    totalPrice += el.price * el.quantity;
  });
  yourCartEle.innerHTML = `
<h2>Your Cart (${totalQty})</h2>
`;
  let yourCartItems = "";
  yourcart.forEach(
    (item) =>
      (yourCartItems += `<div class='your--cart--item'><h4>${item.name}</h4>
  <p><span>${item.quantity}x </span>@${item.price}=$${
        item.quantity * item.price
      }
          <button data-id=${item.id}
          class='remove--cart--btn'
          ><img class='remove-cart' src='./assets/images/icon-remove-item.svg'/></button> 
      </p>
 
 </div>
  `)
  );
  if (totalQty == 0)
    yourCartEle.innerHTML = `<h2>Your Cart (0)</h2>
      <div class="your--cart-description">
        <img src="./assets/images/illustration-empty-cart.svg" class="empty--cart" />
        <p>Your added items will appear here</p>
      </div>`;
  else {
    yourCartEle.innerHTML += yourCartItems;
    yourCartEle.innerHTML += `<div class='order--total'>
    <p>Order Total</p>
    <p><strong>$ ${totalPrice}</strong></p>
    
    </div>
    <div class='carbon'>
      <img src="./assets/images/icon-carbon-neutral.svg"/>
    <p>
    This is a carbon neutral delivery
    </p></div>
    <button class='confirm--order'>Confirm Order</button>
    `;
    document.querySelector(".confirm--order").addEventListener("click", () => {
      orderDisplay();
    });
  }
}
yourCartEle.addEventListener("click", (e) => {
  console.log(e.target.closest(".remove--cart--btn")?.dataset);
  if (
    e.target
      .closest(".remove--cart--btn")
      ?.classList.contains("remove--cart--btn")
  ) {
    const removeId = e.target.closest(".remove--cart--btn").dataset.id;
    console.log("removing", removeId);
    yourcart = yourcart.filter((el) => el.id != removeId);
    console.log(yourcart);

    yourCartDisplay();
  }
});
//order modal
function orderDisplay() {
  orderModalEle.classList.remove("hide");
  let orderContent = "";
  let orderConfirmed = `<div>
  <img src="./assets/images/icon-order-confirmed.svg" width='40px' height='40px'/> 
<h3>Order Confirmed</h3>
<p>We hope you enjoy your food </p>
</div>`;
  yourcart.forEach(
    (item, i) =>
      (orderContent += `<div class='your--order--item'>
        
        <img src=${item.image.thumbnail} class='order--thumbnail' />
        <div>
        <div>
         <p class='order--name'>${item.name}</p>
         </div>
      <div>
  <div class='order--details'>
  <p><span class='order--quantity'>${item.quantity}x </span>@$${item.price} </p>
  <p id='order--price'>$${item.quantity * item.price}  
      </p>    
      </div>
      </div>
   </div>
   
 
 </div>
 `)
  );

  orderModalEle.innerHTML =
    orderConfirmed +
    `<div class='order--items'>` +
    orderContent +
    `</div>` +
    `<div class='order--total'>
  <p>
Order Total</p><p class='order--total--price'>$${totalPrice}</p> 
  
  </div>` +
    `<button class='new--order'>Start new Order</button>`;
}

window.addEventListener("click", (e) => {
  if (!e.target.classList.contains("confirm--order"))
    orderModalEle.classList.add("hide");
  console.log("click");
});
// orderDisplay();
// yourCartDisplay();
/*
{
        "image": {
            "thumbnail": "./assets/images/image-panna-cotta-thumbnail.jpg",
            "mobile": "./assets/images/image-panna-cotta-mobile.jpg",
            "tablet": "./assets/images/image-panna-cotta-tablet.jpg",
            "desktop": "./assets/images/image-panna-cotta-desktop.jpg"
        },
        "name": "Vanilla Panna Cotta",
        "category": "Panna Cotta",
        "price": 6.50
     }*/
