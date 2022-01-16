import { useState, useEffect } from 'react';

import CountryData from './CountryData';
import Pagination from '../Common/Pagination';

const PAGE_LIMIT = 6;

function CovidDataCountries({ countryList, followedCountryList, follow, unfollow, openCountry }) {
    const [renderedCountryData, setRenderedCountryData] = useState('');
    const [selectedPage, setSelectedPage] = useState(1);

    useEffect(() => {
        if (countryList) {
            createCountriesLayout();
        }
    }, [countryList, followedCountryList, selectedPage]);

    const getNumberOfPages = () => {
        if (countryList?.length) {
            return Math.ceil(countryList.length / PAGE_LIMIT);
        }
        return 1;
    };

    const createCountriesLayout = () => {
        const createCountriesRow = countries => {
            return (
                <div key={countries.join('-')} className="row ml-2">
                    {countries.map(country => (
                        <div key={country}>
                            {country}
                            <CountryData
                                country={country}
                                followed={followedCountryList.includes(country)}
                                follow={follow}
                                unfollow={unfollow}
                                openCountry={openCountry}
                            />
                        </div>
                    ))}
                </div>
            );
        };

        const createCountriesGrid = (countries, col) => {
            const rows = [];
            let currRow = [];
            for (let i = 0; i < countries.length; i++) {
                currRow.push(countries[i]);
                if ((i + 1) % col === 0 || i === countries.length - 1) {
                    rows.push(createCountriesRow(currRow));
                    currRow = [];
                }
            }
            return rows.map(r => r);
        };

        const html = createCountriesGrid(
            countryList.slice((selectedPage - 1) * PAGE_LIMIT, selectedPage * PAGE_LIMIT),
            3
        );
        setRenderedCountryData(html);
    };

    return (
        <div>
            <h2>All Countries</h2>
            <div>{renderedCountryData}</div>
            <div>
                <Pagination pages={getNumberOfPages()} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
            </div>
        </div>
    );
}

export default CovidDataCountries;
