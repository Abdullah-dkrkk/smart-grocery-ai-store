# Remaining Laravel API Endpoints Needed

## Overview
This document lists all backend API endpoints that are required for the frontend but have not yet been created in the Laravel backend. Each section corresponds to a specific page/component in the frontend that currently uses mock data.

---

## 1. Customer Addresses
**Frontend file:** `src/components/dashboard/pages/addresses.tsx`
**CRUD endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/addresses` | List all saved addresses |
| POST | `/customer/addresses` | Create a new address |
| GET | `/customer/addresses/{id}` | Get address detail |
| PUT | `/customer/addresses/{id}` | Update an address |
| DELETE | `/customer/addresses/{id}` | Delete an address |
| PUT | `/customer/addresses/{id}/default` | Set as default address |

**Frontend UI:** Manage addresses with add/edit/delete and default toggle.

---

## 2. Customer Payment Methods
**Frontend file:** `src/components/dashboard/pages/payment-methods.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/payment-methods` | List saved payment methods |
| POST | `/customer/payment-methods` | Add a new payment method |
| DELETE | `/customer/payment-methods/{id}` | Remove a payment method |
| PUT | `/customer/payment-methods/{id}/default` | Set as default |

**Frontend UI:** Manage credit/debit cards with add/remove and default.

---

## 3. Customer Reviews
**Frontend file:** `src/components/dashboard/pages/reviews.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/reviews` | List all reviews by authenticated user |
| POST | `/customer/reviews` | Submit a new review (product_id, rating, comment) |
| PUT | `/customer/reviews/{id}` | Update a review |
| DELETE | `/customer/reviews/{id}` | Delete a review |

**Frontend UI:** List of reviews given by the customer with edit/delete.

---

## 4. User Profile
**Frontend file:** `src/components/dashboard/pages/my-profile.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/user/profile` | Update name, email, phone, avatar |
| POST | `/user/profile/avatar` | Upload profile picture |
| PUT | `/user/profile/password` | Change password (current_password, new_password) |

**Frontend UI:** Edit personal info, upload avatar, change password.

---

## 5. Vendor Earnings
**Frontend file:** `src/components/dashboard/pages/earnings.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendor/earnings` | Overview stats (total_revenue, this_month, pending_payouts, avg_order_value) |
| GET | `/vendor/earnings/transactions` | Paginated list of transactions |
| GET | `/vendor/earnings/trend` | Chart data (labels + amounts) |
| POST | `/vendor/earnings/withdraw` | Request withdrawal |

**Frontend UI:** Revenue cards, transaction table, trend chart.

---

## 6. Vendor Reviews
**Frontend file:** `src/components/dashboard/pages/vendor-reviews.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendor/reviews` | List reviews for vendor's products |
| POST | `/vendor/reviews/{id}/reply` | Reply to a customer review |

**Frontend UI:** List of product reviews with reply capability.

---

## 7. Vendor Store Settings
**Frontend file:** `src/components/dashboard/pages/store-settings.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendor/store-settings` | Get store settings |
| PUT | `/vendor/store-settings` | Update store name, description, logo, banner, policy |
| POST | `/vendor/store-settings/logo` | Upload store logo |
| POST | `/vendor/store-settings/banner` | Upload store banner |

**Frontend UI:** Store profile form with image uploads.

---

## 8. Vendor Inventory
**Frontend file:** `src/components/dashboard/pages/inventory.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendor/products` | List vendor products with stock info (already partly exists) |
| PUT | `/vendor/products/{id}/stock` | Update stock_quantity for a product |
| GET | `/vendor/inventory/alerts` | Low stock alerts |

**Frontend UI:** Stock management table with quantity updates.

---

## 9. Nutritionist Profile
**Frontend file:** `src/components/dashboard/pages/nutritionist-profile.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nutritionist/profile` | Get nutritionist professional profile |
| PUT | `/nutritionist/profile` | Update certifications, specialties, experience, bio, consultation_fee |
| POST | `/nutritionist/profile/avatar` | Upload profile image |

**Frontend UI:** Professional profile form with image upload.

---

## 10. Meal Plans (Nutritionist)
**Frontend file:** `src/components/dashboard/pages/meal-plans.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nutritionist/meal-plans` | List all meal plans |
| POST | `/nutritionist/meal-plans` | Create a meal plan |
| GET | `/nutritionist/meal-plans/{id}` | Get meal plan detail |
| PUT | `/nutritionist/meal-plans/{id}` | Update a meal plan |
| DELETE | `/nutritionist/meal-plans/{id}` | Delete a meal plan |
| POST | `/nutritionist/meal-plans/{id}/assign` | Assign meal plan to client(s) |

**Frontend UI:** Create/edit meal plans with meals assigned to clients.

---

## 11. Diet Charts (Nutritionist)
**Frontend file:** `src/components/dashboard/pages/diet-charts.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nutritionist/diet-charts` | List all diet charts |
| POST | `/nutritionist/diet-charts` | Create a diet chart |
| GET | `/nutritionist/diet-charts/{id}` | Get diet chart detail |
| PUT | `/nutritionist/diet-charts/{id}` | Update a diet chart |
| DELETE | `/nutritionist/diet-charts/{id}` | Delete a diet chart |

**Frontend UI:** Diet chart management with client assignments.

---

## 12. Appointments (Nutritionist / Customer)
**Frontend files:**
- `src/components/dashboard/pages/appointments.tsx` (nutritionist)
- Customer-side appointment viewing

**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nutritionist/appointments` | List appointments for nutritionist |
| PUT | `/nutritionist/appointments/{id}/status` | Approve/reject/complete appointment |
| GET | `/customer/appointments` | List customer's appointments |
| POST | `/customer/appointments` | Book an appointment with a nutritionist |
| DELETE | `/customer/appointments/{id}` | Cancel an appointment |

**Frontend UI:** Calendar/list view with booking and status management.

---

## 13. Consultations (Nutritionist / Customer)
**Frontend files:**
- `src/components/dashboard/pages/consultations.tsx` (nutritionist)
- Customer-side consultation history

**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nutritionist/consultations` | List consultations |
| POST | `/nutritionist/consultations` | Add consultation notes |
| GET | `/customer/consultations` | List customer consultations |
| POST | `/customer/consultations` | Request a consultation |

**Frontend UI:** Consultation records with notes and follow-ups.

---

## 14. Articles (Nutritionist)
**Frontend file:** `src/components/dashboard/pages/articles.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nutritionist/articles` | List articles |
| POST | `/nutritionist/articles` | Create an article |
| GET | `/nutritionist/articles/{id}` | Get article detail |
| PUT | `/nutritionist/articles/{id}` | Update an article |
| DELETE | `/nutritionist/articles/{id}` | Delete an article |
| POST | `/nutritionist/articles/{id}/image` | Upload article cover image |

**Frontend UI:** Article CRUD with rich text editor and images.

---

## 15. Nutrition Plans (Customer)
**Frontend file:** `src/components/dashboard/pages/nutrition-plans.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/nutrition-plans` | List nutrition plans assigned to customer |
| GET | `/customer/nutrition-plans/{id}` | Get plan detail with daily meals |

**Frontend UI:** View assigned nutrition/diet plans with daily meal breakdown.

---

## 16. Customer Dashboard Overview
**Frontend file:** `src/components/dashboard/pages/customer-overview.tsx`
**Endpoints needed:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/customer/dashboard/overview` | ✅ Already in `dashboardApi.customerOverview()` |

**Note:** The `dashboardApi.customerOverview()` function already exists in `src/lib/api/dashboard.ts:82`. Ensure the Laravel route is implemented.

---

## 17. Admin Payments
**Frontend file:** `src/components/dashboard/pages/admin-payments.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/payments` | List all payments/transactions |
| GET | `/admin/payments/{id}` | Payment detail |
| PUT | `/admin/payments/{id}/status` | Update payment status |

**Frontend UI:** Payment management table with status updates.

---

## 18. Admin Audit Log
**Frontend file:** `src/components/dashboard/pages/audit-log.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/audit-log` | Paginated list of audit log entries |
| GET | `/admin/audit-log/export` | Export audit log as CSV |

**Frontend UI:** Searchable/filterable audit log table.

---

## 19. Admin System Settings
**Frontend file:** `src/components/dashboard/pages/admin-settings.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/settings` | Get all system settings |
| PUT | `/admin/settings` | Update system settings (site_name, description, contact_email, etc.) |

**Frontend UI:** Settings form with multiple sections (general, security, notifications).

---

## 20. Admin Vendors
**Frontend file:** `src/components/dashboard/pages/admin-vendors.tsx`
**Endpoints needed:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/admin/vendors` | List vendors (maybe exists as `/admin/users?role=vendor`) |
| PUT | `/admin/vendors/{id}/approve` | Approve/reject vendor |
| PUT | `/admin/vendors/{id}/status` | Suspend/activate vendor |

---

## 21. Admin Users
**Frontend file:** `src/components/dashboard/pages/admin-users.tsx`
**Endpoints needed:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/admin/users` | ✅ Already in `adminApi.users()` |
| GET | `/admin/users/{id}` | ✅ Already in `adminApi.user()` |
| PUT | `/admin/users/{id}` | Update user (role, status) |
| DELETE | `/admin/users/{id}` | Delete user |

---

## 22. Admin Nutritionists
**Frontend file:** `src/components/dashboard/pages/admin-nutritionists.tsx`
**Endpoints needed:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/nutritionists` | List nutritionists |
| PUT | `/admin/nutritionists/{id}/approve` | Approve/reject nutritionist |
| PUT | `/admin/nutritionists/{id}/status` | Suspend/activate |

---

## 23. Admin Orders
**Frontend file:** `src/components/dashboard/pages/admin-orders.tsx`
**Endpoints needed:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/admin/orders` | ✅ Already in `ordersApi.adminList()` |
| GET | `/admin/orders/{id}` | ✅ Already in `ordersApi.adminDetail()` |
| PUT | `/admin/orders/{id}/status` | ✅ Already in `ordersApi.updateStatus()` |

**Note:** These API functions already exist — ensure Laravel routes are implemented.

---

## 24. Admin Products
**Frontend file:** `src/components/dashboard/pages/admin-products.tsx`
**Endpoints needed:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/admin/products` | May exist |
| POST | `/admin/products` | ✅ Already in `productsApi.create()` |
| PUT | `/admin/products/{id}` | ✅ Already in `productsApi.update()` |
| DELETE | `/admin/products/{id}` | ✅ Already in `productsApi.delete()` |
| POST | `/admin/products/bulk-update` | ✅ Already in `productsApi.bulkUpdate()` |

---

## 25. Static / Informational Pages
**Missing pages linked from header/footer that return 404:**
| Route | Page Component | Status |
|-------|---------------|--------|
| `/about` | About us | ❌ Needs page |
| `/contact` | Contact form | ❌ Needs page |
| `/blog` | Blog list | ❌ Needs page |
| `/privacy` | Privacy policy | ❌ Needs page |
| `/terms` | Terms & conditions | ❌ Needs page |
| `/faq` | FAQ / Help | ❌ Needs page |
| `/support` | Support | ❌ Redirect to /contact or /faq |
| `/delivery` | Delivery info | ❌ Needs page |

---

## 26. Auth Pages
**Frontend files:** `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`

**Issue:** Both pages use raw `fetch()` for API calls instead of `authApi.login()` and `authApi.registerAndStore()`. These should be migrated for consistency, but aren't blocking functionality.

---

## Frontend Files Already Using Real APIs (for reference)

| File | API Used | Status |
|------|----------|--------|
| `health-profile.tsx` | `healthApi.getProfile()` + `healthApi.updateProfile()` | ✅ Wired |
| `my-orders.tsx` | `ordersApi.history()` | ✅ Wired |
| `vendor-add-product.tsx` | `productsApi.createVendorProduct()` | ✅ Wired (fixed during audit) |
| `ai-assistant.tsx` | `aiApi.*` | ✅ Wired |
| `dashboard.tsx` (main) | `dashboardApi.*` via props | ✅ Wired |
| `header.tsx` | Uses Cart context | ✅ Fixed (category links, My Account) |

---

## Summary of Frontend Issues Fixed During This Audit

1. **Category links** — `/category/` → `/categories/` in header dropdown + category-showcase
2. **My Account** — `/my-account` → `/dashboard?role=user`
3. **Hardcoded cartCount** — Removed `cartCount` prop from Header + all 11 consumer pages
4. **Announcement bars** — Extracted to shared `src/lib/constants.ts`
5. **Mega menu** — `href="#"` changed to `<span>` to avoid scroll-to-top
6. **Vendor Add Product** — Wired to `productsApi.createVendorProduct()`, removed setTimeout mock
