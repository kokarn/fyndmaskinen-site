const doSearch = ({
    queryKey,
}) => {
    const searchPhrase = queryKey[ 1 ];

    let query = `{
        findItems( match: "${ searchPhrase }" ) {
            title
            url
            currentPrice
            img
            startTime
        }
    }`;

    if (searchPhrase === '') {
        query = `{
            getRandomItems {
                title
                url
                currentPrice
                img
                startTime
            }
        }`;
    }

    console.log(`Searching for "${searchPhrase}"`);

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
        }
    )
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            return response.data.findItems || response.data.getRandomItems;
        })
        .catch((fetchError) => {
            console.error(fetchError);
        });
};

export default doSearch;
