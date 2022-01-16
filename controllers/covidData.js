const { CovidCountryData, CovidWorldTotalData } = require('../models/CovidData');
const { User } = require('../models/User');

const throwInvalidCountryError = () => {
    const err = new Error('INVALID_COUNTRY');
    err.statusCode = 422;
    err.data = { country: country };
    throw err;
};

exports.getCountryCovidData = async (req, res, next) => {
    const country = req.get('Country');
    if (!country) {
        throwInvalidCountryError();
    }

    try {
        const countryData = await CovidCountryData.findOne({ countryName: country });
        if (!countryData) {
            throwInvalidCountryError();
        }
        res.status(200).json(countryData._doc);
    } catch (err) {
        console.error('Error when retrieving country covid data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getCountryCovidDataShort = async (req, res, next) => {
    const country = req.get('Country');
    if (!country) {
        throwInvalidCountryError();
    }

    try {
        const countryData = await CovidCountryData.findOne({ countryName: country }).select(
            'countryName cases deaths totalRecovered newDeaths newCases totalTests statisticTakenAt'
        );
        if (!countryData) {
            throwInvalidCountryError();
        }
        res.status(200).json(countryData._doc);
    } catch (err) {
        console.error('Error when retrieving country covid data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getWorldCovidData = async (req, res, next) => {
    try {
        const worldData = await CovidWorldTotalData.findOne();
        if (!worldData) {
            throw new Error('WORLD_DATA_UNAVAILABLE');
        }
        res.status(200).json(worldData._doc);
    } catch (err) {
        console.error('Error when retrieving world covid data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getListOfCountries = async (req, res, next) => {
    try {
        let countries = await CovidCountryData.find().select('countryName -_id');
        countries = countries.map(country => country.countryName);
        if (!countries) {
            const err = new Error('NO_COUNTRY_LIST_FOUND');
            err.statusCode = 500;
            throw err;
        }
        res.status(200).json({ countries: countries });
    } catch (err) {
        console.error('Error when retrieving world covid data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.followCountry = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            const err = new Error('USER_ID_NOT_FOUND_IN_REQUEST');
            err.statusCode = 500;
            throw err;
        }

        const countryData = req.body;

        if (!countryData.countryName) {
            const err = new Error('COUNTRY_NAME_NOT_PROVIDED');
            err.statusCode = 500;
            throw err;
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            const err = new Error('USER_NOT_FOUND');
            err.statusCode = 500;
            throw err;
        }

        if (!existingUser.followedCountries) {
            existingUser.followedCountries = [];
        }

        if (!existingUser.followedCountries.includes(countryData.countryName)) {
            existingUser.followedCountries.push(countryData.countryName);
        }

        const savedUser = await existingUser.save();

        res.status(200).json({ followedCountries: savedUser.followedCountries });
    } catch (err) {
        console.error('Error when retrieving world covid data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.unfollowCountry = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            const err = new Error('USER_ID_NOT_FOUND_IN_REQUEST');
            err.statusCode = 500;
            throw err;
        }

        const countryData = req.body;

        if (!countryData.countryName) {
            const err = new Error('COUNTRY_NAME_NOT_PROVIDED');
            err.statusCode = 500;
            throw err;
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            const err = new Error('USER_NOT_FOUND');
            err.statusCode = 500;
            throw err;
        }

        if (!existingUser.followedCountries) {
            existingUser.followedCountries = [];
        } else {
            existingUser.followedCountries = existingUser.followedCountries.filter(v => v !== countryData.countryName);
        }

        const savedUser = await existingUser.save();

        res.status(200).json({ followedCountries: savedUser.followedCountries });
    } catch (err) {
        console.error('Error when retrieving world covid data:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
