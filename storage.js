const Storage = {
    saveAvatar: (userId, config) => {
        localStorage.setItem(`sm_avatar_${userId}`, JSON.stringify(config));
    },
    getAvatar: (userId) => {
        const data = localStorage.getItem(`sm_avatar_${userId}`);
        return data ? JSON.parse(data) : null;
    }
};
