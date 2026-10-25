# NYX Store API

Express REST API added alongside the original HTML/CSS/JavaScript storefront. Data is stored persistently in `data/store.json` (created automatically on first run).

## Run locally

Requirements: Node.js 18+

```bash
npm install
```

Set a private JWT secret before running, then start the server:

```bash
# macOS/Linux
JWT_SECRET="replace-with-a-long-random-secret" npm start

# PowerShell
$env:JWT_SECRET="replace-with-a-long-random-secret"; npm start
```

Open http://localhost:3000. The existing static pages are served by Express, and the API is available at `/api`.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| GET | `/api/products` | No | List products; optional `?q=term` and `?category=shells` |
| GET | `/api/products/:id` | No | Product details |
| POST | `/api/auth/signup` | No | Create account; JSON: `firstName`, `lastName`, `email`, `password`, optional `phone` |
| POST | `/api/auth/login` | No | Log in; JSON: `email`, `password` |
| GET | `/api/auth/me` | Bearer token | Current user |
| GET | `/api/cart` | Bearer token | Current user's cart |
| POST | `/api/cart/items` | Bearer token | Add item; JSON: `productId`, `size`, optional `quantity` |
| PATCH | `/api/cart/items/:productId` | Bearer token | Change quantity; JSON: `size`, `quantity` |
| DELETE | `/api/cart/items/:productId?size=M` | Bearer token | Remove a product/size from cart |
| DELETE | `/api/cart` | Bearer token | Empty cart |
| POST | `/api/orders` | Bearer token | Create order from cart and shipping details |
| GET | `/api/orders` | Bearer token | List current user's orders |
| GET | `/api/orders/:id` | Bearer token | Get one of the current user's orders |

For protected routes, send `Authorization: Bearer <token>` using the token returned from signup/login. Send JSON bodies with `Content-Type: application/json`.

## Example requests

```bash
curl http://localhost:3000/api/products

curl -X POST http://localhost:3000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"example-pass-123"}'

curl -X POST http://localhost:3000/api/cart/items \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{"productId":"nebula-bomber","size":"M","quantity":1}'
```

## Important notes

- This adds a working API, but the existing HTML forms have not yet been converted to call it; that frontend integration is a separate step.
- The initial product list is seeded from products shown in the original pages, with sample stock counts. Review `seedProducts` in `server.js` before using real inventory.
- JSON-file storage is suitable for a local demo, not concurrent production traffic. Use a database such as PostgreSQL for deployment.
- Orders are recorded with `pending_payment`; no payment gateway is connected. Do not treat this as a production checkout system.
- Use HTTPS, a strong private `JWT_SECRET`, rate limiting, and appropriate security headers before public deployment. Never commit real secrets.
