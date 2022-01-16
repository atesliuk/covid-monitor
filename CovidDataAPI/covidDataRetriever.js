const schedule = require('node-schedule');
const axios = require('axios');

const { CovidCountryData, CovidWorldTotalData } = require('../models/CovidData');

const fetchCovidData = async () => {
    try {
        const options = {
            headers: {
                'X-RapidAPI-Key': process.env.COVID_DATA_X_RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.COVID_DATA_X_RAPIDAPI_HOST,
            },
            timeout: 5000,
        };
        const response = await axios.get(process.env.COVID_DATA_URL, options);
        if (response.status === 200) {
            console.log('Successfully fetched Covid data');
            return response.data;
        }
    } catch (err) {
        throw new Error('Did not manage to fetch Covid data');
    }
};

const toNum = str => (isFinite(+str.replace(/,/g, '')) ? +str.replace(/,/g, '') : -1);

const updateCovidCountryData = async (data, statisticsTakenAt) => {
    data.forEach(country => {
        CovidCountryData.findOne({ countryName: country.country_name })
            .then(foundCountry => {
                if (foundCountry) {
                    foundCountry.countryName = country.country_name;
                    foundCountry.cases = toNum(country.cases);
                    foundCountry.deaths = toNum(country.deaths);
                    foundCountry.region = country.region;
                    foundCountry.totalRecovered = toNum(country.total_recovered);
                    foundCountry.newDeaths = toNum(country.new_deaths);
                    foundCountry.newCases = toNum(country.new_cases);
                    foundCountry.seriousCritical = toNum(country.serious_critical);
                    foundCountry.activeCases = toNum(country.active_cases);
                    foundCountry.totalCasesPer1mPopulation = toNum(country.total_cases_per_1m_population);
                    foundCountry.deathsPer1mPopulation = toNum(country.deaths_per_1m_population);
                    foundCountry.totalTests = toNum(country.total_tests);
                    foundCountry.testsPer1mPopulation = toNum(country.tests_per_1m_population);
                    foundCountry.statisticTakenAt = statisticsTakenAt;
                    return foundCountry.save();
                } else {
                    const countryData = new CovidCountryData({
                        countryName: country.country_name,
                        cases: toNum(country.cases),
                        deaths: toNum(country.deaths),
                        region: country.region,
                        totalRecovered: toNum(country.total_recovered),
                        newDeaths: toNum(country.new_deaths),
                        newCases: toNum(country.new_cases),
                        seriousCritical: toNum(country.serious_critical),
                        activeCases: toNum(country.active_cases),
                        totalCasesPer1mPopulation: toNum(country.total_cases_per_1m_population),
                        deathsPer1mPopulation: toNum(country.deaths_per_1m_population),
                        totalTests: toNum(country.total_tests),
                        testsPer1mPopulation: toNum(country.tests_per_1m_population),
                        statisticTakenAt: statisticsTakenAt,
                    });
                    return countryData.save();
                }
            })
            .catch(err => {
                throw new Error('Error when updating country data');
            });
    });
};

const updateCovidWorldData = async data => {
    try {
        const savedWorldData = await CovidWorldTotalData.findOne();
        if (savedWorldData) {
            savedWorldData.totalCases = toNum(data.total_cases);
            savedWorldData.newCases = toNum(data.new_cases);
            savedWorldData.totalDeaths = toNum(data.total_deaths);
            savedWorldData.newDeaths = toNum(data.new_deaths);
            savedWorldData.totalRecovered = toNum(data.total_recovered);
            savedWorldData.activeCases = toNum(data.active_cases);
            savedWorldData.seriousCritical = toNum(data.serious_critical);
            savedWorldData.totalCasesPer1mPopulation = toNum(data.total_cases_per_1m_population);
            savedWorldData.deathsPer1mPopulation = toNum(data.deaths_per_1m_population);
            savedWorldData.statisticTakenAt = toNum(data.statistic_taken_at);
            await savedWorldData.save();
            console.log('Successfully updated world data');
        } else {
            const covidWorldData = new CovidWorldTotalData({
                totalCases: toNum(data.total_cases),
                newCases: toNum(data.new_cases),
                totalDeaths: toNum(data.total_deaths),
                newDeaths: toNum(data.new_deaths),
                totalRecovered: toNum(data.total_recovered),
                activeCases: toNum(data.active_cases),
                seriousCritical: toNum(data.serious_critical),
                totalCasesPer1mPopulation: toNum(data.total_cases_per_1m_population),
                deathsPer1mPopulation: toNum(data.deaths_per_1m_population),
                statisticTakenAt: data.statistic_taken_at,
            });
            await covidWorldData.save();
            console.log('Successfully downloaded world data');
        }
    } catch (err) {
        throw new Error('Error when updating world data');
    }
};

const processCovidData = data => {
    if (data) {
        if (data.world_total) {
            updateCovidWorldData(data.world_total);
        }
        if (data.countries_stat) {
            updateCovidCountryData(data.countries_stat, data.statistic_taken_at);
        }
    }
};

const CovidDataScheduler = () => {
    // Runs every COVID_DATA_UPDATE_INTERVAL hours
    const covidDataScheduler = schedule.scheduleJob(
        `0 */${process.env.COVID_DATA_UPDATE_INTERVAL} * * *`,
        // `*/10 * * * * *`,
        () => {
            fetchCovidData().then(data => processCovidData(data));
        }
    );
};

module.exports = CovidDataScheduler;
