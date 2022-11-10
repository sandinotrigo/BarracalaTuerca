const herramientas = []
const cartProducts = [] 

//card

const loadProducts = (herramientas) => {
    let container = document.querySelector("#shop-content");
    for (const product of herramientas) {
        let div = document.createElement("div");
        div.setAttribute("class", "product-box");
        div.innerHTML = `
            <img src="${product.image}" alt="${product.description}" class="product-img">
            <h2 class="product-title">${product.name}</h2>
            <span class="price">$${product.price}</span>
            <i class='bx bx-cart add-cart'></i>
        `;
        container.appendChild(div);
    }
    loadCart();
}

const loadCart = () => { 
    let products = JSON.parse(localStorage.getItem('products'));

    for (let i = 0; i < products.length; i++) {
        let cartItems = document.getElementsByClassName('cart-content')[0];
        let cartShopBox = document.createElement("div");
        cartShopBox.classList.add("cart-box");
        let cartBoxContent =
            `
                            
                              <img src="${products[i].image}" alt="" class="cart-img">
                                <div class="detail-box">
                                <div class="cart-product-title">${products[i].name}</div>
                                  <div class="cart-price">${products[i].price}</div>
                                  <input type="number" value="1" class="cart-quantity">
                                </div>
                                <!--Remove cart-->
                                <i class='bx bxs-trash-alt cart-remove'></i>
                            `;
        cartShopBox.innerHTML = cartBoxContent
        cartItems.append(cartShopBox)
        cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener("change", removeCartItem);
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener("change", quantityChanged);
    }
};

//TRAIGO EL ARRAY DE PRODUCTOS
const getData = async () => {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        loadProducts(data);
        herramientas.push(...data);
    }
    catch (e) {
        console.log(e);
    }
}
getData()

// Carrito 

let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

//Abrimos y mostramos el carrito
cartIcon.onclick = () => {
    cart.classList.add("active");
};

//Cerramos y ocultamos el carrito
closeCart.onclick = () => {
    cart.classList.remove("active");
};


// Cart working JS
if (document.readyState == "loading") {
    document.addEventListener("click", ready);
} else {
    ready();
};

//Function
function ready() {
    //borrar productos del carrito de compras
    let removeCartButtons = document.getElementsByClassName("cart-remove")
    console.log(removeCartButtons)
    for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i]
        button.addEventListener("click", removeCartItem)
    }
    // Cantidad de herramientas a comprar
    let quantityInputs = document.getElementsByClassName("cart-quantity")
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]
        input.addEventListener("change", quantityChanged);
    }
    // Se agrega al carrito de compras...
    let addCart = document.getElementsByClassName("add-cart")
    for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    
    //Boton comprar 
    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buyButtonClicked);

};

//Comprar Botón 
function buyButtonClicked() {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Su pedido se ha realizado con éxito.',
        showConfirmButton: false,
        timer: 2000
    });
    let cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updatetotal();

};

//Eliminar productos del carrito de compras

function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updatetotal();
};

//Cantidad
function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updatetotal();
};

//Agregar productos al carrito
function addCartClicked(event) {
    let button = event.target
    let shopProducts = button.parentElement
    let title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    let price = shopProducts.getElementsByClassName("price")[0].innerText;
    let productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updatetotal();
};

//Función para que no se dupliquen los elementos en el carrito
function addProductToCart(title, price, productImg) {
    let cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    let cartItems = document.getElementsByClassName("cart-content")[0];
    let cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    let flag = 0;
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ya existe el producto en el carrito. Puede agregar más unidades dentro del mismo.',
                showConfirmButton: false,
                timer: 2000
            });
            flag = 1;
            return;
        }
    }
    if (flag == 0) {
        //Sweet Alert 2 - Alerta para informar que se ha agregado al carrito.
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha agregado al carrito.',
            showConfirmButton: false,
            timer: 1500
        })
    }
    let cartBoxContent =
        `
                          <img src="${productImg}" alt="" class="cart-img">
                            <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                              <div class="cart-price">${price}</div>
                              <input type="number" value="1" class="cart-quantity">
                            </div>
                            <!--Remove cart-->
                            <i class='bx bxs-trash-alt cart-remove'></i>
                        `;
    cartShopBox.innerHTML = cartBoxContent
    cartItems.append(cartShopBox)
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener("change", removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener("change", quantityChanged);

    let products = { 'name': title, 'price': price, 'image': productImg }; 

    cartProducts.push(products); 
};

//Actualizo el total

function updatetotal() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    let cartBoxes = cartContent.getElementsByClassName("cart-box");
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i]
        let priceElement = cartBox.getElementsByClassName("cart-price")[0];
        let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = quantityElement.value;
        total = total + (price * quantity);
    }

    document.getElementsByClassName("total-price")[0].innerText = "$" + total;

    const saveLocal = (clave, valor) => { 
        localStorage.setItem(clave, valor)
    };
    
    saveLocal('products', JSON.stringify(cartProducts));  

};