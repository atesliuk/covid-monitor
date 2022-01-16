import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function CountryModal({ show, onHide, countryName }) {
    const [countryData, setCountryData] = useState({
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
        if (!countryName) {
            return;
        }
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/countryData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
                Country: countryName,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.message) {
                    console.error('Something went wrong in CountryData.js 1');
                    return;
                }
                setCountryData(data);
            })
            .catch(err => {
                console.error('Something went wrong in CountryData.js 2:');
                console.error(err);
            });
    }, [countryName]);

    return (
        <Modal {...{ show }} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton onClick={onHide}>
                <Modal.Title id="contained-modal-title-vcenter">{countryName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    countryName - {countryData.countryName}
                    <br />
                    cases - {countryData.cases}
                    <br />
                    deaths - {countryData.deaths}
                    <br />
                    totalRecovered - {countryData.totalRecovered}
                    <br />
                    newDeaths - {countryData.newDeaths}
                    <br />
                    newCases - {countryData.newCases}
                    <br />
                    seriousCritical - {countryData.seriousCritical}
                    <br />
                    activeCases - {countryData.activeCases}
                    <br />
                    totalCasesPer1mPopulation - {countryData.totalCasesPer1mPopulation}
                    <br />
                    deathsPer1mPopulation - {countryData.deathsPer1mPopulation}
                    <br />
                    totalTests - {countryData.totalTests}
                    <br />
                    testsPer1mPopulation - {countryData.testsPer1mPopulation}
                    <br />
                    statisticTakenAt - {countryData.statisticTakenAt}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CountryModal;
