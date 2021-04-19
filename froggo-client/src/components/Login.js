import React, { useState, useEffect } from 'react';

function Login() {

    return (
        <div className="bg-green-200 h-px:500">
            <form className="flex flex-col space-y-4 justify-center items-center pt-4 pb-4 w-auto">
                <div className="flex">
                    <label for="username" className=" text-white pr-1">Username: </label>
                    <input name="username" className="bg-green-100 rounded-sm w-60"></input>
                </div>
                <div className="flex">
                    <label for="password" className=" text-white pr-1">Password: </label>
                    <input name="password" className="bg-green-100 rounded-sm w-60"></input>
                </div>
                <button className="bg-green-300 rounded p-2">Sign In</button>
            </form>
        </div>
    )
}

export default Login;