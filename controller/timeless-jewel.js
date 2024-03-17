const fetch = require('node-fetch');
const { getLeagueNameFromGGC } = require('./currencyExchange');

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

        // 把國際服的quey轉成台服的query
        const leagueName = await getLeagueNameFromGGC();
        const requestOptionForTW = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': 'OAuth poe-bot/1.0.0 (contact: shihyao001@gmail.com)',
            },
            body: JSON.stringify(dataFromGGG),
        }

        const resFromTW = await fetch(`https://pathofexile.tw/api/trade/search/${leagueName}`, requestOptionForTW)
        const dataFromTW = await resFromTW.json()
        const searchURLForTW = `https://pathofexile.tw/trade/search/${leagueName}/${dataFromTW.id}`

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