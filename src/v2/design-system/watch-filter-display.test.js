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
        expect(cardSource).toContain('<SourceMark');
        expect(cardSource).toContain("Maxpris: ${maxPrice.toLocaleString('sv-SE')} kr");
        expect(profileSource).toContain('maxPrice = {watch.maxPrice}');
        expect(profileSource).toContain('sources = {watch.sources}');
    });
});
