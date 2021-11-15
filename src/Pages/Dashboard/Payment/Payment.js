import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51JvnacKB2JOo4D0XAUdhDzZ6TqtmGp2vpGMIXXSxtPKBJOo1cmcb3SlAga09S4J9nyLpCgs4dEyJ126BbM8sE1mm00BCQsgnSt');

const Payment = () => {
    const [appointment, setAppointment] = useState({});
    const { id } = useParams();
    useEffect(() => {
        fetch(`https://safe-anchorage-71063.herokuapp.com/appointments/${id}`)
            .then(res => res.json())
            .then(data => setAppointment(data))
    }, [id])
    console.log(appointment)
    return (
        <div>
            <h1>{appointment.patientEmail}</h1>
            <h1>{appointment.patientName}</h1>
            <h1>{appointment.treatmentName}</h1>
            <h1>$ {appointment.price}</h1>
            <Elements stripe={stripePromise}>
                <CheckoutForm appointment={appointment} />
            </Elements>
        </div>
    );
};

export default Payment;