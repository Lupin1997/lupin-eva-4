let cartCount = 0;

  // Function to calculate average rating
  function calculateAverageRating(productId) {
      const productReviews = reviews.filter(review => review.productId === productId);
      if (productReviews.length === 0) return 0;
      const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
      return (totalRating / productReviews.length);
  }

  // Function to render product cards
  function renderProducts(products) {
      const container = document.getElementById('product-container');
      container.innerHTML = '';
      products.forEach(product => {
          const averageRating = calculateAverageRating(product.id);
          const productCard = `
              <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                  <img src="${product.images[0]||product.images[1]}" alt="">
                  <h2>${product.title}</h2>
                  <p>${product.description}</p>
                  <p>Price: $${product.price} <s>$${product.strikePrice}</s></p>
                  <p>Available Quantity: ${product.quantity}</p>
                  <p>Category: ${product.category}</p>
                  <p>Average Rating: ${averageRating}</p>
                  <button class="buttonem" onclick="addToCart(${product.id}); event.stopPropagation(); ">Add to Cart</button>
              </div>
          `;
          container.innerHTML += productCard;
      });
  }

  

  // Add to cart functionality
//   function addToCart(productId) {
//       cartCount++;
//       document.getElementById('cart-count').innerText = cartCount;
//       alert(`Product ID ${productId} added to cart!`);
//   }

  // Filter and sort functionality
  document.getElementById('filter-button').addEventListener('click', () => {
      const searchTerm = document.getElementById('search').value.toLowerCase();
      const category = document.getElementById('category-filter').value;
      const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
      const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

      const filteredProducts = productArray.filter(product => {
          const matchesSearch = product.title.toLowerCase().includes(searchTerm);
          const matchesCategory = category ? product.category === category : true;
          const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

          return matchesSearch && matchesCategory && matchesPrice;
      });

      renderProducts(filteredProducts);
  });

  // Sorting functionality
  document.getElementById('sort-by').addEventListener('change', (e) => {
      const sortValue = e.target.value;
      let sortedProducts;

      if (sortValue === 'price-asc') {
          sortedProducts = [...productArray].sort((a, b) => a.price - b.price);
      } else if (sortValue === 'price-desc') {
          sortedProducts = [...productArray].sort((a, b) => b.price - a.price);
      } else if (sortValue === 'name-asc') {
          sortedProducts = [...productArray].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortValue === 'name-desc') {
          sortedProducts = [...productArray].sort((a, b) => b.title.localeCompare(a.title));
      }

      renderProducts(sortedProducts);
  });

  // Initial render of products
  renderProducts(productArray);

//login page functionality
function signup() {
    const email = document.getElementById('signup-email');
    const password = document.getElementById('signup-password');

    if (validateEmail(email.value) && password.value.length >= 6) {
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[email.value]) {
            alert('Email already registered. Please login.');
        } else {
            users[email.value] = password.value;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup successful! Please login.');
        }
    } else {
        alert('Invalid email format or password too short.');
    }
    email.value=''
    password.value=''
}

function login() {
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email.value] === password.value) {
        localStorage.setItem('loggedInUser', email.value);
        alert('Login successful!');
        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password.');
    }
    email.value=''
    password.value=''
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
