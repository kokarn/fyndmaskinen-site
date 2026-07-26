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

    it('keeps mobile search feedback stable and actionable', () => {
        const cardSource = fs.readFileSync(path.resolve(__dirname, 'ResultCard.js'), 'utf8');
        const filterSource = fs.readFileSync(path.resolve(__dirname, 'FilterPanel.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(v2Root, 'pages', 'SearchResults.js'), 'utf8');

        expect(resultsSource).toContain("isFetching\n                                ? 'Söker efter fynd…'");
        expect(filterSource).toContain("{'Visa resultat'}");
        expect(cardSource).toContain("justifyContent: 'space-between'");
    });

    it('exposes real account and saved-search actions in V2', () => {
        const shellSource = fs.readFileSync(path.resolve(__dirname, 'AppShell.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(v2Root, 'pages', 'SearchResults.js'), 'utf8');

        expect(shellSource).toContain('<AccountActions />');
        expect(resultsSource).toContain('<SaveSearchButton');
    });

    it('keeps profile and admin navigation inside the V2 experience', () => {
        const appSource = fs.readFileSync(path.resolve(v2Root, '..', 'App.js'), 'utf8');
        const accountSource = fs.readFileSync(path.resolve(__dirname, 'AccountActions.js'), 'utf8');

        expect(appSource).toContain("path = '/profile'");
        expect(appSource).toContain('<V2Profile />');
        expect(appSource).toContain("path = '/admin'");
        expect(appSource).toContain('<V2Admin />');
        expect(accountSource).toContain("to = '/admin'");
    });

    it('keeps every admin tool destination inside the V2 experience', () => {
        const appSource = fs.readFileSync(path.resolve(v2Root, '..', 'App.js'), 'utf8');
        const adminSource = fs.readFileSync(path.join(v2Root, 'pages', 'Admin.js'), 'utf8');

        expect(appSource).toContain("path = '/deals/isbn'");
        expect(appSource).toContain('<V2IsbnDeals />');
        expect(appSource).toContain("path = '/deals'");
        expect(appSource).toContain('<V2Deals />');
        expect(appSource).toContain("path = '/barcode'");
        expect(appSource).toContain('<V2Barcode />');
        expect(appSource).toContain("path = '/barcode/quagga'");
        expect(appSource).toContain("path = '/barcode/zxing'");
        expect(adminSource).toContain('<FeatureLinkCard');
        expect(adminSource).toContain('<StatisticCard');
    });

    it('keeps the shared header within narrow mobile viewports', () => {
        const shellSource = fs.readFileSync(path.resolve(__dirname, 'AppShell.js'), 'utf8');
        const accountSource = fs.readFileSync(path.resolve(__dirname, 'AccountActions.js'), 'utf8');
        const brandSource = fs.readFileSync(path.resolve(__dirname, 'Brand.js'), 'utf8');

        expect(shellSource).toContain("overflowX: 'hidden'");
        expect(shellSource).toContain('minWidth: 0');
        expect(accountSource).toContain("xs: 'none'");
        expect(accountSource).toContain("aria-label = 'Bevakningar'");
        expect(brandSource).toContain("xs: 'none'");
    });

    it('showcases every reusable design-system component', () => {
        const showcase = fs.readFileSync(path.join(v2Root, 'pages', 'DesignSystem.js'), 'utf8');
        const components = fs.readdirSync(path.resolve(__dirname))
            .filter((name) => name.endsWith('.js'))
            .filter((name) => !name.endsWith('.test.js'))
            .filter((name) => ![
                'AccountPageShell.js',
                'DesignSection.js',
                'DesignSwatch.js',
                'theme.js',
                'ToolPageShell.js',
            ].includes(name))
            .map((name) => path.basename(name, '.js'));
        const missingComponents = components.filter((component) => {
            return !showcase.includes(`<${component}`);
        });

        expect(missingComponents).toEqual([]);
    });
});
