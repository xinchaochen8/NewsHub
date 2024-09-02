import React, { useState } from 'react';
import './request.css';
import RequestForm from './RequestForm';
import RequestForm2 from './RequestForm2';

const Request = () => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [activeForm, setActiveForm] = useState(1);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(url, { method: method })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error(error));
    };

    const toggleForm = () => {
        setActiveForm(activeForm === 1 ? 2 : 1);
    };

    return (

        <div className="request-component">
            <button onClick={toggleForm} className='switch-button'>Switch Form</button>

            {activeForm === 1 ? (
                <RequestForm2 />

            ) : (
                <RequestForm
                    method={method}
                    setMethod={setMethod}
                    url={url}
                    setUrl={setUrl}
                    handleSubmit={handleSubmit}
                />

            )}
        </div>
    );
};

export default Request;
