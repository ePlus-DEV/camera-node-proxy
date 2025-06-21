// app.js
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/camera', async (req, res) => {
    const { id, bg = 'black' } = req.query;

    if (!id) return res.status(400).send('Missing camera id');

    try {
        const response = await axios.get('https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx', {
            responseType: 'stream',
            params: { id, bg },
            headers: {
                'Referer': 'https://giaothong.hochiminhcity.gov.vn/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Cookie': '.VDMS=E54E2733BC8D1B0F42A31B3078226074F592DC3BE10BF2264A0B7D837807762526294F7E27F9ECF8B8CD51AED6D6383E883C735ABFE0A693FFEBEE9F44694F709BECF326BAA6274D25C746D9D241A2F4DDA281BF2512D45ACF9D72D49BD69C0FBAE353255CFBAFA3DB668A88AD2DBA3178C532F2; _frontend=!1c+FfCogRmuuXueOc8Zd0FYCl1ZIlgVP6H2EhwHS7z53uXASrfJb7ikU9rJ8S+Az5bNEhFu4WzsrW0k=; TS01e7700a=0150c7cfd105bb761efa40526228d6b66f95b040892edca0793a6f2ccaebcc1a667205f075da2eb4a39fa707749d48ad141f50f413da62669a2b332a59f1a9b132c228149a; CurrentLanguage=vi'
            },
            timeout: 5000
        });

        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching camera image:', error);
        res.status(500).send('Error fetching camera image');
    }
});

module.exports = app;
