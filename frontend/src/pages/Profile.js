import Navbar from "../components/Navbar";
import Helmet from 'react-helmet';

export default function Profile({ user }){
    return (
        <>
            <Helmet>
                <title>Profile | Farm</title>
            </Helmet>
            <Navbar user={user} />
            <section className="slider-container">
                <h1>Profile</h1>
            </section>
            <h1>{user && user.displayName}</h1>
        </>
    )
}