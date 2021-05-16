import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'

import {navigate} from 'hookrouter';

function BranchListView() {
    const auth = useAuth();
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        async function f() {
            const response = await fetch('http://localhost:3001/api/branches/1/1', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': `${auth.user['username']} ${auth.user['token']}`|| ''
                },
            });
            if(!response.ok) {
                return setBranchList([])
            }
            let data = await response.json();
            setBranchList(data);
        }
        if(auth.user != null) {
            f();
        }
        return () => {
            //cleanup
        }
    }, []);
    
    let postBranch = async () => {
        const randomName = Math.random().toString(36).substring(7);
        const res = await fetch('http://localhost:3001/api/branches' ,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${auth.user['username']} ${auth.user['token']}`|| ''
            },
            body: JSON.stringify({"branch_name": randomName, "password": randomName})
        });
        const response = await fetch('http://localhost:3001/api/branches/1/1', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `${auth.user['username']} ${auth.user['token']}`|| ''
            },
        });
        if(!response.ok) {
            return setBranchList([]);
        }
        let data = await response.json();
        setBranchList(data);
    };

    if(auth.user == null) {
        console.log("XD");
        navigate("/", true);
        return null;
    }

    return (
        <div className="w-3/4">
            
            <div className="max-h-75vh overflow-y-scroll">
                <ul className="bg-green-100">
                <li>ID | Branch name</li>
                {branchList.map((b) => {return <li key={b.branch_id}>{b.branch_id} | {b.branch_name}</li>})}
                </ul>
            </div>
            <p className='text-white'>Logged in as {auth.user["username"]}</p>
           
            <button className="bg-green-300 rounded p-2" onClick={postBranch}>Post</button>
        </div>
    );

}

export default BranchListView;