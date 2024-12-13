process.loadEnvFile();

const config = {
    PORT = 5000,
    NODE_ENV = "prod",
    MONGODB_URI,

    EMAIL_USER,
    EMAIL_PASS,
    RECOVERY_LINK,

    PASSWORD_MIN_LENGTH=6,
    USERNAME_MAX_LENGTH=20,
    BONUS_POINTS=100,
} = process.env;

module.exports = config;