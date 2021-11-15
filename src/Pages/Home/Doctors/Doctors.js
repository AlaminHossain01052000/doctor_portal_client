import React, { useEffect, useState } from 'react';
import Doctor from '../Doctor/Doctor';
import { Container, Grid } from '@mui/material';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        fetch("https://safe-anchorage-71063.herokuapp.com/doctors")
            .then(res => res.json())
            .then(data => setDoctors(data))
    }, [])
    return (
        <div>
            <Container>
                <Grid container>
                    {
                        doctors.map(doctor => <Doctor
                            doctor={doctor}
                            key={doctor._id}
                        >


                        </Doctor>)
                    }
                </Grid>
            </Container>
        </div>
    );
};

export default Doctors;