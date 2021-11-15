import React, { useState } from 'react';
import "./AddDoctor.css";
const AddDoctor = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState('');
    const handleDoctorInfo = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        // Attach file
        formData.append('image', image[0]);

        fetch("https://safe-anchorage-71063.herokuapp.com/doctors", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    setSuccess('Doctor is added successfully');
                }
            })
    }
    return (
        <div>
            <h1>Add a doctor</h1>
            <form onSubmit={handleDoctorInfo} style={{ width: '75%', margin: "0 auto" }}>
                <input
                    type="text"
                    className="doctor-input-field"
                    name="name"
                    onChange={e => setName(e.target.value)}
                    placeholder="name"
                    required
                ></input>
                <input
                    text="email"
                    className="doctor-input-field"
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email"
                    required
                ></input>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImage(e.target.files)}
                >

                </input>
                <input type="submit" value="Add a doctor" style={{ display: 'block', padding: "10px 20px", margin: "10px auto", background: "goldenrod", fontSize: "16px", borderRadius: "10px", outline: "0", borderWidth: "0" }} />
            </form>
            {
                success && <h3>{success}</h3>
            }
        </div>
    );
};

export default AddDoctor;