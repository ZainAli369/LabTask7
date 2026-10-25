# API Endpoints

## Products

GET /api/health  Check API status

GET /api/products  Get all products

GET /api/products?q=term&category=shells  Search/filter products

GET /api/products/:id  Get product details

## Authentication

POST /api/auth/signup  Create account (firstName, lastName, email, password, optional phone)

POST /api/auth/login  Log in (email, password)

GET /api/auth/me  Get current user (token required)

## Cart

GET /api/cart  View cart (token required)

POST /api/cart/items  Add item (productId, size, optional quantity)

PATCH /api/cart/items/:productId  Update quantity (size, quantity)

DELETE /api/cart/items/:productId?size=M  Remove item

DELETE /api/cart  Empty cart

## Orders

POST /api/orders  Place order using cart and shipping details

GET /api/orders  View all your orders

GET /api/orders/:id  View a specific order
