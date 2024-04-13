import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import firebase from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';


export default function Checkout({ user }){
    const [items, setItems] = useState([]);
    const [totalcost, setTotalCost] = useState(null);
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState({
        email: '',
        country: '',
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
    });

    useEffect(() => {
        const fetchCartItems = async () => {
            const db = firebase.firestore();

            try {
                const currentuser = firebase.auth().currentUser;
                if(currentuser){
                    const cartRef = db.collection('carts').doc(user.uid);
                    
                    cartRef.onSnapshot((snapshot) => {
                        const cartData = snapshot.data();
                        if (cartData && cartData.items) {
                            const items = cartData.items.filter((item) => item !== null);
                            setItems(items);
                            const total = items.reduce((total, item) => {
                                return total + item.quantity * item.productPrice;
                            }, 0);
                            setTotalCost(total);
                        } else {
                            setItems([]);
                            setTotalCost(0);
                        }
                    })
                }
            } catch(error){
                console.error(error);
            }
        }
        fetchCartItems();
    }, [user])

    const generateOrderID = () => {
        const min = 100000000000000;
        const max = 999999999999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            if(!shippingAddress.state || !shippingAddress.country || !shippingAddress.first_name || !shippingAddress.last_name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone || !shippingAddress.email){
                console.log('fill all the details');
                return;
            }
            const db = firebase.firestore();
            const orderRef = db.collection('orders');
            const orderID = generateOrderID();
            const newOrderRef = await orderRef.add({
                orderID: orderID,
                userId: user.uid,
                shippingAddress: shippingAddress,
                orderItems: items,
                totalcost: totalcost,
                paymentStatus: 'success',
                orderedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            const orderid = newOrderRef.id;

            const cartRef = db.collection('carts').doc(user.uid);
            await cartRef.update({
                items: [],
                totalItems: 0,
                totalCost: 0,
            });
            
                navigate(`/order/${orderid}/success`);
            
        } catch (error){
            console.error(error);
        }
    }
    return (
        <>
            <Helmet>
                <title>Checkout</title>
            </Helmet>
            <div className="navbar">
                <div className="inner">
                    <div className="left">
                        <NavLink to='/cart'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>
                        </NavLink>
                    </div>
                    <div className="center">
                        <NavLink to='/'>
                            <img src="https://media.istockphoto.com/id/1394165144/vector/organic-food-labels-natural-meal-fresh-products-logo-ecology-farm-bio-food-vector-premium.jpg?b=1&s=612x612&w=0&k=20&c=lJo3K2ZcgVqk4ceqzf4vUQuCvsRVOG-uUCaBTv9DPeo=" />
                        </NavLink>
                    </div>
                    <div className="right">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>
                    </div>
                </div>
            </div>


            {items && items.length > 0 ? (
            <section className="checkoutcon">
                <div className="inner">
                    <div className="checkleft">
                        <div className="checkleftinner">
                            <form onSubmit={handleCheckout}>
                                <h3>Contact</h3>
                                <div className="box email">
                                    <input type="text" placeholder="Email" value={shippingAddress.email} onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value})} required />
                                </div>

                                <h3>Delivery</h3>
                                <div className="box country">
                                    <input type="text" placeholder="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value})} required />
                                </div>
                                <div className="box name">
                                    <div className="box firstname">
                                        <input type="text" placeholder="First name" value={shippingAddress.first_name} onChange={(e) => setShippingAddress({ ...shippingAddress, first_name: e.target.value})} required />
                                    </div>
                                    <div className="box lastname">
                                        <input type="text" placeholder="Last name" value={shippingAddress.last_name} onChange={(e) => setShippingAddress({ ...shippingAddress, last_name: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="box address">
                                    <input type="text" placeholder="Address" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value})} required />
                                </div>
                                <div className="box citystatepin">
                                    <div className="box city">
                                        <input type="text" placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value})} required />
                                    </div>
                                    <div className="box state">
                                        <input type="text" placeholder="State" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value})} required />
                                    </div>
                                    <div className="box pincode">
                                        <input type="number" placeholder="Pincode" value={shippingAddress.pincode} onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="box phone">
                                    <input type="text" placeholder="Phone" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value})} required />
                                </div>

                                <h3>Payment</h3>
                                <div className="box cashondelivery">
                                    <input type="radio" name="cashondelivery" defaultChecked />
                                    <label>Cash on Delivery</label>
                                </div>

                                <div className="placeorder">
                                    <button type="submit">Place order</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="checkright">
                        <div className="checkrightinner">
                            <div className="checkoutitems">
                                {items && items.map((item, index) => (
                                    <div className="checkoutitem" key={index}>
                                        <div className="checkoutleft">
                                            <div className="checkoutimg">
                                                <label>{item.quantity}</label>
                                                <img src={item && item.productImage} />
                                            </div>
                                            <div className="checkoutdetail">
                                                <label>{item && item.productName}</label>
                                            </div>
                                        </div>
                                        <div className="checkoutright">
                                            <span>₹ {item && Number(item.costPerQuantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="checkouttotal">
                                <div>
                                    <label>Subtotal</label>
                                    <label>₹{totalcost && Number(totalcost).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</label>
                                </div>
                                <div>
                                    <label>Shipping</label>
                                    <label>FREE</label>
                                </div>
                                <div>
                                    <span>Total</span>
                                    <span>₹{totalcost && Number(totalcost).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            ):(
                navigate('/cart')
            )}


        </>
    )
}