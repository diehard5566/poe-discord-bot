const moment = require('moment');
const { getURLFromGGC } = require('./currencyExchange');
const { ENUM_CURRENCY_TYPE } = require('../src/currencySearchQuery');

async function notificationWithCurrencyQuery(query) {
    const currencyType = query.exchange.want[0];

    const currency = await getURLFromGGC(query);
    const { data, leagueName } = currency;
    const currencyResult = Object.values(data.result);

    const searchURL = data.id;
    const searchLength = currencyResult.length < 10 ? currencyResult.length : 10;

    const currencyPrice = [];


    for (let i = 0; i < searchLength; i++) {
        const currencyAmount = currencyResult[i].listing.offers
            .filter(el => el.exchange.amount === 1)
            .map(el => el.item.amount)[0];

        if (currencyType === 'chrome' && currencyAmount >= 4000) {
            currencyPrice.push(currencyAmount);
        }

        if (currencyType === 'alt' && currencyAmount >= 2000) {
            currencyPrice.push(currencyAmount);
        }

        if (currencyType === 'jewellers' && currencyAmount >= 3000) {
            currencyPrice.push(currencyAmount);
        }
    }

    const URL = `https://pathofexile.tw/trade/exchange/${leagueName}/${searchURL}`


    return {
        currencyPrice,
        URL,
    }

}

async function hourlyAlertByCurrencyQuery(query, channel, userAlertArray, historyAlerts) {
    const userNeedAlert = getFormattedIdsString(userAlertArray);
    const currencyType = ENUM_CURRENCY_TYPE[query.exchange.want[0]];
    const currentHour = moment().hour();
    const historyAlertKey = `${currentHour}-${currencyType}-alerted`;

    try {
        const currencyPriceByType = await notificationWithCurrencyQuery(query);

        const checkCurrencyPrice = currencyPriceByType.currencyPrice.length > 0;

        if (!historyAlerts.get(historyAlertKey)) {
            if (checkCurrencyPrice) {
                let sentAlertMsg;
    
                if (currencyType === '改造') {
                    sentAlertMsg = `${ userNeedAlert }改造超過2000啦~快買 點這裡${currencyPriceByType.URL}`;
                } else if (currencyType === '幻色') {
                    sentAlertMsg = `${ userNeedAlert }幻色超過4000啦~快買 點這裡${currencyPriceByType.URL}`;
                } else if (currencyType === '工匠') {
                    sentAlertMsg = `${ userNeedAlert }工匠超過3000啦~快買 點這裡${currencyPriceByType.URL}`;
                }
    
                if (currentHour >= 8 && currentHour <= 23) {
                    channel.send(sentAlertMsg);
                }
    
                historyAlerts.set(historyAlertKey, true);
            }
        }

        // 檢查有沒有通知過要買入
        const hasSendAlerted = historyAlerts.get(historyAlertKey);
        
        sellAlert(hasSendAlerted, currencyPriceByType, channel, currencyType, userNeedAlert);
    } catch (error) {
        console.log(error);
    }
}

function sellAlert(hasSendAlerted, currencyPriceByType, channel, currencyType, userNeedAlert) {
    if (currencyType === '改造') {
        if (hasSendAlerted && currencyPriceByType.currencyPrice[1] <= 2500) {
            // 賣出通知
            const sellAlertMsg = `${ userNeedAlert }改造低於2500啦快賣 點這裡${currencyPriceByType.URL}`;
            channel.send(sellAlertMsg);
        }
    } else if (currencyType === '幻色') {
        if (hasSendAlerted && currencyPriceByType.currencyPrice[1] <= 2000) {
            // 賣出通知
            const sellAlertMsg = `${ userNeedAlert }幻色低於2000啦快賣 點這裡${currencyPriceByType.URL}`;
            channel.send(sellAlertMsg);
        }
    } else if (currencyType === '工匠') {
        if (hasSendAlerted && currencyPriceByType.currencyPrice[1] <= 2000) {
            // 賣出通知
            const sellAlertMsg = `${ userNeedAlert }工匠低於2000啦快賣 點這裡${currencyPriceByType.URL}`;
            channel.send(sellAlertMsg);
        }
    }
}

function getFormattedIdsString(userAlertArray) {
    const formattedIds = userAlertArray.map(id => `<@${id}>`);

    const idsString = formattedIds.join(' ');

    return idsString;
}

module.exports = {
    notificationWithCurrencyQuery,
    hourlyAlertByCurrencyQuery,
};

