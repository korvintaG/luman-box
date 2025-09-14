import { defineConfig } from "cypress";
import dotenv from 'dotenv';

dotenv.config(); // <--- вот это для загрузки переменных окружения

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    watchForFileChanges: false,
    env: {
      REACT_APP_USER_NAME: process.env.REACT_APP_USER_NAME,
      REACT_APP_USER_PASSWORD: process.env.REACT_APP_USER_PASSWORD,
      REACT_APP_USER2_LOGIN: process.env.REACT_APP_USER2_LOGIN,
      REACT_APP_USER2_PASSWORD: process.env.REACT_APP_USER2_PASSWORD,
      REACT_APP_ERROR_LOGIN: process.env.REACT_APP_ERROR_LOGIN,
      REACT_APP_ERROR_PASSWORD: process.env.REACT_APP_ERROR_PASSWORD,
      REACT_APP_ADMIN_LOGIN: process.env.REACT_APP_ADMIN_LOGIN,
      REACT_APP_ADMIN_PASSWORD: process.env.REACT_APP_ADMIN_PASSWORD,
      REACT_APP_SUPER_ADMIN_LOGIN: process.env.REACT_APP_SUPER_ADMIN_LOGIN,
      REACT_APP_SUPER_ADMIN_PASSWORD: process.env.REACT_APP_SUPER_ADMIN_PASSWORD,
      REACT_APP_AUTHOR_PHOTO: process.env.REACT_APP_AUTHOR_PHOTO,
      REACT_APP_SOURCE_PHOTO: process.env.REACT_APP_SOURCE_PHOTO,
    },
  },
});
