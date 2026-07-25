import {
    createV2SearchPath,
    getEnabledSourceIds,
} from './search-state';

describe('V2 search state', () => {
    it('creates an encoded V2 search route', () => {
        expect(createV2SearchPath('poul henningsen')).toBe('/v2/search/poul%20henningsen');
    });

    it('expands enabled source groups for the search API', () => {
        const availableSources = [
            {
                id: 'small',
                ids: [
                    'one',
                    'two',
                ],
            },
            {
                id: 'blocket',
            },
        ];

        expect(getEnabledSourceIds({
            blocket: false,
            small: true,
        }, availableSources)).toEqual([
            'one',
            'two',
        ]);
    });

    it('keeps every marketplace enabled by default', () => {
        const availableSources = [
            {
                defaultEnabled: true,
                id: 'auctionet',
            },
            {
                defaultEnabled: true,
                id: 'tradera',
            },
        ];

        expect(getEnabledSourceIds(undefined, availableSources)).toEqual([
            'auctionet',
            'tradera',
        ]);
    });
});
