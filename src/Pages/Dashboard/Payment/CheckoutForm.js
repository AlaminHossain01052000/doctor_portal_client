import { CircularProgress } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const CheckoutForm = ({ appointment }) => {
    const { price, patientName, _id } = appointment;
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [succcess, setSuccess] = useState("");
    const [proccessing, setProccessing] = useState(false);
    const { user } = useAuth();
    useEffect(() => {
        fetch("https://safe-anchorage-71063.herokuapp.com/create-payment-intent", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ price })
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret))
    }, [price])
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }
        setProccessing(true)
        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setError(error.message);
            setSuccess('');

        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setError('');
        }
        const { paymentIntent, errorConfirm } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: patientName,
                        email: user.email
                    },
                },
            },
        );
        if (errorConfirm) {
            setError(errorConfirm.message);
            setSuccess('');
        }
        else {
            setError('');
            setSuccess("Your Payment intended succesfully");
            setProccessing(false);
            console.log(paymentIntent);
            const payment = {
                amount: paymentIntent.amount,
                transitionEventId: paymentIntent.client_secret.split("_secret")[0],
                created: paymentIntent.created


            }
            fetch(`https://safe-anchorage-71063.herokuapp.com/appointments/${_id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(payment)
            })
                .then(res => res.json())
                .then(data => console.log(data))
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                {
                    proccessing ? <CircularProgress /> : <button type="submit" disabled={!stripe || succcess}>
                        Pay $ {price}
                    </button>
                }

            </form>
            {
                error && <p>{error}</p>
            }
            {
                succcess && <p>{succcess}</p>
            }
        </div>
    );
};

export default CheckoutForm;