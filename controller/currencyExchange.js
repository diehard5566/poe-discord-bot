const fetch = require('node-fetch');

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

module.exports = {
    getURLFromGGC
}