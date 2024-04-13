import { useState } from 'react';
import firebase from '../firebase';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function AddProduct(){
    const [productname, setProductName] = useState('');
    const [productprice, setProductPrice] = useState('');
    const [productimage, setProductImage] = useState(null);
    const [productoffer, setProductOffer] = useState('');
    const [productinventory, setProductInventory] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if(e.target.files[0]){
            setProductImage(e.target.files[0]);
        }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            const storageRef = firebase.storage().ref(`productImages/${productimage.name}`);
            const snapshot = await storageRef.put(productimage);
            const imageUrl = await snapshot.ref.getDownloadURL();

            const db = firebase.firestore();

            const price = parseFloat(productprice);
            const offer = parseFloat(productoffer);
            const discountedPrice = (1 - offer / 100) * price;
            const actualPrice = Math.round(discountedPrice);

            await db.collection('products').add({
                name: productname,
                price: parseFloat(productprice),
                actualprice: actualPrice,
                image: imageUrl,
                offer: productoffer,
                inventory: productinventory,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

            setProductName('');
            setProductPrice('');
            setProductImage(null);
            setProductOffer('');
            setProductInventory('');

            navigate('/');
        } catch (error){
            console.error(error);
        }
    }

    return (
        <>
            <Navbar />
            <h2 style={{marginTop: '70px'}}>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
                <label>
                    Product Name: 
                    <input type='text' value={productname} onChange={(e) => setProductName(e.target.value)} />
                </label>
                <br />
                <label>
                    Product Price: 
                    <input type='text' value={productprice} onChange={(e) => setProductPrice(e.target.value)} />
                </label>
                <br />
                <label>
                    Product Image: 
                    <input type='file' onChange={handleImageChange} />
                </label>
                <br />
                <label>
                    Product Offer: 
                    <input type='text' value={productoffer} onChange={(e) => setProductOffer(e.target.value)} />
                </label>
                <br />
                <label>
                    Product Inventory: 
                    <input type='text' value={productinventory} onChange={(e) => setProductInventory(e.target.value)} />
                </label>
                <br />
                <button type='submit'>Add Product</button>
            </form>
        </>
    )
}