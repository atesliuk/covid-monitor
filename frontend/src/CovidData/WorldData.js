import { useState, useEffect } from 'react';

function WorldData({ errorCallback }) {
    const [worldCovidData, setWorldCovidData] = useState({
        totalCases: '',
        newCases: '',
        totalDeaths: '',
        newDeaths: '',
        totalRecovered: '',
        activeCases: '',
        seriousCritical: '',
        totalCasesPer1mPopulation: '',
        deathsPer1mPopulation: '',
        statisticTakenAt: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoading(true);
        fetch('http://localhost:8080/worldData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.message) {
                    errorCallback(data);
                    setLoading(false);
                    return;
                }
                setWorldCovidData(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                errorCallback(err);
            });
    }, []);

    return (
        <div className="card" style={{ width: 300 }}>
            World Covid data:
            <br />
            totalCases - {worldCovidData.totalCases}
            <br />
            newCases - {worldCovidData.newCases}
            <br />
            totalDeaths - {worldCovidData.totalDeaths}
            <br />
            newDeaths - {worldCovidData.newDeaths}
            <br />
            totalRecovered - {worldCovidData.totalRecovered}
            <br />
            activeCases - {worldCovidData.activeCases}
            <br />
            seriousCritical - {worldCovidData.seriousCritical}
            <br />
            totalCasesPer1mPopulation - {worldCovidData.totalCasesPer1mPopulation}
            <br />
            deathsPer1mPopulation - {worldCovidData.deathsPer1mPopulation}
            <br />
            statisticTakenAt - {worldCovidData.statisticTakenAt}
        </div>
    );
}

export default WorldData;
