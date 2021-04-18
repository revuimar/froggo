import React, { useState, useEffect } from 'react';

async function fetchAndDecodeJson(url) {
    const response = await fetch(url);
    return response.json();
}


function ProductView() {

    const [branchList, setBranchList] = useState([]);

    useEffect( () => {
        async function f() {
            let data = await fetchAndDecodeJson('http://localhost:3001/branches');
            setBranchList(data);
        }
        f();
        return () => {
            //cleanup
        }
    }, []);

    let generateRandomBranches = (length) => {
        return [...Array(length).keys()]
            .map((idx) => {return {
                "branch_id": idx, 
                "branch_name": Math.random().toString(36).substring(7)
            }; 
        });
    };

    
    let postBranch = async () => {
        const res = await fetch('http://localhost:3001/branches' ,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"branch_name": Math.random().toString(36).substring(7)})
        });
        return res.json();
    };

    return (
        <>  
            <ul>
            <li>ID | Branch name</li>
            {branchList.map((b) => {return <li>{b.branch_id} | {b.branch_name}</li>})}
            </ul>
            <button onClick={postBranch}>Post</button>
        </>
    );

}

export default ProductView;