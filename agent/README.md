Product Import Agent

This agent automates logging into your admin panel and filling the "Add Product" form from an Excel file.

Setup

1. Open a terminal in `agent/` and install dependencies:

```bash
cd agent
npm install
npx playwright install
```

2. Copy `.env.example` to `.env` and set `ADMIN_ORIGIN`, `LOGIN_PATH`, `ADD_PRODUCT_PATH`, `ADMIN_USER`, `ADMIN_PASS`, and `EXCEL_PATH`.

3. Prepare an Excel file (first sheet) with columns matching the form labels, e.g. `Product Name`, `SKU`, `Description`, `Price (₹)`, `Stock`, `Discount (%)`, `Main Category`, `Prime Subcategory`, `Secondary Subcategory`, `Size`, `Volume`, `Capacity`, `Scented`, `Mark as Featured`, `Mark as Trending`, `Product Image URLs` (comma-separated).

Usage

```bash
node agent.js
```

Notes
- The script uses label-based heuristics to find inputs. You may need to customize selectors or update labels in the Excel file for best results.
- Images: provide image URLs in the `Product Image URLs` column; file uploads are not automated yet.
