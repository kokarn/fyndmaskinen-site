import fs from 'fs';
import path from 'path';

const v2Root = path.resolve(__dirname, '..');
const themePath = path.resolve(__dirname, 'theme.js');

const collectJavaScriptFiles = (directory) => {
    return fs.readdirSync(directory, {
        withFileTypes: true,
    }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            return collectJavaScriptFiles(entryPath);
        }

        return entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')
            ? [ entryPath ]
            : [];
    });
};

describe('V2 design-system contract', () => {
    it('keeps raw color values in the theme source of truth', () => {
        const offenders = collectJavaScriptFiles(v2Root)
            .filter((filePath) => filePath !== themePath)
            .filter((filePath) => /#[0-9a-f]{3,8}|rgba?\(/iu.test(fs.readFileSync(filePath, 'utf8')))
            .map((filePath) => path.relative(v2Root, filePath));

        expect(offenders).toEqual([]);
    });

    it('uses explicit surface tokens instead of derived palette shades', () => {
        const offenders = collectJavaScriptFiles(v2Root)
            .filter((filePath) => filePath !== themePath)
            .filter((filePath) => fs.readFileSync(filePath, 'utf8').includes('secondary.light'))
            .map((filePath) => path.relative(v2Root, filePath));

        expect(offenders).toEqual([]);
    });

    it('defines compact listing density in the design system', () => {
        const themeSource = fs.readFileSync(themePath, 'utf8');
        const cardSource = fs.readFileSync(path.resolve(__dirname, 'ResultCard.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(v2Root, 'pages', 'SearchResults.js'), 'utf8');

        expect(themeSource).toContain('resultCard:');
        expect(cardSource).toContain('resultCard.imageHeight');
        expect(resultsSource).toContain('lg = {3}');
    });

    it('uses a mobile list and a shared loading indicator', () => {
        const cardSource = fs.readFileSync(path.resolve(__dirname, 'ResultCard.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(v2Root, 'pages', 'SearchResults.js'), 'utf8');

        expect(cardSource).toContain("xs: 'row'");
        expect(resultsSource).toContain('xs = {12}');
        expect(resultsSource).toContain('<SearchLoading />');
    });

    it('showcases every reusable design-system component', () => {
        const showcase = fs.readFileSync(path.join(v2Root, 'pages', 'DesignSystem.js'), 'utf8');
        const components = fs.readdirSync(path.resolve(__dirname))
            .filter((name) => name.endsWith('.js'))
            .filter((name) => !name.endsWith('.test.js'))
            .filter((name) => ![
                'DesignSection.js',
                'DesignSwatch.js',
                'theme.js',
            ].includes(name))
            .map((name) => path.basename(name, '.js'));
        const missingComponents = components.filter((component) => {
            return !showcase.includes(`<${component}`);
        });

        expect(missingComponents).toEqual([]);
    });
});
