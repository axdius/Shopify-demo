let tabContainer = document.getElementById('tabConatiner');
let cardsContainerEl = document.getElementById('cardsContainer');

async function fetchShopifyData() {
    let url = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
    const options = {
        method: 'GET'
    }
    const response = await fetch(url, options);
    const shopifyData = await response.json()

    let mensData = shopifyData.categories[0].category_products;
    let womensData = shopifyData.categories[1].category_products;
    let kidsData = shopifyData.categories[2].category_products;

    // Initially, render cards for the default category (e.g., 'Women')
    renderCards('Women', womensData);

    // Add event listeners to tabs
    tabContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('tab')) {
            // Clear existing cards
            cardsContainerEl.innerHTML = '';

            // Highlight the clicked tab
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');

            // Get the category name from the clicked tab
            let category = event.target.textContent.trim();

            // Render cards for the selected category
            switch (category) {
                case 'Men':
                    renderCards('Men', mensData);
                    break;
                case 'Women':
                    renderCards('Women', womensData);
                    break;
                case 'Kids':
                    renderCards('Kids', kidsData);
                    break;
                default:
                    break;
            }
        }
    });

    return shopifyData;
}

function renderCards(category, data) {
    data.forEach(product => {
        let card = document.createElement('div');
        card.id = product.id;
        card.classList.add('card');
        let backgroundImage = product.image;

        let actualPrice = product.compare_at_price;
        let discountedPrice = product.price;

        let discountAmount = actualPrice - discountedPrice;
        let percentageDiscount = (discountAmount / actualPrice) * 100;
        let roundOff = percentageDiscount.toFixed(0);

        // Limit title length to 12 characters
        let truncatedTitle = product.title.length > 12 ? product.title.slice(0, 10) + '..' : product.title;

        // Create a conditional check for badge_text
        let badgeTextParagraph = '';
        if (product.badge_text !== null) {
            badgeTextParagraph = `<p class="text">${product.badge_text}</p>`;
        }

        card.innerHTML = `
            <div class="image-container" style="background-image: url('${backgroundImage}')">
                ${badgeTextParagraph}
            </div>
            <div class="title-container">
                <h1 class="outfit-type">${truncatedTitle}</h1>
                <li class="brand">${product.vendor}</li>
            </div>
            <p class="price-details">Rs. ${product.price} <span class="cut-price">${product.compare_at_price}</span> <span class="discount">${roundOff}% OFF</span></p>
            <button type="button" class="btn btn-dark">Add to Cart</button>
        `;

        cardsContainerEl.appendChild(card);
    });
}

fetchShopifyData();
