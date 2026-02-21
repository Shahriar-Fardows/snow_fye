const fs = require('fs');
const glob = require('glob');

// We use glob to find all jsx/js files in src
glob("src/**/*.jsx", (err, files) => {
  if (err) throw err;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Ensure `currency: "BDT"`
    // Many places use `currency: "BDT"` or `currency: product.currency || "BDT"` or `currency: data.currency || "BDT"`
    // We want to force `currency: "BDT"`
    if (content.match(/currency:\s*(?:".*?"|product\.currency\s*\|\|\s*".*?"|data\.currency\s*\|\|\s*".*?")[^\n,]*/g)) {
      content = content.replace(/currency:\s*(?:".*?"|product\.currency\s*\|\|\s*".*?"|data\.currency\s*\|\|\s*".*?")[^\n,]*/g, 'currency: "BDT"');
      changed = true;
    }

    // 2. Add coupon
    // Only in ecommerce block. If ecommerce block doesn't have coupon, add it.
    // We check if "ecommerce: {" exists and try to add coupon unless it's check-out where it might have one.
    if (!file.includes('check-out/page.jsx')) {
      if (content.includes('ecommerce: {') && !content.includes('coupon:')) {
        content = content.replace(/ecommerce:\s*\{/g, 'ecommerce: {\n              coupon: "",');
        changed = true;
      }
    }

    // 3. Add category inside items.
    // Replace `item_name: ` with `item_name: ..., \n item_category: product.category || item.category || "Uncategorized",`
    // Be careful, sometimes it's `data.title` etc.
    // Looking for `item_name: [^,]+,`
    if (content.match(/item_name:\s*([^,]+),/g)) {
        content = content.replace(/(item_name:\s*([^,]+),)(?!\s*item_category)/g, '$1\n                  item_category: "Uncategorized", // We default to Uncategorized as category needs to be fetched from product');
        changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  });
});
