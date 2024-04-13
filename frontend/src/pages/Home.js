import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Slider from '../components/Slider';
import Helmet from 'react-helmet';
import { NavLink } from 'react-router-dom';
import firebase from '../firebase';
import author from '../assets/placeholder.jpg';
import LazyImage from '../components/LazyImage';
import Product from '../components/Product';

export default function Home({ user }){
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const db = firebase.firestore();
                const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
                const productsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setProducts(productsData.slice(0, 6));
            } catch (error) {
                console.error(error);
            }
        }
        fetchProducts();
    }, [])
    return (
        <>
            <Helmet>
                <title>Home | Farm</title>
            </Helmet>
            <Navbar user={user} />
            <Slider />

            <section className="productscon">
                <h2>Recently Launched</h2>
                <div className="products">
                    {products && products.length <= 4 ? (
                        <>
                            {products && products.map((product, index) => (
                                <Product product={product} index={index} author={author} />
                            ))}
                            <div className='product'></div>
                            <div className='product'></div>
                            <div className='product'></div>
                            <div className='product'></div>
                            <div className='product'></div>
                        </>
                    ):(
                        <>
                            {products && products.map((product, index) => (
                                <Product product={product} index={index} author={author} />
                            ))}
                        </>
                    )}
                </div>
            </section>

            <section className="banner">
                
            </section>
        </>
    )
}