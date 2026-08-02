import fs from 'fs';
import path from 'path';

const cardSource = fs.readFileSync(path.resolve(__dirname, 'WatchItemCard.js'), 'utf8');
const profileSource = fs.readFileSync(path.resolve(__dirname, '..', 'pages', 'Profile.js'), 'utf8');

describe('watch filter display', () => {
    it('renders persisted source and price filters in the shared watch card', () => {
        expect(cardSource).toContain('<SourceMark');
        expect(cardSource).toContain("Maxpris: ${maxPrice.toLocaleString('sv-SE')} kr");
        expect(cardSource).toContain("Alla marknadsplatser");
        expect(profileSource).toContain('maxPrice = {watch.maxPrice}');
        expect(profileSource).toContain('sources = {watch.sources}');
    });
});
