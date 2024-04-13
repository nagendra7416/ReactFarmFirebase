import { NavLink } from "react-router-dom";
import author from '../assets/author.png';
import firebase from "../firebase";
import LazyImage from "./LazyImage";
import { useEffect, useState } from "react";

export default function Navbar({ user }){
    const [cart, setCart] = useState(0);

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const currentuser = firebase.auth().currentUser;
                if(currentuser){
                    const db = firebase.firestore();
                    const cartRef = db.collection('carts').doc(user.uid);

                    cartRef.onSnapshot((snapshot) => {
                        const cartData = snapshot.data();

                        if (cartData) {
                            const totalItemsCount = cartData.totalItems || 0;
                            setCart(totalItemsCount);
                          } else {
                            setCart(0);
                          }
                    })
                }
            } catch (error){
                console.error(error);
            }
            
        }
        fetchCarts();

        return () => {
            const currentuser = firebase.auth().currentUser;
            if(user){
                const db = firebase.firestore();
                const cartRef = db.collection('carts').doc(user.uid);
                cartRef.onSnapshot(() => {});
            }
        }
        
    }, [user])
    return (
        <>
            <nav className="nav">
                <div className="inner">
                    <div className="left">
                        <div className="menu">
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"></path></svg>
                            </button>
                        </div>
                        <div className="logo">
                            <NavLink to='/'>
                                <img src="https://media.istockphoto.com/id/1394165144/vector/organic-food-labels-natural-meal-fresh-products-logo-ecology-farm-bio-food-vector-premium.jpg?b=1&s=612x612&w=0&k=20&c=lJo3K2ZcgVqk4ceqzf4vUQuCvsRVOG-uUCaBTv9DPeo=" alt="logo" />
                            </NavLink>
                        </div>
                    </div>
                    <div className="right">
                        <div className="links">
                            <ul>
                                <li>
                                    <NavLink to='/'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path></svg>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to='/cart'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M292.308-115.384q-25.308 0-42.654-17.347-17.347-17.346-17.347-42.654 0-25.307 17.347-42.653 17.346-17.347 42.654-17.347 25.307 0 42.654 17.347 17.346 17.346 17.346 42.653 0 25.308-17.346 42.654-17.347 17.347-42.654 17.347Zm375.384 0q-25.307 0-42.654-17.347-17.346-17.346-17.346-42.654 0-25.307 17.346-42.653 17.347-17.347 42.654-17.347 25.308 0 42.654 17.347 17.347 17.346 17.347 42.653 0 25.308-17.347 42.654-17.346 17.347-42.654 17.347ZM235.231-740 342-515.385h265.385q6.923 0 12.307-3.461 5.385-3.462 9.231-9.615l104.615-190.001q4.616-8.461.77-14.999Q730.462-740 721.231-740h-486Zm-19.539-40h520.77q26.077 0 39.231 21.269 13.153 21.269 1.384 43.808L662.769-506.615q-8.692 14.615-22.577 22.923-13.884 8.308-30.5 8.308H324l-48.615 89.23q-6.154 9.231-.385 20t17.308 10.769h435.385v40.001H292.308q-35 0-52.231-29.5-17.231-29.501-.846-59.27l60.153-107.231L152.307-820H80v-40h97.692l38 80ZM342-515.385h280-280Z"/></svg>
                                        <label>{cart}</label>
                                    </NavLink>
                                </li>
                                <li>
                                    {user && user.photoURL ? (
                                        <NavLink to='/profile'>
                                            <img src={user && user.photoURL ? user.photoURL : author} />
                                        </NavLink>
                                    ):(
                                        <button>
                                            <NavLink to='/login'>
                                                Login
                                            </NavLink>
                                        </button>
                                    )}
                                    
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}