import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'
import {navigate} from 'hookrouter';

function Login() {



    const auth = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();

        const form = document.getElementById('signin');
        const name = form.elements['username'].value;
        const password = form.elements['password'].value;
        try {
            let user = await auth.signin(name, password);
            //alert(JSON.stringify(user));
            navigate('/products');
        }
        catch(error) {
            alert("Wrong creds");
        }
    }

    return (
        <div className="bg-green-200 h-px:500 p-6 rounded-xl">
            <form id="signin" className="flex flex-col space-y-4 justify-center items-center w-auto" onSubmit={handleLogin}>
                <div className="flex">
                    <label htmlFor="username" className=" pr-1">Username: </label>
                    <input name="username" className="bg-green-100 rounded-sm w-60"></input>
                </div>
                <div className="flex">
                    <label htmlFor="password" className="pr-1">Password: </label>
                    <input name="password" type="password" className="bg-green-100 rounded-sm w-60"></input>
                </div>
                <button className="bg-green-300 rounded p-2">Sign In</button>
            </form>
        </div>
    )
}

export default Login;