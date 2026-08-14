/* eslint-env node, jest */
/* eslint-disable no-sync, no-template-curly-in-string, no-magic-numbers, prefer-named-capture-group */
import fs from 'fs';
import path from 'path';

const designRoot = __dirname;
const srcRoot = path.resolve(__dirname, '..');
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

describe('Design-system contract', () => {
    it('keeps raw color values in the theme source of truth', () => {
        const offenders = collectJavaScriptFiles(designRoot)
            .filter((filePath) => {
                return filePath !== themePath;
            })
            .filter((filePath) => {
                return /#[0-9a-f]{3,8}|rgba?\(/iu.test(fs.readFileSync(filePath, 'utf8'));
            })
            .map((filePath) => {
                return path.relative(designRoot, filePath);
            });

        expect(offenders).toEqual([]);
    });

    it('uses marketplace icons consistently in shared source marks and filters', () => {
        const sourceMarkSource = fs.readFileSync(path.resolve(__dirname, 'SourceMark.js'), 'utf8');
        const filterSource = fs.readFileSync(path.resolve(__dirname, 'FilterPanel.js'), 'utf8');

        expect(sourceMarkSource).toContain("tradera: '/images/icons/tradera-40x40.png'");
        expect(sourceMarkSource).toContain("blocket: '/images/icons/blocket.png'");
        expect(sourceMarkSource).not.toContain('label.charAt(0)');
        expect(sourceMarkSource).toContain('backgroundColor: alpha(color, SOURCE_TINT_OPACITY)');
        expect(sourceMarkSource).toContain('borderColor: color');
        expect(filterSource).toContain('<SourceMark');
        expect(filterSource).toContain('sourceId = {source.id}');
    });

    it('reserves a distinct platform color for every marketplace', () => {
        const themeSource = fs.readFileSync(themePath, 'utf8');
        const sourceColorBlock = themeSource.match(/const sourceColors = \{([\s\S]*?)\n\};/u)[ 1 ];
        const platformColors = [ ...sourceColorBlock.matchAll(/:\s*'(#[0-9A-F]{6})'/gu) ]
            .map((match) => {
                return match[ 1 ];
            });

        expect(platformColors).toHaveLength(7);
        expect(new Set(platformColors).size).toBe(platformColors.length);
        expect(sourceColorBlock).not.toContain('colors.');
        expect(themeSource).toContain("blocket: '#0071EB'");
        expect(themeSource).toContain("tradera: '#003B29'");
    });

    it('uses explicit surface tokens instead of derived palette shades', () => {
        const offenders = collectJavaScriptFiles(designRoot)
            .filter((filePath) => {
                return filePath !== themePath;
            })
            .filter((filePath) => {
                return fs.readFileSync(filePath, 'utf8').includes('secondary.light');
            })
            .map((filePath) => {
                return path.relative(designRoot, filePath);
            });

        expect(offenders).toEqual([]);
    });

    it('defines compact listing density in the design system', () => {
        const themeSource = fs.readFileSync(themePath, 'utf8');
        const cardSource = fs.readFileSync(path.resolve(__dirname, 'ResultCard.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(srcRoot, 'pages', 'SearchResults.js'), 'utf8');

        expect(themeSource).toContain('resultCard:');
        expect(cardSource).toContain('resultCard.imageHeight');
        expect(resultsSource).toContain('lg = {3}');
    });

    it('uses a mobile list and a shared loading indicator', () => {
        const cardSource = fs.readFileSync(path.resolve(__dirname, 'ResultCard.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(srcRoot, 'pages', 'SearchResults.js'), 'utf8');

        expect(cardSource).toContain("xs: 'row'");
        expect(resultsSource).toContain('xs = {12}');
        expect(resultsSource).toContain('<SearchLoading />');
    });

    it('keeps mobile search feedback stable and actionable', () => {
        const cardSource = fs.readFileSync(path.resolve(__dirname, 'ResultCard.js'), 'utf8');
        const filterSource = fs.readFileSync(path.resolve(__dirname, 'FilterPanel.js'), 'utf8');
        const searchBoxSource = fs.readFileSync(path.resolve(__dirname, 'SearchBox.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(srcRoot, 'pages', 'SearchResults.js'), 'utf8');

        expect(resultsSource).toContain("isFetching\n                                ? 'Söker efter fynd…'");
        expect(filterSource).toContain("applyLabel: 'Visa resultat'");
        expect(searchBoxSource).toContain("{'Sök'}");
        expect(searchBoxSource).not.toContain("{'Sök alla'}");
        expect(cardSource).toContain("justifyContent: 'space-between'");
    });

    it('exposes real account and saved-search actions in the app', () => {
        const shellSource = fs.readFileSync(path.resolve(__dirname, 'AppShell.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(srcRoot, 'pages', 'SearchResults.js'), 'utf8');

        expect(shellSource).toContain('<AccountActions />');
        expect(resultsSource).toContain('<SaveSearchButton');
    });

    it('keeps profile and admin navigation inside the app', () => {
        const appSource = fs.readFileSync(path.join(srcRoot, 'App.js'), 'utf8');
        const accountSource = fs.readFileSync(path.resolve(__dirname, 'AccountActions.js'), 'utf8');

        expect(appSource).toContain("path = '/profile'");
        expect(appSource).toContain('<Profile />');
        expect(appSource).toContain("path = '/admin'");
        expect(appSource).toContain('<Admin />');
        expect(accountSource).toContain("to = '/admin'");
    });

    it('uses a single public application experience', () => {
        const appSource = fs.readFileSync(path.join(srcRoot, 'App.js'), 'utf8');
        const brandSource = fs.readFileSync(path.resolve(__dirname, 'Brand.js'), 'utf8');
        const searchStateSource = fs.readFileSync(path.join(srcRoot, 'search-state.js'), 'utf8');
        const watchItemSource = fs.readFileSync(path.resolve(__dirname, 'WatchItemCard.js'), 'utf8');
        const watchGroupSource = fs.readFileSync(path.resolve(__dirname, 'WatchGroupCard.js'), 'utf8');

        expect(appSource).toContain("path = '/'");
        expect(appSource).toContain("path = '/search/:searchString'");
        expect(appSource).not.toContain("from './pages/main'");
        expect(appSource).not.toContain("from './pages/search'");
        expect(appSource).not.toContain('createTheme');
        expect(appSource).not.toContain('usesV2');
        expect(brandSource).toContain("to = '/'");
        expect(searchStateSource).toContain('return `/search/${encodeURIComponent(searchPhrase.trim())}`;');
        expect(watchItemSource).toContain('to = {`/search/${encodeURIComponent(match)}`}');
        expect(watchGroupSource).toContain('to = {`/search/${encodeURIComponent(match)}`}');
    });

    it('keeps every admin tool destination inside the app', () => {
        const appSource = fs.readFileSync(path.join(srcRoot, 'App.js'), 'utf8');
        const adminSource = fs.readFileSync(path.join(srcRoot, 'pages', 'Admin.js'), 'utf8');

        expect(appSource).toContain("path = '/deals/isbn'");
        expect(appSource).toContain('<IsbnDeals />');
        expect(appSource).toContain("path = '/deals'");
        expect(appSource).toContain('<Deals />');
        expect(appSource).toContain("path = '/barcode'");
        expect(appSource).toContain('<Barcode />');
        expect(appSource).toContain("path = '/barcode/quagga'");
        expect(appSource).toContain("path = '/barcode/zxing'");
        expect(adminSource).toContain('<FeatureLinkCard');
        expect(adminSource).toContain('<StatisticCard');
    });

    it('uses Auth0 v2 token options when saving and reading watches', () => {
        const saveSource = fs.readFileSync(path.resolve(__dirname, 'SaveSearchButton.js'), 'utf8');
        const profileSource = fs.readFileSync(path.join(srcRoot, 'pages', 'Profile.js'), 'utf8');

        expect(saveSource).toContain('authorizationParams: AUTH_OPTIONS');
        expect(saveSource).toContain('payload.errors');
        expect(profileSource).toContain('authorizationParams: AUTH_OPTIONS');
        expect(profileSource).toContain("textAlign = 'center'");
        expect(profileSource).toContain("'&:last-child': {");
    });

    it('keeps admin cards responsive and count failures non-fatal', () => {
        const adminSource = fs.readFileSync(path.join(srcRoot, 'pages', 'Admin.js'), 'utf8');
        const featureCardSource = fs.readFileSync(path.resolve(__dirname, 'FeatureLinkCard.js'), 'utf8');

        expect(adminSource).toContain("display: 'grid'");
        expect(adminSource).toContain('gridTemplateColumns: {');
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
        expect(accountSource).toContain("aria-label = 'Admin'");
        expect(accountSource).toContain('<NotificationBell />');
        expect(accountSource).not.toContain("{'Bevakningar'}");
        expect(accountSource.indexOf("aria-label = 'Admin'"))
            .toBeLessThan(accountSource.indexOf('<NotificationBell />'));
        expect(bellSource).toContain("aria-label = 'Notiser'");
        expect(brandSource).toContain("xs: 'none'");
        expect(brandSource).toContain("src = '/logo192.png'");
        expect(brandSource).not.toContain('DoneIcon');
    });

    it('shows each admin statistic source once and right-aligns mobile values', () => {
        const statisticSource = fs.readFileSync(path.resolve(__dirname, 'StatisticCard.js'), 'utf8');

        expect(statisticSource).toContain('{!mark && (');
        expect(statisticSource).toContain("xs: 'right'");
        expect(statisticSource).toContain("marginLeft: 'auto'");
    });

    it('keeps mobile result actions together and exposes filters on the landing page', () => {
        const homeSource = fs.readFileSync(path.join(srcRoot, 'pages', 'Home.js'), 'utf8');
        const heroSource = fs.readFileSync(path.resolve(__dirname, 'LandingHero.js'), 'utf8');
        const searchSource = fs.readFileSync(path.resolve(__dirname, 'SearchBox.js'), 'utf8');
        const resultsSource = fs.readFileSync(path.join(srcRoot, 'pages', 'SearchResults.js'), 'utf8');

        expect(homeSource).toContain('<FilterDrawer');
        expect(homeSource).toContain("applyLabel = 'Spara filter'");
        expect(homeSource).toContain('mobileAction = {mobileFilterAction}');
        expect(homeSource).toContain('getAuctionHouseCount');
        expect(homeSource).toContain('<LandingCoverage');
        expect(heroSource).toContain('mobileAction = {mobileAction}');
        expect(searchSource).toContain('gridTemplateAreas: {');
        expect(searchSource).toContain("xs: '\"input input\" \"action search\"'");
        expect(searchSource).toContain('gridArea: \'action\'');
        expect(resultsSource).toContain("direction = 'row'");
        expect(resultsSource).toContain('flex: 1');
        expect(resultsSource).toContain('<FilterDrawer');
    });

    it('showcases every reusable design-system component', () => {
        const showcase = fs.readFileSync(path.join(srcRoot, 'pages', 'DesignSystem.js'), 'utf8');
        const components = fs.readdirSync(path.resolve(__dirname))
            .filter((name) => {
                return name.endsWith('.js');
            })
            .filter((name) => {
                return !name.endsWith('.test.js');
            })
            .filter((name) => {
                return ![
                    'AccountPageShell.js',
                    'DesignSection.js',
                    'DesignSwatch.js',
                    'theme.js',
                    'ToolPageShell.js',
                ].includes(name);
            })
            .map((name) => {
                return path.basename(name, '.js');
            });
        const missingComponents = components.filter((component) => {
            return !showcase.includes(`<${component}`);
        });

        expect(missingComponents).toEqual([]);
    });
});
