import React, { useEffect, useState } from 'react';
import Navbar from '../../Component/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); 
        if (storedUser) {
            setUserInfo(storedUser); // Set user info if found
        }
    }, []);

    function handleLogin() {
        navigate('/login');
    }

    function handleSignup() {
        navigate('/signup');
    }

    return (
        <>
            {userInfo ? (
                <Navbar userInfo={userInfo} />
            ) : (
                <div className="h-96 w-screen flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold">Create Your Notes</h1>
                    <div className="h-56 w-80 flex justify-center items-center gap-5 mt-5">
                        <button className="btn-primary py-3 text-2xl" onClick={handleSignup}>Sign Up</button>
                        <button className="btn-primary py-3 text-2xl" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default MainPage;
