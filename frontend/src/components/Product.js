import { NavLink } from "react-router-dom";
import LazyImage from "./LazyImage";
import firebase from "../firebase";

export default function Product({ product, author, index }){

    const addToCart = async () => {
        try {
            const user = firebase.auth().currentUser;
            if(user){
                const db = firebase.firestore();
                const cartRef = db.collection('carts').doc(user.uid);
                const cartDoc = await cartRef.get();

                if(cartDoc.exists){
                    const cartData = cartDoc.data();
                    const existingItem = cartData.items.find((item) => item.productId === product.id);

                    if (existingItem) {
                        const updatedItems = cartData.items.map((item) =>
                            item.productId === product.id ? { ...item, quantity: item.quantity + 1, costPerQuantity: (item.quantity + 1)*item.productPrice } : item
                        );

                        const updatedTotalItems = cartData.totalItems + 1;
                        const updatedTotalCost = cartData.totalCost + parseFloat(product.actualprice);

                        await cartRef.update({
                            items: updatedItems,
                            totalItems: updatedTotalItems,
                            totalCost: updatedTotalCost,
                        });
                    } else {
                        const newTotalItems = cartData.totalItems + 1;
                        const newTotalCost = cartData.totalCost + parseFloat(product.actualprice);

                        await cartRef.update({
                            items: firebase.firestore.FieldValue.arrayUnion({
                                productId: product.id,
                                productName: product.name,
                                productPrice: product.actualprice,
                                productImage: product.image,
                                quantity: 1,
                                costPerQuantity: 1 * product.actualprice
                            }),
                            totalItems: newTotalItems,
                            totalCost: newTotalCost,
                        });
                    }
                } else {
                    await cartRef.set({
                        userId: firebase.auth().currentUser.uid,
                        items: [
                            {
                                productId: product.id,
                                productName: product.name,
                                productPrice: product.actualprice,
                                productImage: product.image,
                                quantity: 1,
                                costPerQuantity: 1 * product.actualprice
                            }
                        ],
                        totalItems: 1,
                        totalCost: parseFloat(product.actualprice),
                    })
                }
            } else {
                console.log('user is not authenticated');
            }
        } catch (error){
            console.error(error);
        }
    }
    return (
        <>
            <div className="product" key={index}>
                <div className="product-img">
                    {product && product.offer ? (<label>{product.offer}% off</label>):(<></>)}
                    
                    <NavLink to='/'>
                        <LazyImage src={author} data-real-src={product.image} />
                    </NavLink>
                </div>
                <div className="product-detail">
                    <h2>{product.name}</h2>
                    <div>
                        <label>₹ {product.actualprice}</label>
                        <label style={{textDecoration: 'line-through', opacity: '0.7', marginLeft: '8px'}}>₹ {product.price}</label>
                    </div>
                    <span style={{fontWeight: 'bold'}}>{product.inventory > 0 ? <label style={{color: 'green'}}>In stock</label>:<label style={{color: 'red'}}>Out of stock</label>}</span>
                    {product && product.inventory > 0 ? (
                        <button onClick={addToCart}>Add to Cart</button>
                    ):(
                        <></>
                    )}
                    
                </div>
            </div>
        </>
    )
}