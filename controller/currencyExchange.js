const fetch = require('node-fetch');
const Decimal = require('decimal.js')

const getURLFromGGC = async searchJsonReady => {
    try {
        const requestOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': 'OAuth poe-bot/1.0.0 (contact: shihyao001@gmail.com)',
                cookie: 'POESESSID=8e94ba6fc620c449c8d282dcad438ab4',
            },
            body: JSON.stringify(searchJsonReady),
        }
        // const delay = time => new Promise(resolve => setTimeout(resolve, time))

        const res = await fetch('http://web.poe.garena.tw/api/trade/exchange/卡蘭德', requestOption) //TODO 要改成新聯盟 Sentinel
        // await delay(3000)
        const data = await res.json()

        return data
    } catch (error) {
        logger.error(error)
    }
}

const divine = async (query) => {
    const data = await getURLFromGGC(query);

    const obj = data.result;

    const searchURL = data.id;

    const top3Value = [];

    for (let i = 0; i < 12; i++) {
        const D = Object.values(obj)[i].listing.offers.filter(el => el.exchange.amount === 1).map(el => el.item.amount);
        top3Value.push(D);
    }

    const finalDivinePrice = top3Value.flat();

    return [finalDivinePrice, searchURL];
}

module.exports = {
    getURLFromGGC,
    divine,
}