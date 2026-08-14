import {
    buildWatchFilters,
    getSourceStateFromIds,
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

describe('getSourceStateFromIds', () => {
    it('marks a group selected only when every backend id is present', () => {
        expect(getSourceStateFromIds([ 'one', 'two', 'blocket' ], availableSources)).toEqual({
            blocket: true,
            small: true,
        });
    });

    it('leaves a group off when only part of its backend ids are present', () => {
        expect(getSourceStateFromIds([ 'one' ], availableSources)).toEqual({
            blocket: false,
            small: false,
        });
    });

    it('falls back to defaults for a missing snapshot', () => {
        expect(getSourceStateFromIds(null, [
            {
                defaultEnabled: true,
                id: 'blocket',
            },
            {
                defaultEnabled: false,
                id: 'tradera',
            },
        ])).toEqual({
            blocket: true,
            tradera: false,
        });
    });
});
