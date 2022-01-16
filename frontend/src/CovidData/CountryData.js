import { useState, useEffect } from 'react';

function CountryData({ country, followed, follow, unfollow, openCountry }) {
    const [countryCovidData, setCountryCovidData] = useState({
        countryName: '',
        cases: '',
        deaths: '',
        totalRecovered: '',
        newDeaths: '',
        newCases: '',
        seriousCritical: '',
        activeCases: '',
        totalCasesPer1mPopulation: '',
        deathsPer1mPopulation: '',
        totalTests: '',
        testsPer1mPopulation: '',
        statisticTakenAt: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/countryDataShort', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
                Country: country,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.message) {
                    console.error('Something went wrong in CountryData.js 1');
                    return;
                }
                setCountryCovidData(data);
            })
            .catch(err => {
                console.error('Something went wrong in CountryData.js 2:');
                console.error(err);
            });
    }, []);

    return (
        <div className="card" style={{ width: 300 }}>
            <div className="p-1" onClick={() => openCountry(country)} style={{ cursor: 'pointer' }}>
                countryName - {countryCovidData.countryName}
                <br />
                cases - {countryCovidData.cases}
                <br />
                deaths - {countryCovidData.deaths}
                <br />
                totalRecovered - {countryCovidData.totalRecovered}
                <br />
                newDeaths - {countryCovidData.newDeaths}
                <br />
                newCases - {countryCovidData.newCases}
                <br />
                totalTests - {countryCovidData.totalTests}
                <br />
                statisticTakenAt - {countryCovidData.statisticTakenAt}
            </div>
            <br />
            {followed ? (
                <button className="btn btn-danger" onClick={() => unfollow(country)}>
                    Remove
                </button>
            ) : (
                <button className="btn btn-success" onClick={() => follow(country)}>
                    Add
                </button>
            )}
        </div>
    );
}

export default CountryData;
