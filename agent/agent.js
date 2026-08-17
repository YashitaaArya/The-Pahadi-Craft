require('dotenv').config();
const xlsx = require('xlsx');
const { chromium } = require('playwright');

const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || 'http://localhost:5173';
const LOGIN_PATH = process.env.LOGIN_PATH || '/admin/login';
const ADD_PRODUCT_PATH = process.env.ADD_PRODUCT_PATH || '/admin/add-product';
const EXCEL_PATH = process.env.EXCEL_PATH || 'products.xlsx';
const HEADLESS = process.env.HEADLESS !== 'false';

function normalizeKey(k) {
  return k.replace(/\*/g, '').trim();
}

async function guessAndFillLogin(page) {
  // Try common selectors for email/username and password
  const emailSelectors = [
    'input[type="email"]',
    'input[name*="email"]',
    'input[name*="user"]',
    'input#email',
    'input#username'
  ];
  const passSelectors = [
    'input[type="password"]',
    'input[name*="pass"]',
    'input#password'
  ];

  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;
  if (!username || !password) throw new Error('Set ADMIN_USER and ADMIN_PASS in .env');

  for (const s of emailSelectors) {
    if (await page.$(s)) {
      await page.fill(s, username);
      break;
    }
  }
  for (const s of passSelectors) {
    if (await page.$(s)) {
      await page.fill(s, password);
      break;
    }
  }
  // Try clicking a submit button
  const btn = await page.$('button[type="submit"], button:has-text("Login"), input[type="submit"]');
  if (btn) await btn.click();
  else console.warn('Login button not found automatically — you may need to customize selectors.');
  await page.waitForTimeout(1500);
}

async function fillByLabel(page, labelText, value) {
  if (value === undefined || value === null || value === '') return;
  const label = page.locator('label', { hasText: labelText }).first();
  if (await label.count()) {
    const forAttr = await label.getAttribute('for');
    if (forAttr) {
      const target = page.locator('#' + forAttr);
      if (await target.count()) {
        const tag = await target.evaluate(node => node.tagName.toLowerCase());
        if (tag === 'select') {
          await target.selectOption({ label: String(value) }).catch(() => {});
        } else if (tag === 'input') {
          const type = await target.getAttribute('type');
          if (type === 'checkbox') {
            const checked = await target.isChecked();
            if ((String(value).toLowerCase() === 'yes' || String(value) === '1' || String(value).toLowerCase() === 'true') && !checked) await target.check();
            if ((String(value).toLowerCase() === 'no' || String(value) === '0' || String(value).toLowerCase() === 'false') && checked) await target.uncheck();
          } else {
            await target.fill(String(value));
          }
        } else {
          await target.fill(String(value)).catch(() => {});
        }
        return;
      }
    }
    // try next sibling input/textarea/select
    const siblingInput = label.locator('xpath=following-sibling::input | following-sibling::textarea | following-sibling::select');
    if (await siblingInput.count()) {
      await siblingInput.first().fill(String(value)).catch(() => {});
      return;
    }
  }

  // Fallback: try input/select/textarea by name or id
  const key = String(labelText).toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const byName = await page.$(`input[name*="${key}"], textarea[name*="${key}"], select[name*="${key}"]`);
  if (byName) {
    const tag = await byName.evaluate(n => n.tagName.toLowerCase());
    if (tag === 'select') await byName.selectOption({ label: String(value) }).catch(() => {});
    else await byName.fill(String(value)).catch(() => {});
    return;
  }

  // Direct selectors: id or input placeholder
  const byId = await page.$(`#${key}`);
  if (byId) await byId.fill(String(value)).catch(() => {});

  console.warn(`Could not auto-fill field '${labelText}'.`);
}

async function run() {
  const wb = xlsx.readFile(EXCEL_PATH);
  const sheet = wb.SheetNames[0];
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[sheet], { defval: '' });
  if (!rows.length) {
    console.log('No rows found in Excel.');
    return;
  }

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to admin login...');
  await page.goto(ADMIN_ORIGIN + LOGIN_PATH, { waitUntil: 'networkidle' });
  await guessAndFillLogin(page);
  await page.waitForTimeout(1000);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    console.log(`Processing row ${i + 1}/${rows.length}: ${row['Product Name'] || row['Name'] || 'unnamed'}`);
    await page.goto(ADMIN_ORIGIN + ADD_PRODUCT_PATH, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    for (const rawKey of Object.keys(row)) {
      const key = normalizeKey(rawKey);
      const value = row[rawKey];
      await fillByLabel(page, key, value);
    }

    // Handle image URL fields if present
    if (row['Product Image URLs'] || row['Product Image'] || row['Image URLs']) {
      const urls = (row['Product Image URLs'] || row['Product Image'] || row['Image URLs']).toString().split(',').map(s => s.trim()).filter(Boolean);
      for (let j = 0; j < urls.length; j++) {
        const url = urls[j];
        // try to find a field for image URL
        await fillByLabel(page, 'Or paste an image URL instead', url);
      }
    }

    // Try submit
    const submit = await page.$('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
    if (submit) {
      await submit.click();
      console.log('Submitted product (attempt).');
      await page.waitForTimeout(1200);
    } else {
      console.warn('Could not find submit button; product might not have been saved.');
    }
  }

  await browser.close();
  console.log('Done.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
