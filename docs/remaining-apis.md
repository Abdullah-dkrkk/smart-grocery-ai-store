# Integration Status — Frontend ↔ Backend

## ✅ Completed (APIs exist + frontend wired)

### All Dashboard Pages Now Use Real APIs

| Frontend Page (src/components/dashboard/pages/) | API Module Used | Backend Routes |
|--------------------------------------------------|----------------|----------------|
| `addresses.tsx` | `addressesApi` | `/customer/addresses` CRUD |
| `payment-methods.tsx` | `paymentMethodsApi` | `/customer/payment-methods` |
| `reviews.tsx` | `reviewsApi.myReviews()` | `/customer/reviews` |
| `my-profile.tsx` | `authApi.updateProfile()` | `PUT /auth/me` |
| `my-orders.tsx` | `ordersApi.history()` | `GET /customer/orders` |
| `orders-received.tsx` | `ordersApi.history()` | `GET /customer/orders` |
| `nutrition-plans.tsx` | `nutritionPlansApi` | `/customer/nutrition-plans` |
| `vendor-add-product.tsx` | `productsApi.createVendorProduct()` | `POST /vendor/products` |
| `vendor-products.tsx` | `productsApi.vendorProducts()` | `GET /vendor/products` |
| `earnings.tsx` | `vendorEarningsApi` | `GET /vendor/earnings` |
| `store-settings.tsx` | `vendorStoreApi` | `/vendor/store` |
| `inventory.tsx` | `vendorInventoryApi` | `/vendor/inventory` |
| `vendor-reviews.tsx` | `vendorReviewsApi` | `/vendor/reviews` |
| `nutritionist-profile.tsx` | `nutritionistProfileApi` | `/nutritionist/profile` |
| `meal-plans.tsx` | `mealPlansApi` | `/nutritionist/meal-plans` CRUD |
| `diet-charts.tsx` | `dietChartsApi` | `/nutritionist/diet-charts` CRUD |
| `appointments.tsx` | `appointmentsApi` | `/nutritionist/appointments` |
| `consultations.tsx` | `consultationsApi` | `/nutritionist/consultations` |
| `articles.tsx` | `articlesApi` | `/nutritionist/articles` CRUD |
| `health-profile.tsx` | `healthApi` | `/user/health-profile` |
| `analytics.tsx` | `adminApi.analytics()` + `adminApi.trends()` | `/admin/analytics`, `/admin/dashboard/trends` |
| `admin-settings.tsx` | `adminApi.settings()` / `adminApi.updateSettings()` | `/admin/settings` |
| `admin-payments.tsx` | `adminApi.payments()` | `/admin/payments` |
| `admin-vendors.tsx` | `adminApi.vendors()` | `/admin/vendors` |
| `admin-nutritionists.tsx` | `adminApi.nutritionists()` | `/admin/nutritionists` |
| `admin-users.tsx` | `adminApi.users()` | `/admin/users` |
| `admin-orders.tsx` | `ordersApi.adminList()` | `/admin/orders` |
| `admin-products.tsx` | `productsApi` (admin methods) | `/admin/products` |
| `discounts.tsx` | Custom hooks via `discountsApi` | `/admin/discounts` |
| `ai-assistant.tsx` | `aiApi.*` | `/customer/ai/*` |
| `wishlist/page.tsx` | `wishlistApi` | `/customer/wishlist` |
| `cart/page.tsx` | `cartApi` + CartContext | `/customer/cart` |
| `checkout/page.tsx` | `ordersApi.checkout()` | `POST /customer/orders/checkout` |

---

## Only Remaining Item

### Auth pages still use raw `fetch()` instead of `authApi`
**Files:** `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`

These pages work correctly but use `fetch()` directly instead of `authApi.login()` / `authApi.registerAndStore()`. This is cosmetic — the API endpoints are the same.

---

## Git Commits

| Commit | Description |
|--------|-------------|
| `26188f8` | Fix navigation issues, wire vendor-add-product, create initial remaining-apis.md |
| *(next)* | Create 15 frontend API modules, wire 30+ dashboard pages to real backends |
