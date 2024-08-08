document.addEventListener('DOMContentLoaded', () => {
    let products = [];

    // Fetch the product data from the JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));

    // Initialize the cart from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    // Function to display products on the page
    function displayProducts(products) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productDiv);
        });
    }

    // Function to add a product to the cart
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    // Function to remove a product from the cart
    window.removeFromCart = function(productId) {
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }

    // Function to update the cart display
    function updateCartDisplay() {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = '';

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartList.appendChild(cartItemDiv);
        });

        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = total * 0.1; // Assuming a 10% tax rate
        const totalWithTax = total + tax;

        document.getElementById('total').innerText = `
            Subtotal: $${total.toFixed(2)}\n
            Tax: $${tax.toFixed(2)}\n
            Total: $${totalWithTax.toFixed(2)}
        `;
    }
});
