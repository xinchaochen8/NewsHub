import React from 'react';

const RequestForm = ({ method, setMethod, url, setUrl, handleSubmit }) => {
    return (
        <form id="request-component">
            <label className="formHeader" htmlFor="method">HTTP Method:</label>
            <select
                id="method"
                name="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
            >
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
            </select>
            <br />
            <label className="formHeader" htmlFor="url">URL:</label>
            <input
                type="url"
                id="url"
                name="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <br />
            <button type="submit" onClick={handleSubmit}>
                Submit Request
            </button>
        </form>
    );
};

export default RequestForm;
