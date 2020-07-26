export default (user, epic) => {
    return {
        id: user.id,
        username: user.username,
        epic: {
            "hasEpic": epic.hasEpic,
            "epicID": epic.epicID,
            "username": epic.username
        },
        banDate: Date.now(),
        reason: user.reason
    }
}