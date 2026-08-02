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
