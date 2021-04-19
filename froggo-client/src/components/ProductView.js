import React, { useState, useEffect } from 'react';

function ProductView() {

    const [branchList, setBranchList] = useState([]);

    useEffect( () => {
        async function f() {
            const response = await fetch('http://localhost:3001/branches', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': 'frogger ' + (sessionStorage.getItem('JWT_Token') || '')
                },
            });
            console.log(response)
            if(!response.ok) {
                return setBranchList([])
            }
            let data = await response.json();
            setBranchList(data);
        }
        f();
        return () => {
            //cleanup
        }
    }, []);
    
    let postBranch = async () => {
        const res = await fetch('http://localhost:3001/branches' ,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'frogger ' + sessionStorage.getItem('JWT_Token')
            },
            body: JSON.stringify({"branch_name": Math.random().toString(36).substring(7)})
        });
        const response = await fetch('http://localhost:3001/branches', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'frogger ' + (sessionStorage.getItem('JWT_Token') || '')
            },
        });
        console.log(response);
        if(!response.ok) {
            return setBranchList([]);
        }
        let data = await response.json();
        console.log(data);
        setBranchList(data);
    };

    let getJWT = async () => {
        const res = await fetch('http://localhost:3001/api/gettoken' ,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username": "froggers"})
        });
        let r = await res.json();
        sessionStorage.setItem('JWT_Token', r);
    };

    return (
        <div className="w-3/4">
            <div className="max-h-75vh overflow-y-scroll">
                <ul className="bg-green-100">
                <li>ID | Branch name</li>
                {branchList.map((b) => {return <li>{b.branch_id} | {b.branch_name}</li>})}
                </ul>
            </div>
            <button className="bg-green-300 rounded p-2" onClick={postBranch}>Post</button>
            <p className="text-white text-xs">Token: {sessionStorage.getItem('JWT_Token') || 'No Token acquired'}</p>
            <button className="bg-green-300 rounded p-2" onClick={getJWT}>Get Token</button>
        </div>
    );

}

export default ProductView;