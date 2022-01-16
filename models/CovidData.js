const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const covidCountryDataSchema = new Schema({
    countryName: { type: String, required: true },
    cases: { type: Number, required: true },
    deaths: { type: Number, required: true },
    region: { type: String },
    totalRecovered: { type: Number, required: true },
    newDeaths: { type: Number, required: true },
    newCases: { type: Number, required: true },
    seriousCritical: { type: Number, required: true },
    activeCases: { type: Number, required: true },
    totalCasesPer1mPopulation: { type: Number, required: true },
    deathsPer1mPopulation: { type: Number, required: true },
    totalTests: { type: Number, required: true },
    testsPer1mPopulation: { type: Number, required: true },
    statisticTakenAt: {
        type: String,
        required: true,
    },
});

const covidWorldTotalDataSchema = new Schema({
    totalCases: { type: Number, required: true },
    newCases: { type: Number, required: true },
    totalDeaths: { type: Number, required: true },
    newDeaths: { type: Number, required: true },
    totalRecovered: { type: Number, required: true },
    activeCases: { type: Number, required: true },
    seriousCritical: { type: Number, required: true },
    totalCasesPer1mPopulation: { type: Number, required: true },
    deathsPer1mPopulation: { type: Number, required: true },
    statisticTakenAt: { type: String, required: true },
});

exports.CovidCountryData = mongoose.model(
    'CovidCountryData',
    covidCountryDataSchema
);
exports.CovidWorldTotalData = mongoose.model(
    'CovidWorldTotalData',
    covidWorldTotalDataSchema
);
