import 'dotenv/config';

export default {
    expo: {
        extra: {
            API_BASE_URL: process.env.API_BASE_URL,
        },
    },
};
