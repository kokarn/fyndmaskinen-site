export const createV2SearchPath = (searchPhrase) => {
    return `/search/${encodeURIComponent(searchPhrase.trim())}`;
};

export const getDefaultSourceState = (availableSources) => {
    return Object.fromEntries(availableSources.map((source) => {
        return [
            source.id,
            source.defaultEnabled,
        ];
    }));
};

export const getEnabledSourceIds = (sourceState, availableSources) => {
    const selectedSources = sourceState || getDefaultSourceState(availableSources);

    return availableSources
        .filter((source) => {
            return selectedSources[ source.id ];
        })
        .flatMap((source) => {
            return source.ids || [ source.id ];
        });
};

export const buildWatchFilters = ({
    availableSources,
    maxPrice,
    sourceState,
}) => {
    const filters = {
        sources: getEnabledSourceIds(sourceState, availableSources),
        version: 1,
    };
    const numericMaxPrice = Number(maxPrice);

    if (maxPrice !== '' && Number.isFinite(numericMaxPrice) && numericMaxPrice >= 0) {
        filters.maxPrice = numericMaxPrice;
    }

    return filters;
};
