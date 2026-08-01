/* eslint-disable id-blacklist */
const requestGraphql = (accessToken, query, variables = {}) => {
    return fetch(`${window.API_HOSTNAME}/graphql`, {
        body: JSON.stringify({
            query,
            variables,
        }),
        headers: {
            authorization: 'Bearer'.concat(' ', accessToken),
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('GraphQL-anropet misslyckades');
            }

            return response.json();
        })
        .then((payload) => {
            if (payload.errors?.length) {
                throw new Error(payload.errors[ 0 ].message || 'GraphQL-anropet misslyckades');
            }

            return payload.data;
        });
};

const notificationFields = `
    id
    watchMatch
    itemTitle
    itemType
    itemUrl
    itemDescription
    imageUrl
    currentPrice
    createdAt
    read
`;

const getNotifications = (accessToken, limit = 50) => { // eslint-disable-line no-magic-numbers
    return requestGraphql(accessToken, `
        query Notifications($limit: Int) {
            getNotifications(limit: $limit) {
                ${notificationFields}
            }
            unreadNotificationCount
        }
    `, {
        limit,
    });
};

const getUnreadNotificationCount = (accessToken) => {
    return requestGraphql(accessToken, `
        query UnreadNotificationCount {
            unreadNotificationCount
        }
    `).then((data) => {
        return data.unreadNotificationCount;
    });
};

const markNotificationRead = (accessToken, id) => {
    return requestGraphql(accessToken, `
        mutation MarkNotificationRead($id: String!) {
            markNotificationRead(id: $id)
        }
    `, {
        id,
    }).then((data) => {
        return data.markNotificationRead;
    });
};

const markAllNotificationsRead = (accessToken) => {
    return requestGraphql(accessToken, `
        mutation MarkAllNotificationsRead {
            markAllNotificationsRead
        }
    `).then((data) => {
        return data.markAllNotificationsRead;
    });
};

const getWebPushPublicKey = (accessToken) => {
    return requestGraphql(accessToken, `
        query WebPushPublicKey {
            webPushPublicKey
        }
    `).then((data) => {
        return data.webPushPublicKey;
    });
};

const savePushSubscription = (accessToken, subscription) => {
    const json = subscription.toJSON();

    return requestGraphql(accessToken, `
        mutation SavePushSubscription($endpoint: String!, $p256dh: String!, $auth: String!) {
            savePushSubscription(endpoint: $endpoint, p256dh: $p256dh, auth: $auth)
        }
    `, {
        auth: json.keys.auth,
        endpoint: subscription.endpoint,
        p256dh: json.keys.p256dh,
    }).then((data) => {
        return data.savePushSubscription;
    });
};

const removePushSubscription = (accessToken, endpoint) => {
    return requestGraphql(accessToken, `
        mutation RemovePushSubscription($endpoint: String!) {
            removePushSubscription(endpoint: $endpoint)
        }
    `, {
        endpoint,
    }).then((data) => {
        return data.removePushSubscription;
    });
};

export {
    getNotifications,
    getUnreadNotificationCount,
    getWebPushPublicKey,
    markAllNotificationsRead,
    markNotificationRead,
    removePushSubscription,
    savePushSubscription,
};
