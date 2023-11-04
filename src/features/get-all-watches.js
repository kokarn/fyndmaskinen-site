const getWatches = ({
    queryKey,
}) => {
    const accessToken = queryKey[ 1 ];
    const query = `{
        getAllWatches {
            notify
            match
        }
    }`;

    if (!accessToken) {
        return [];
    }

    return fetch(
        `${ window.API_HOSTNAME }/graphql`,
        {
            body: JSON.stringify({
                query: query,
            }),
            headers: {
                authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
        },
    )
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            return response.data.getAllWatches;
        })
        .catch((fetchError) => {
            console.error(fetchError);

            return [];
        });
};

export default getWatches;
