
const fs = require('fs');
const { execSync } = require('child_process');

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
    'src/app/features/page.tsx'
];

files.forEach(f => {
    const fullPath = 'd:/Haven-Adv/NuravyaWeb/' + f;
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace various patterns with the new calc-based robust padding
        content = content.replace(/pt-safe md:pt-28/g, 'pt-[calc(env(safe-area-inset-top,0px)+6rem)] md:pt-[calc(env(safe-area-inset-top,0px)+8rem)]');
        content = content.replace(/pt-safe md:pt-24/g, 'pt-[calc(env(safe-area-inset-top,0px)+6rem)] md:pt-[calc(env(safe-area-inset-top,0px)+8rem)]');
        content = content.replace(/pt-32/g, 'pt-[calc(env(safe-area-inset-top,0px)+6rem)] md:pt-[calc(env(safe-area-inset-top,0px)+8rem)]');
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + f);
    } else {
        console.log('Skipped ' + f + ' (not found)');
    }
});

