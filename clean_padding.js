
const fs = require('fs');

const files = [
    'src/app/about/page.tsx',
    'src/app/careers/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/insights/page.tsx',
    'src/app/memory/page.tsx',
    'src/app/pricing/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/roadmap/page.tsx',
    'src/app/science/page.tsx',
    'src/app/security/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/features/page.tsx',
    'src/app/blog/page.tsx'
];

files.forEach(f => {
    const fullPath = 'd:/Haven-Adv/NuravyaWeb/' + f;
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Remove the custom padding strings correctly
        const pattern = /pt-\[calc\(env\(safe-area-inset-top,0px\)\+6rem\)\] md:pt-\[calc\(env\(safe-area-inset-top,0px\)\+8rem\)\]/g;
        content = content.replace(pattern, '');
        // Also cleanup double spaces resulting from removal
        content = content.replace(/  /g, ' ');
        fs.writeFileSync(fullPath, content);
        console.log('Cleaned ' + f);
    }
});

