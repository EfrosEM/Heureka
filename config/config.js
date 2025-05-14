process.loadEnvFile();

const {
    PORT = 5000,
    NODE_ENV = "prod",

    DB_NAME = "test",
    MONGODB_URI,

    EMAIL_USER,
    EMAIL_PASS,
    URL_HEUREKA,

    PASSWORD_MIN_LENGTH=6,
    USERNAME_MAX_LENGTH=20,
    BONUS_POINTS=100,
} = process.env;

const config = {
    PORT,
    NODE_ENV,
    DB_NAME,
    MONGODB_URI,

    EMAIL_USER,
    EMAIL_PASS,
    URL_HEUREKA,

    PASSWORD_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    BONUS_POINTS,
}; 

module.exports = config;