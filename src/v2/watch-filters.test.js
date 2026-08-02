import {
    buildWatchFilters,
} from './search-state';

const availableSources = [
    {
        id: 'small',
        ids: [ 'one', 'two' ],
    },
    {
        id: 'blocket',
    },
];

describe('watch filter snapshots', () => {
    it('captures matching filters but leaves result ordering out', () => {
        expect(buildWatchFilters({
            availableSources,
            maxPrice: '2500',
            sort: 'price_asc',
            sourceState: {
                blocket: false,
                small: true,
            },
        })).toEqual({
            maxPrice: 2500,
            sources: [ 'one', 'two' ],
            version: 1,
        });
    });

    it('omits an unset maximum price', () => {
        expect(buildWatchFilters({
            availableSources,
            maxPrice: '',
            sourceState: {
                blocket: true,
                small: true,
            },
        })).toEqual({
            sources: [ 'one', 'two', 'blocket' ],
            version: 1,
        });
    });
});
