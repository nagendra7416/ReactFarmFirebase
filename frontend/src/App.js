import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import firebase from './firebase';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';

export default function App(){
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
        })
        return () => unsubscribe();
    }, [])

    return (
        <>
            <Routes>
                <Route path='/' exact element={<Home user={user} />}></Route>
                <Route path='/add' exact element={<AddProduct user={user} />}></Route>
                <Route path='/cart' exact element={<Cart user={user} />}></Route>
                <Route path='/checkout' exact element={<Checkout user={user} />}></Route>
                <Route path='/order/:orderid/success' exact element={<OrderSuccess user={user} />}></Route>
                <Route path='/login' exact element={<Login />}></Route>
                <Route path='/profile' exact element={<Profile user={user} />}></Route>
            </Routes>
        </>
    )
}