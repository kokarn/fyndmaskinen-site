import addWatch from './add-watch';

// Editing a watch's filters reuses the addWatch upsert: the backend keys watches
// on owner + match, so re-saving the same phrase with new filters refreshes the
// stored snapshot in place rather than creating a duplicate.
const updateWatch = ({
    accessToken,
    filters,
    match,
    notificationEmail,
}) => {
    return addWatch({
        accessToken,
        filters,
        newMatchString: match,
        notificationEmail,
    });
};

export default updateWatch;
