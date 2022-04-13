const doGetWatches = () => {
    const query = `{
        getWatches {
            notify
            match
        }
    }`;

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
            return response.data.getWatches;
        })
        .catch((fetchError) => {
            console.error(fetchError);
        });
};

export default doGetWatches;
