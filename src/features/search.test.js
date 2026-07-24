import {
    buildSearchQuery,
} from './search';

/* eslint-env jest */
/* eslint-disable no-magic-numbers */

test('adds max price and ascending sort to a search query', () => {
    const query = buildSearchQuery('lego', 'tradera', {
        maxPrice: 1000,
        sort: 'price_asc',
    });

    expect(query).toContain('maxPrice: 1000');
    expect(query).toContain('sort: "price_asc"');
});

test('omits an invalid max price and defaults to relevance', () => {
    const query = buildSearchQuery('lego', 'tradera', {
        maxPrice: 'oops',
        sort: 'relevance',
    });

    expect(query).not.toContain('maxPrice:');
    expect(query).toContain('sort: "relevance"');
});
