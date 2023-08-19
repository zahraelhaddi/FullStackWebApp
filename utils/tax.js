

// Define a mapping object for tax rates
const taxRates = {
    1: {//ESS
        ranges: [
            { min: 0, max: 7, rate: 350 },
            { min: 8, max: 10, rate: 650 },
            { min: 11, max: 14, rate: 3000 },
            { min: 15, max: Infinity, rate: 8000 }
        ]
    },
    2: {//GAS
        ranges: [
            { min: 0, max: 7, rate: 700 },
            { min: 8, max: 10, rate: 1500 },
            { min: 11, max: 14, rate: 6000 },
            { min: 15, max: Infinity, rate: 20000 }
        ]
    }
};

exports.AnnualTaxCalculator = (puissance, carburant_id) => {
    const carburantData = taxRates[carburant_id];
    if (!carburantData) {
        throw new Error('Invalid carburant_id');
    }

    for (const range of carburantData.ranges) {
        if (puissance >= range.min && puissance <= range.max) {
            return range.rate;
        }
    }

    throw new Error('Invalid puissance');
};
