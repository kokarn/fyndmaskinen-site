const addWatch = (accessToken, notificationEmail, newMatchString) => {
    return fetch(`${window.API_HOSTNAME}/graphql`, {
        body: JSON.stringify({
            query: `mutation {
                addWatch(match: "${newMatchString}", notify: "${notificationEmail}") {
                    match
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

export default addWatch;
