const fs = require('fs');
const path = require('path');

const files = [
    "src/app/about/page.tsx",
    "src/app/features/page.tsx",
    "src/components/layout/footer.tsx",
    "src/app/careers/page.tsx",
    "src/app/api/waitlist/route.ts",
    "src/components/sections/faq.tsx",
    "src/components/layout/navbar.tsx",
    "src/app/blog/page.tsx",
    "src/components/sections/hero.tsx",
    "src/app/layout.tsx",
    "src/app/science/page.tsx",
    "src/components/sections/pricing.tsx",
    "src/app/privacy/page.tsx",
    "src/app/pricing/page.tsx",
    "src/app/roadmap/page.tsx",
    "src/app/terms/page.tsx",
    "src/components/sections/problem.tsx",
    "src/components/sections/solution.tsx",
    "src/components/sections/testimonials.tsx",
    "src/components/sections/trust.tsx",
    "src/components/sections/use-cases.tsx",
    "src/components/sections/waitlist.tsx",
    "src/app/contact/page.tsx",
    "package.json"
];

for (const relPath of files) {
    const f = path.join("d:/Haven-Adv/haven-ui", relPath);
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/Haven/g, 'Nuravya');
        content = content.replace(/haven/g, 'nuravya');
        fs.writeFileSync(f, content);
        console.log(`Updated ${relPath}`);
    } else {
        console.log(`File not found: ${relPath}`);
    }
}
