const fetch = require('node-fetch');
const { getLeagueNameFromGGC } = require('./currencyExchange');
const poedbTW = require('../src/poedb-tw.json');

async function transitionTimelessJewelURL(query) {
    // const query = 'https://www.pathofexile.com/api/trade/search/Affliction/R9l9B84I7'
    query = query.replace('/trade/', '/api/trade/');

    try {
        // 從pob來的
        const requestOptionForGGG = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        }

        const resFromGGG = await fetch(query, requestOptionForGGG)
        const dataFromGGG = await resFromGGG.json()
        delete dataFromGGG.id;

        if (dataFromGGG.query.name) {
            dataFromGGG.query.name = poedbTW.data.find(el => el.us === dataFromGGG.query.name).lang;
            delete dataFromGGG.query.type;
        }

        // 把國際服的quey轉成台服的query
        const leagueName = await getLeagueNameFromGGC();
        const requestOptionForTW = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Cookie: process.env.COOKIE,
            },
            body: JSON.stringify(dataFromGGG),
        }

        const resFromTW = await fetch(`https://pathofexile.tw/api/trade/search/${leagueName}`, requestOptionForTW)
        const dataFromTW = await resFromTW.json()

        if (dataFromTW.error) {
            console.log(dataFromTW.error.message);
        }

        let searchURLForTW = `https://pathofexile.tw/trade/search/${leagueName}/${dataFromTW.id}`

        if (dataFromTW.id === undefined) {
            searchURLForTW = '有錯誤，請確定網址正確，並稍後重試(1 min)'
        }

        return searchURLForTW;
    } catch (error) {
        console.log(error);
    }
}

// for test
// (async () => {
//     const resp = await transitionTimelessJewelURL()
//     console.log(resp);
// })();

module.exports = {
    transitionTimelessJewelURL,
}