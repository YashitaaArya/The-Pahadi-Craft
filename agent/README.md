Product Import Agent

This agent automates logging into your admin panel and filling the "Add Product" form from an Excel file.

Setup

1. Open a terminal in `agent/` and install dependencies:

```bash
cd agent
npm install
npx playwright install
```

2. Copy `.env.example` to `.env` and set `ADMIN_ORIGIN`, `LOGIN_PATH`, `PRODUCTS_PATH`, `ADD_BUTTON_SELECTOR`, `ADMIN_USER`, `ADMIN_PASS`, and `EXCEL_PATH`. `ADD_PRODUCT_PATH` is optional — only needed if your admin provides a direct URL for the add form instead of a button/modal.

3. Prepare an Excel file (first sheet) with columns matching the form labels, e.g. `Product Name`, `SKU`, `Description`, `Price (₹)`, `Stock`, `Discount (%)`, `Main Category`, `Prime Subcategory`, `Secondary Subcategory`, `Size`, `Volume`, `Weight`, `Scented`, `Mark as Featured`, `Mark as Trending`, `Product Image URLs` (comma-separated).

Notes on product form flow
- If your admin shows the "Add Product" form only after clicking a button on the products list (common in SPA apps), set `PRODUCTS_PATH` to the products list URL and `ADD_BUTTON_SELECTOR` to the CSS/text selector that opens the form (defaults to `button:has-text("Add Product")`). The agent will click that button; if not found it falls back to navigating to `ADD_PRODUCT_PATH`.

Usage

```bash
node agent.js
```

Notes
- The script uses label-based heuristics to find inputs. You may need to customize selectors or update labels in the Excel file for best results.
- Images: provide image URLs in the `Product Image URLs` column; file uploads are not automated yet.
