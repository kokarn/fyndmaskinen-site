import {
    normalizeBokborsenResults,
    normalizeConditions,
} from './shared';

describe('Bokbörsen condition normalization', () => {
    it('keeps well-formed condition tiers and coerces numbers', () => {
        const tiers = normalizeConditions([
            {
                count: 4,
                id: 'nyskick',
                label: 'Nyskick',
                lowestPrice: '149',
            },
            {
                count: '2',
                id: 'gott',
                label: 'Gott skick',
                lowestPrice: 55,
            },
        ]);

        expect(tiers).toEqual([
            {
                count: 4,
                id: 'nyskick',
                label: 'Nyskick',
                lowestPrice: 149,
            },
            {
                count: 2,
                id: 'gott',
                label: 'Gott skick',
                lowestPrice: 55,
            },
        ]);
    });

    it('drops tiers missing an id, label, or numeric price', () => {
        const tiers = normalizeConditions([
            {
                count: 1,
                id: '',
                label: 'Utan id',
                lowestPrice: 10,
            },
            {
                count: 1,
                id: 'gott',
                label: 'Gott skick',
                lowestPrice: 'abc',
            },
            {
                count: 3,
                id: 'nyskick',
                label: 'Nyskick',
                lowestPrice: 99,
            },
        ]);

        expect(tiers).toEqual([
            {
                count: 3,
                id: 'nyskick',
                label: 'Nyskick',
                lowestPrice: 99,
            },
        ]);
    });

    it('returns an empty array when conditions are absent', () => {
        expect(normalizeConditions(undefined)).toEqual([]);
        expect(normalizeConditions(null)).toEqual([]);
        expect(normalizeConditions('nope')).toEqual([]);
    });

    it('carries conditions and listingCount through the payload normalizer', () => {
        const [ book ] = normalizeBokborsenResults({
            author: 'Yuval Noah Harari',
            conditions: [
                {
                    count: 4,
                    id: 'nyskick',
                    label: 'Nyskick',
                    lowestPrice: 149,
                },
            ],
            listingCount: 23,
            name: 'Sapiens',
            priceLow: 39,
        });

        expect(book.title).toBe('Sapiens');
        expect(book.author).toBe('Yuval Noah Harari');
        expect(book.listingCount).toBe(23);
        expect(book.conditions).toHaveLength(1);
        expect(book.conditions[ 0 ].lowestPrice).toBe(149);
    });

    it('defaults conditions to an empty array for legacy payloads', () => {
        const [ book ] = normalizeBokborsenResults({
            name: 'Legacy Book',
            priceLow: 20,
        });

        expect(book.conditions).toEqual([]);
        expect(book.listingCount).toBe(0);
    });
});
