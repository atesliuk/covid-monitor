import { useState, useEffect } from 'react';

import WorldData from './WorldData';
import CovidDataCountries from './CovidDataCountries';
import FollowedCountries from './FollowedCountries';
import CountryModal from './CountryModal';

function MainScreen() {
    const [followedCountryList, setFollowedCountryList] = useState();
    const [countryList, setCountryList] = useState();
    const [modalCountry, setModalCountry] = useState();
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        updateCountryList();
        updateFollowedCountries();
    }, []);

    const updateFollowedCountries = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/listOfCountries', {
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
                    console.error('Some server error occured');
                    return;
                }
                setCountryList(data.countries);
            })
            .catch(err => {
                console.error('Some server error occured');
            });
    };

    const updateCountryList = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/getProfile', {
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
                    console.error('Some server error occured');
                    return;
                }
                setFollowedCountryList(data.followedCountries);
            })
            .catch(err => {
                console.error('Some server error occured');
            });
    };

    const follow = country => {
        followOrUnfollowCountry(country, 'followCountry');
    };

    const unFollow = country => {
        followOrUnfollowCountry(country, 'unfollowCountry');
    };

    const followOrUnfollowCountry = (countryName, action) => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/' + action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({ countryName: countryName }),
        })
            .then(res => res.json())
            .then(data => {
                if (data?.message) {
                    console.error('Some server error occured');
                    return;
                }
                setFollowedCountryList(data.followedCountries);
            })
            .catch(err => {
                console.error('Some server error occured');
            });
    };

    const openCountry = country => {
        setModalCountry(country);
        setModalShow(true);
    };

    return (
        <div>
            <WorldData />
            <hr />
            <FollowedCountries
                followedCountryList={followedCountryList}
                follow={follow}
                unfollow={unFollow}
                openCountry={openCountry}
            />
            <hr />
            <CovidDataCountries
                countryList={countryList}
                followedCountryList={followedCountryList}
                follow={follow}
                unfollow={unFollow}
                openCountry={openCountry}
            />
            <CountryModal show={modalShow} onHide={() => setModalShow(false)} countryName={modalCountry} />
        </div>
    );
}

export default MainScreen;
