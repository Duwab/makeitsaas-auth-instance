module.exports = {
    github: {
        code: 'github',
        getConfig: () => {
            return {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CALLBACK_URL
            };
        }
    }
};