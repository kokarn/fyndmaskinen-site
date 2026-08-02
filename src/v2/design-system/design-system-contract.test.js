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

    it('uses marketplace icons consistently in shared source marks and filters', () => {
        const sourceMarkSource = fs.readFileSync(path.resolve(__dirname, 'SourceMark.js'), 'utf8');
        const filterSource = fs.readFileSync(path.resolve(__dirname, 'FilterPanel.js'), 'utf8');

        expect(sourceMarkSource).toContain("tradera: '/images/icons/tradera-40x40.png'");
        expect(sourceMarkSource).toContain("blocket: '/images/icons/blocket.png'");
        expect(sourceMarkSource).not.toContain('label.charAt(0)');
        expect(filterSource).toContain('<SourceMark');
        expect(filterSource).toContain('sourceId = {source.id}');
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
        expect(filterSource).toContain("applyLabel: 'Visa resultat'");
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

    it('uses Auth0 v2 token options when saving and reading watches', () => {
        const saveSource = fs.readFileSync(path.resolve(__dirname, 'SaveSearchButton.js'), 'utf8');
        const profileSource = fs.readFileSync(path.join(v2Root, 'pages', 'Profile.js'), 'utf8');

        expect(saveSource).toContain('authorizationParams: AUTH_OPTIONS');
        expect(saveSource).toContain('payload.errors');
        expect(profileSource).toContain('authorizationParams: AUTH_OPTIONS');
        expect(profileSource).toContain("textAlign = 'center'");
        expect(profileSource).toContain("'&:last-child': {");
    });

    it('keeps admin cards responsive and count failures non-fatal', () => {
        const adminSource = fs.readFileSync(path.join(v2Root, 'pages', 'Admin.js'), 'utf8');
        const featureCardSource = fs.readFileSync(path.resolve(__dirname, 'FeatureLinkCard.js'), 'utf8');

        expect(adminSource).toContain("display: 'grid'");
        expect(adminSource).toContain("gridTemplateColumns: {");
        expect(adminSource).not.toContain('<Grid');
        expect(adminSource).toContain('data: itemCounts = []');
        expect(adminSource).toContain('isError');
        expect(adminSource).toContain('AUTH_OPTIONS');
        expect(adminSource).toContain('authorizationParams');
        expect(featureCardSource).toContain("xs: 'row'");
    });

    it('keeps the shared header within narrow mobile viewports', () => {
        const shellSource = fs.readFileSync(path.resolve(__dirname, 'AppShell.js'), 'utf8');
        const accountSource = fs.readFileSync(path.resolve(__dirname, 'AccountActions.js'), 'utf8');
        const bellSource = fs.readFileSync(path.resolve(__dirname, 'NotificationBell.js'), 'utf8');
        const brandSource = fs.readFileSync(path.resolve(__dirname, 'Brand.js'), 'utf8');

        expect(shellSource).toContain("overflowX: 'hidden'");
        expect(shellSource).toContain('minWidth: 0');
        expect(accountSource).toContain("aria-label = 'Bevakningar'");
        expect(accountSource).toContain("aria-label = 'Admin'");
        expect(accountSource).toContain('<NotificationBell />');
        expect(bellSource).toContain("aria-label = 'Notiser'");
        expect(brandSource).toContain("xs: 'none'");
        expect(brandSource).toContain("src = '/logo192.png'");
        expect(brandSource).not.toContain('DoneIcon');
    });

    it('keeps mobile result actions together and exposes filters on the landing page', () => {
        const homeSource = fs.readFileSync(path.join(v2Root, 'pages', 'Home.js'), 'utf8');
        const heroSource = fs.readFileSync(path.resolve(__dirname, 'LandingHero.js'), 'utf8');
        const searchSource = fs.readFileSync(path.resolve(__dirname, 'SearchBox.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(v2Root, 'pages', 'SearchResults.js'), 'utf8');

        expect(homeSource).toContain('<FilterDrawer');
        expect(homeSource).toContain("applyLabel = 'Spara filter'");
        expect(homeSource).toContain('mobileAction = {mobileFilterAction}');
        expect(homeSource).toContain('getAuctionHouseCount');
        expect(homeSource).toContain('<LandingCoverage');
        expect(heroSource).toContain('mobileAction = {mobileAction}');
        expect(searchSource).toContain('gridTemplateAreas: {');
        expect(searchSource).toContain("xs: '\"input input\" \"search action\"'");
        expect(searchSource).toContain('gridArea: \'action\'');
        expect(resultsSource).toContain("direction = 'row'");
        expect(resultsSource).toContain('flex: 1');
        expect(resultsSource).toContain('<FilterDrawer');
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
