const removeWatch = (accessToken, matchString) => {
    return fetch(`${window.API_HOSTNAME}/graphql`, {
        body: JSON.stringify({
            query: `mutation {
                removeWatch(match: "${matchString}") {
                    match
                    notify
                }
            }`,
        }),
        headers: {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
};

export default removeWatch;
