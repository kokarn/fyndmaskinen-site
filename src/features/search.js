const doSearch = ({
    queryKey,
}) => {
    const searchPhrase = queryKey[ 1 ].replace(/[^A-Za-z0-9ÅÄÖåäö .]/giu, '');

    let query = `{
        findItems( match: "${ searchPhrase }", sources: "${queryKey[ 2 ]}" ) {
            title
            url
            currentPrice
            imageUrl
            type
        }
    }`;

    if (searchPhrase === '') {
        query = `{
            getRandomItems {
                title
                url
                currentPrice
                imageUrl
                type
            }
        }`;
    }

    console.log(`Searching for "${searchPhrase}" in ${queryKey[ 2 ]}`);
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
    } catch (someError) {
        console.error(someError);
    }

    return false;
};

export default doSearch;
