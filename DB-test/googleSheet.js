const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT }  = require('google-auth-library');

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 */
async function getSheetData(docID, sheetID,) {
    try {
        const result = [];
        const doc = new GoogleSpreadsheet(docID, serviceAccountAuth);
        await doc.loadInfo();
        const sheet = doc.sheetsById[sheetID];
        const rows = await sheet.getRows();
        for (const row of rows) {
            result.push(row._rawData);
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('getSheetData failed');
    }
};

async function updatesSheetData(docID, sheetID, helmetName, fieldIndex, newValue) {
    try {
        const doc = new GoogleSpreadsheet(docID, serviceAccountAuth);
        await doc.loadInfo();
        const sheet = doc.sheetsById[sheetID];
        const rows = await sheet.getRows();

        // 獲取要修改的行
        const row = rows.find(row => row._rawData[0] === helmetName);

        if (!row) {
            throw new Error(`Helmet ${helmetName} not found`);
        }

        // 修改行的數據
        row._rawData[fieldIndex] = newValue;
        row._rawData[row._rawData.length - 1] = new Date().toLocaleString();


        // 保存更改
        await row.save();
    } catch (error) {
        console.log(error);
        throw new Error('updatesSheetData failed');
    }
};

async function getItemPriceResponseToDiscordByItemName (search, socketNumber, sheetName) {
    const allTradeData = await getSheetData(process.env.GOOGLE_SHEET_ID, sheetName);

    const searchData = allTradeData.find(helmet => helmet[0] === search)
    const resultSearchDataWithSocketNumber = searchData[Number(socketNumber) + 2] || '目前尚無資料或沒價' ;
    return `目前 "${search}" / "${socketNumber} 洞"的市集價格為 ：${resultSearchDataWithSocketNumber}，掉落地點為： ${searchData[1]}，最後更新時間為： ${searchData[searchData.length - 1]}`

}

module.exports = {
    getSheetData,
    updatesSheetData,
    getItemPriceResponseToDiscordByItemName,
};