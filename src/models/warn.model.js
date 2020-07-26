export default (user, epic, warn, own, channel) => {

    return {
        id: user.id,
        username: user.username,
        epic: {
            "hasEpic": epic.hasEpic,
            "epicID": epic.epicID,
            "username": epic.username
        },
        warns: [
            {
                expired: false,
                warnDate: Date.now(),
                pardonDate: warn.pardonDate,
                warnMessage: warn.reason,
                hasOwn: own == undefined ? false : true,
                ownID: own == undefined ? undefined : own.id,
                channel: channel
            }
        ]
    }
}