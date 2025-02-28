import 'dotenv/config';

export default {
    expo: {
        extra: {
            API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8080",
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        },
    },
};
