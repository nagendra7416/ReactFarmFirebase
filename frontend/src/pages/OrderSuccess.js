import { useEffect, useState } from "react"
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import firebase from "../firebase";
import { formatTimestamp } from "../components/formatTimestamp";

export default function OrderSuccess(){
    const { orderid } = useParams();
    const [orderdetails, setOrderDetails] = useState(null);
    const [address, setAddress] = useState(null);
    const [items, setItems] = useState(null);
    const [totalcost, setTotalCost] = useState(0);
    const [inventoryUpdated, setInventoryUpdated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if(!orderid){
                return;
            }
            try {
                const db = firebase.firestore();
                const orderRef = db.collection('orders').doc(orderid);

                const doc = await orderRef.get();
                if (doc.exists) {
                    const orderData = doc.data();
                    setOrderDetails(orderData);
                    setAddress(orderData.shippingAddress);
                    setItems(orderData.orderItems);
                    setTotalCost(orderData.totalcost);

                    if (orderData.orderItems && orderData.orderItems.length > 0) {
                        const inventoryUpdated = localStorage.getItem(`inventoryUpdated_${orderid}`);

                        if (!inventoryUpdated) {
                            const batch = db.batch();

                            for (const item of orderData.orderItems) {
                                const productRef = db.collection('products').doc(item.productId);
                                const productDoc = await productRef.get();

                                if (productDoc.exists) {
                                    const currentQuantity = productDoc.data().inventory;
                                    const orderedQuantity = item.quantity;

                                    if (currentQuantity >= orderedQuantity) {
                                        const newQuantity = currentQuantity - orderedQuantity;
                                        batch.update(productRef, { inventory: newQuantity });
                                        console.log(`Inventory updated for product ${item.productId}`);
                                    } else {
                                        console.log(`Insufficient inventory for product ${item.productId}`);
                                    }
                                }
                            }

                            await batch.commit();
                            localStorage.setItem(`inventoryUpdated_${orderid}`, true);
                            console.log('Inventory updated successfully.');
                            setInventoryUpdated(true);
                        } else {
                            console.log('Inventory already updated for this order.');
                            setInventoryUpdated(true);
                        }
                    }
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchOrderDetails();
    }, [orderid, navigate])
    return (
        <>
            <div className="navbar">
                <div className="inner">
                    <div className="left">
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>
                        </a>
                    </div>
                    <div className="center">
                        <a href="#">
                            <img src="https://media.istockphoto.com/id/1394165144/vector/organic-food-labels-natural-meal-fresh-products-logo-ecology-farm-bio-food-vector-premium.jpg?b=1&s=612x612&w=0&k=20&c=lJo3K2ZcgVqk4ceqzf4vUQuCvsRVOG-uUCaBTv9DPeo=" />
                        </a>
                    </div>
                    <div className="right">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>
                    </div>
                </div>
            </div>


            <section className="checkoutcon">
                <div className="inner" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <div className="ordersuccessnotif">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m360.923-110.769-66.769-112.615-127.077-27.385 12.461-131.077L93.846-480l85.692-98.154-12.461-131.077 127.077-27.385 66.769-112.615L480-798.923l119.077-50.308 66.769 112.615 127.077 27.385-12.461 131.077L866.154-480l-85.692 98.154 12.461 131.077-127.077 27.385-66.769 112.615L480-161.077l-119.077 50.308ZM378-162l102-42.462L582.462-162 640-258l110-24.462L740-396l74-84-74-84.462L750-678l-110-24-58-96-102 42.462L377.538-798 320-702l-110 24 10 113.538L146-480l74 84-10 114 110 24 58 96Zm102-318Zm-42 114.308L636.308-564 608-592.769l-170 170-86-85.539L323.692-480 438-365.692Z"/></svg>
                        <div className="note">
                            <label><span>THANK YOU!</span> Your order has been placed</label>
                            <span>Order ID: #{orderdetails && orderdetails.orderID}</span>
                            <NavLink to='/' style={{marginTop: '10px', textDecoration: 'none'}}>Go to My Orders page</NavLink>
                        </div>
                    </div>
                    <div className="orderdetails">
                        <h3>Order details</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan="1"><label>Order details</label></th>
                                </tr>
                                <tr>
                                    <td colSpan="4"><label>Order ID: #{orderdetails && orderdetails.orderID}</label></td>
                                    <td colSpan="1"><label>Payment Method: Cash</label></td>
                                </tr>
                                <tr>
                                    <td colSpan="4"><label>Ordered on: {orderdetails && formatTimestamp(orderdetails.orderedAt)}</label></td>
                                    <td colSpan="1"><label>Shipping Method: Free</label></td>
                                </tr>
                            </tbody>
                        </table>


                        <table style={{marginTop: '40px'}} id="shippingaddress">
                            <tbody>
                                <tr>
                                    <th colSpan="1"><label>Shipping address (This details will be printed on the Package)</label></th>
                                </tr>
                                <tr>
                                    <td colSpan="1" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                        <label>{address && address.first_name} {address && address.last_name}</label>
                                        <label>{address && address.address}</label>
                                        <label>{address && address.pincode}</label>
                                        <label>{address && address.city}</label>
                                        <label>{address && address.state}</label>
                                        <label>{address && address.country}</label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table style={{marginTop: '40px'}} id="orderdetail">
                            <tbody>
                                <tr>
                                    <th><label></label></th>
                                    <th><label>Product</label></th>
                                    <th><label>Price</label></th>
                                    <th><label>Quantity</label></th>
                                    <th><label>Total (per quantity)</label></th>
                                </tr>
                                {items && items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <label style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <div className="orderimg">
                                                    <img src={item && item.productImage} />
                                                </div>
                                            </label>
                                        </td>
                                        <td><label>{item && item.productName}</label></td>
                                        <td><label>₹{item && Number(item.productPrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</label></td>
                                        <td><label>{item && item.quantity}</label></td>
                                        <td><label>₹{item && Number(item.costPerQuantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</label></td>
                                    </tr>
                                ))}
                                
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><label>Subtotal</label></td>
                                    <td><label>₹{totalcost && Number(totalcost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</label></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}