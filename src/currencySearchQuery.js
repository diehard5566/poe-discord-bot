const chromeQuery = {
    "exchange": {
        "status": {
            "option": "onlineleague"
        },
        "have": ["divine"],
        "want": ["chrome"]
    }
};

const altQuery = {
    "exchange": {
        "status": {
            "option": "onlineleague"
        },
        "have": ["divine"],
        "want": ["alt"]
    }
};

const jewellersQuery = {
    "exchange": {
        "status": {
            "option": "onlineleague"
        },
        "have": ["divine"],
        "want": ["jewellers"]
    }
};

const ENUM_CURRENCY_TYPE = {
    chrome: '幻色',
    alt: '改造',
    jewellers: '工匠',
};

module.exports = {
    chromeQuery,
    altQuery,
    jewellersQuery,
    ENUM_CURRENCY_TYPE,
}