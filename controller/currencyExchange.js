const fetch = require('node-fetch');
require('dotenv/config')

async function getLeagueNameFromGGC() {
    try {
        const requestOption = {
            method: 'GET',
        };

        const res = await fetch('https://web.poe.garena.tw/api/trade/data/leagues', requestOption);
        const data = await res.json();

        return data.result[0].id;
    } catch (error) {
        console.log(error);
    }
} 

async function getURLFromGGC(searchJsonReady) {
    try {
        const leagueName = await getLeagueNameFromGGC();
        const requestOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': 'OAuth poe-bot/1.0.0 (contact: shihyao001@gmail.com)',
            },
            body: JSON.stringify(searchJsonReady),
        }

        const res = await fetch(`http://web.poe.garena.tw/api/trade/exchange/${leagueName}`, requestOption)
        const data = await res.json()

        return { data, leagueName }
    } catch (error) {
        console.log(error);
    }
}

async function divine(query) {
    const URLResult = await getURLFromGGC(query);
    const { data, leagueName } = URLResult;
    const dataResultArray = Object.values(data.result)
    const searchURL = data.id;
    const searchLength = dataResultArray.length < 12 ? dataResultArray.length : 12;

    const top3Value = [];

    for (let i = 0; i < searchLength; i++) {
        const divineAmount = dataResultArray[i].listing.offers
            .filter(el => el.exchange.amount === 1)
            .map(el => el.item.amount);
        top3Value.push(divineAmount);
    }

    const finalDivinePrice = top3Value.flat();

    return {
        finalDivinePrice,
        searchURL,
        leagueName,
    };
}

module.exports = {
    getURLFromGGC,
    divine,
    getLeagueNameFromGGC,
}