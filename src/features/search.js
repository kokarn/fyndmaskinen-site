export const buildSearchQuery = (searchPhrase, sources, filters) => {
    const {
        maxPrice,
        sort,
    } = filters;
    const numericMaxPrice = Number(maxPrice);
    const maxPriceArgument = maxPrice !== '' && Number.isFinite(numericMaxPrice) && numericMaxPrice >= 0
        ? `, maxPrice: ${numericMaxPrice}`
        : '';

    return `{
        findItems( match: "${ searchPhrase }", sources: "${sources}"${maxPriceArgument}, sort: "${sort}" ) {
            title
            url
            currentPrice
            imageUrl
            type
        }
    }`;
};

export const normalizeSearchItems = (items) => {
    return Array.isArray(items)
        ? items.filter((item) => {
            return Boolean(item?.url && item?.title);
        })
        : [];
};

const doSearch = ({
    queryKey,
}) => {
    const searchPhrase = queryKey[ 1 ].replace(/[^A-Za-z0-9ÅÄÖåäö .]/giu, '');
    const sources = queryKey[ 2 ];
    const maxPrice = queryKey[ 3 ];
    const sort = queryKey[ 4 ] || 'relevance';

    let query = buildSearchQuery(searchPhrase, sources, {
        maxPrice,
        sort,
    });

    if (searchPhrase === '') {
        query = `{
            getRandomItems( sources: "${sources}" ) {
                title
                url
                currentPrice
                imageUrl
                type
            }
        }`;
    }

    console.log(`Searching for "${searchPhrase}" in ${sources}`);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'view_search_results',
        value: searchPhrase,
    });

    try {
        return fetch(
            `${ window.API_HOSTNAME }/graphql`,
            {
                body: JSON.stringify({
                    query: query,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            },
        )
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return normalizeSearchItems(response?.data?.findItems ?? response?.data?.getRandomItems);
            })
            .catch((fetchError) => {
                console.error(fetchError);

                return [];
            });
    } catch (someError) {
        console.error(someError);
    }

    return false;
};

export default doSearch;
