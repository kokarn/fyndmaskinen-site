/* eslint-env node, jest */
/* eslint-disable no-sync, no-template-curly-in-string, no-magic-numbers, prefer-named-capture-group */
import fs from 'fs';
import path from 'path';

const cardSource = fs.readFileSync(path.resolve(__dirname, 'WatchItemCard.js'), 'utf8');
const profileSource = fs.readFileSync(path.resolve(__dirname, '..', 'pages', 'Profile.js'), 'utf8');

describe('watch filter display', () => {
    it('condenses persisted sources behind an expandable summary', () => {
        expect(cardSource).toContain('useState(false)');
        expect(cardSource).toContain('<Collapse');
        expect(cardSource).toContain('const allSourcesSelected');
        expect(cardSource).toContain("? 'Alla marknadsplatser'");
        expect(cardSource).toContain('${displaySources.length} valda marknadsplatser');
        expect(cardSource).not.toContain('samlar många auktionshus i ett val');
        expect(cardSource).toContain('<SourceMark');
        expect(cardSource).toContain("Maxpris: ${maxPrice.toLocaleString('sv-SE')} kr");
        expect(profileSource).toContain('maxPrice = {watch.maxPrice}');
        expect(profileSource).toContain('sources = {watch.sources}');
        expect(profileSource).not.toContain("label = 'Ny bevakning'");
        expect(profileSource).not.toContain("{'Lägg till'}");
    });

    it('lets an existing watch edit its filters in place', () => {
        expect(cardSource).toContain('onEditSave');
        expect(cardSource).toContain('<FilterPanel');
        expect(cardSource).toContain('getSourceStateFromIds');
        expect(cardSource).toContain('buildWatchFilters');
        expect(cardSource).toContain("{'Ändra filter'}");
        expect(cardSource).toContain('showSort = {false}');
        expect(profileSource).toContain('updateWatch');
        expect(profileSource).toContain('onEditSave = {handleWatchEdit}');
        expect(profileSource).toContain("queryClient.invalidateQueries('watches')");
    });
});
