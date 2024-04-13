import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Helmet from 'react-helmet';
import firebase from '../firebase';
import author from '../assets/author.png';
import { NavLink } from 'react-router-dom';

export default function Cart({ user }){
    const [items, setItems] = useState([]);
    const [totalcost, setTotalCost] = useState(null);

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



    const updateQuantity = async (itemId, newQuantity) => {
        const db = firebase.firestore();
        const currentuser = firebase.auth().currentUser;
        try {
            if(currentuser){
                const cartRef = db.collection('carts').doc(currentuser.uid);
                const cartDoc = await cartRef.get();
                

                if(cartDoc.exists){
                    const cartData = cartDoc.data();
                    let updatedItems = cartData.items.map((item) => {
                        if (item.productId === itemId) {
                            if (newQuantity > 0) {
                                return {
                                    ...item,
                                    quantity: newQuantity,
                                    costPerQuantity: newQuantity * item.productPrice,
                                };
                            } else {
                                return null;
                            }
                        }
                        return item;
                    });

                    updatedItems = updatedItems.filter((item) => item !== null);

                    const updatedTotalCost = updatedItems.reduce(
                        (total, item) => total + item.quantity * item.productPrice,
                        0
                    );
                    const updatedTotalItems = updatedItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                    );
                    await cartRef.update({
                        items: updatedItems,
                        totalCost: updatedTotalCost,
                        totalItems: updatedTotalItems,
                    });
                }
            } else {
                console.log('user is not authenticated');
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const decreaseQuantity = async (itemId) => {
        const itemToUpdate = items.find((item) => item.productId === itemId);

        if (itemToUpdate && itemToUpdate.quantity > 0) {
            const newQuantity = itemToUpdate.quantity - 1;
            await updateQuantity(itemId, newQuantity);
        }
    }

    const increaseQuantity = async (itemId) => {
        
        const itemToUpdate = items.find((item) => item.productId === itemId);
        if (itemToUpdate) {
            const newQuantity = itemToUpdate.quantity + 1;
            await updateQuantity(itemId, newQuantity);
        }
    }



    return (
        <>
            <Helmet>
                <title>Cart | Farm</title>
            </Helmet>
            <Navbar user={user} />
            <section className="cartcon">
                {items && items.length > 0 ? (
                    <>
                        <h2>Cart</h2>
                        <div className="inner">
                            <div className="cartleft">
                                <div className="items">
                                    <div className="item header">
                                        <div className="productname">
                                            <label>Product</label>
                                        </div>
                                        <div className="quantity">
                                            <label>Quantity</label>
                                        </div>
                                        <div className="total">
                                            <label>Total</label>
                                        </div>
                                    </div>
                                    {items && items.length > 0 ? (
                                        <>
                                            {items.map((item, index) => (
                                                <div className="item i" key={index} cart_id={item.id}>
                                                    <div className="productname">
                                                        <div className="productinner">
                                                            <div className="innerimg">
                                                                <img src={item.productImage ? item.productImage : author} />
                                                            </div>
                                                            <div className="innerdetail">
                                                                <label>{item.productName}</label>
                                                                <div>
                                                                    <span>Rs: {Number(item.productPrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                                                    {/* <span>Rs: 399</span> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="quantity">
                                                        <div className="actions">
                                                            <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                                                            <label>{item.quantity}</label>
                                                            <button onClick={() => increaseQuantity(item.productId)}>+</button>
                                                        </div>
                                                    </div>
                                                    <div className="total">
                                                        <label>Rs: {Number(item.costPerQuantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ):(
                                        <label>Empty Cart</label>
                                    )}
                                    
                                    
                                </div>
                            </div>
                            <div className="cartright">
                                <div className="cartrightinner">
                                    <div>
                                        <label>Subtotal</label>
                                        <label>Rs: {totalcost ? Number(totalcost).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0'}</label>
                                    </div>
                                    <div className="total">
                                        <label>Total</label>
                                        <label>Rs: {totalcost ? Number(totalcost).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0'}</label>
                                    </div>
                                    {items && items.length > 0 ? (
                                        <button>
                                            <NavLink to='/checkout'>
                                                Checkout
                                            </NavLink>
                                        </button>
                                    ):(
                                        <label></label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ):(
                    <div className='inner'>
                        <h2 style={{marginTop: '70px'}}>Shopping cart is empty</h2>
                    </div>
                )}
                
            </section>
        </>
    )
}