import React, { useState, useEffect } from 'react';
import './request.css';
import { set } from 'mongoose-int32';



const RequestForm2 = () => {
    const [url, setUrl] = useState("/db");
    const [body, setBody] = useState("");
    const methods = ["GET", "POST", "PUT", "DELETE"];

    useEffect(() => {
        setUrl(`/db/${body}`);
    }, [body]);

    const handleChange = (event) => {
        setBody(event.target.value);
    }
    const handleSubmit = (method, event) => {
        event.preventDefault();
        setUrl(`/db/${body}`);
        if (method === "POST") {
            if (body !== "" && body !== "0") {
                alert("Body should be empty or 0 for POST");
            } else {
                alert("POST activated");
            }
        }

        if (body === "0" && method !== "POST") {
            setBody("");
        }

        if (method === "DELETE") {
            if (body === "") {
                alert("Can't delete without valid document number");
            }
        }

        if (method === "PUT") {
            alert("Put activated");
        }

        fetch(url, {
            method: method
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error(error));
    }

    return (
        <form id="request-component">
            <label className="formHeader" htmlFor="method">Data Base Form</label>

            <label className="formHeader" htmlFor="body">Body:</label>
            <input
                type="body"
                id="body"
                name="body"
                placeholder="Enter Body"
                value={body}
                onChange={handleChange}
            />
            <div className="requestButtonSet">
            {
                methods.map((item, index) => (
                    <button
                        key={index}
                        onClick={(e) => handleSubmit(item, e)}
                    >
                        {item}
                    </button>
                ))
            }
            </div>
        </form>
    )

}

export default RequestForm2;