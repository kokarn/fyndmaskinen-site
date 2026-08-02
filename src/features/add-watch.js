const escapeGraphQLString = (value) => {
    return JSON.stringify(String(value));
};

const addWatch = ({
    accessToken,
    filters = {},
    newMatchString,
    notificationEmail,
}) => {
    const filterPayload = Object.keys(filters).length > 0
        ? `, filters: ${escapeGraphQLString(JSON.stringify(filters))}`
        : '';

    return fetch(`${window.API_HOSTNAME}/graphql`, {
        body: JSON.stringify({
            query: `mutation {
                addWatch(
                    match: ${escapeGraphQLString(newMatchString)},
                    notify: ${escapeGraphQLString(notificationEmail)}${filterPayload}
                ) {
                    filterVersion
                    match
                    maxPrice
                    sources
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
