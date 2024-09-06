import { defineConfig } from 'vite';
// import fs from 'node:fs';

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 4433,
        // https: {
        //     key: fs.readFileSync('./.cert/key.pem'),
        //     cert: fs.readFileSync('./.cert/cert.pem'),
        // },
    },
    build: {
        assetsDir: '',
    },
});
