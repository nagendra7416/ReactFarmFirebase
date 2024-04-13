import { useEffect } from "react";
import Navbar from "../components/Navbar";
import firebase from "../firebase";
import { useNavigate } from 'react-router-dom'; 
import Helmet from 'react-helmet';

export default function Login(){
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if(user){
                navigate('/');
            }
        })
        return () => unsubscribe();
    }, [navigate])

    const signInWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await firebase.auth().signInWithPopup(provider);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();
    }
    return (
        <>
            <Helmet>
                <title>Login | Farm</title>
            </Helmet>
            <Navbar />

            <section className="logincon" style={{marginTop: '70px'}}>
                <form onSubmit={handleLogin}>
                    <button onClick={signInWithGoogle}>Login with Google</button>
                </form>
            </section>
        </>
    )
}