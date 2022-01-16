const express = require('express');

const userController = require('../controllers/user.js');
const covidData = require('../controllers/covidData.js');
const isAuth = require('./isAuth');

const router = express.Router();

// Auth
router.post('/register', userController.registerUser);

router.post('/login', userController.login);

// Profile
router.get('/getProfile', isAuth, userController.getProfile);

router.post('/updateProfile', isAuth, userController.updateProfile);

router.post('/changePassword', isAuth, userController.changePassword);

// Covid data
router.get('/listOfCountries', isAuth, covidData.getListOfCountries);

router.get('/countryData', isAuth, covidData.getCountryCovidData);

router.get('/countryDataShort', isAuth, covidData.getCountryCovidDataShort);

router.get('/worldData', isAuth, covidData.getWorldCovidData);

router.post('/followCountry', isAuth, covidData.followCountry);

router.post('/unfollowCountry', isAuth, covidData.unfollowCountry);

// Error handler
router.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

module.exports = router;
