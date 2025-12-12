export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const initializeRazorpay = (order, userDetails, onSuccess, onFailure) => {
    const options = {
        key: "rzp_live_RqMHmqwqUFi5p3",
        amount: order.amount,
        currency: order.currency,
        name: 'New Year Celebration 2025',
        description: 'Ticket Booking',
        order_id: order.orderId,
        handler: async function (response) {



            console.log(response)
            try {
                await onSuccess({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    ...userDetails
                });
            } catch (error) {
                console.log(error, "error ");
                onFailure(error.message);
            }
        },
        prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone,
        },
        notes: {
            ticketCount: userDetails.ticketCount,
            event: 'New Year Celebration 2025'
        },
        theme: {
            color: '#3399cc'
        },
        modal: {
            ondismiss: function () {
                onFailure('Payment cancelled by user');
            }
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

};
