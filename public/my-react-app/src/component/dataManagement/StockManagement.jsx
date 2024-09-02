import React, { useState, useEffect } from 'react';
import "./StockManagement.css"

const StockManagement = () => {
  const [data, setData] = useState([]);
  const [endPoint, setEndPoint] = useState("/stock");
  const [formData, setFormData] = useState({});
  // const [id, setId] = useState('');
  const [body, setBody] = useState('');
  const [activeForm, setActiveForm] = useState(1);

  useEffect(() => {
    setFormData({ body });
  }, [ body]);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGet = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${endPoint}/${body}`);
      const data = await response.json();
      alert(data.message);
      setBody(data.body);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${endPoint}/${body}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${endPoint}/${body}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'id') {
      // setId(e.target.value);
    } else {
      setBody(e.target.value);
    }
  };

  const toggleForm = () => {
    setActiveForm(activeForm === 1 ? 2 : 1);
    setEndPoint(endPoint === "/stock" ? "part3" : "/stock");
  };

  return (
    <div className="stock-management">
      <button onClick={toggleForm} className='switch-button'>Switch Form</button>
      <h1 className="stock-management-title">Stock Management</h1>

      {activeForm === 1 ? (
        <form className='stock-management-form'>
          {/* <input type="text" name="id" placeholder='Request ID' value={id} onChange={handleInputChange} /> */}
          <input type="text" name="body" placeholder="Request Body" value={body} onChange={handleInputChange} />
          <div>
            <button onClick={handleCreate}>POST</button>
            <button onClick={handleGet}>GET</button>
            <button onClick={handleUpdate}>PUT</button>
            <button onClick={handleDelete}>DELETE</button>
          </div>
        </form>
      ) : (
        <form className='stock-management-form'>
          <input type="text" name="body" placeholder="Request Body" value={body} onChange={handleInputChange} />
          <div>
            <button onClick={handleGet}>GET</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StockManagement;
