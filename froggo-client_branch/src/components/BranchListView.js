import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'

import {navigate} from 'hookrouter';
import BranchListElement from './BranchListElement.js';

import { DataGrid } from '@material-ui/data-grid';

const columns = [
    { field: 'branch_id', headerName: 'ID', width: 90 },
    { field: 'branch_name', headerName: 'Branch Name', width: 150 },
  ];
  

function BranchListView() {
    const auth = useAuth();
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        async function f() {
            const response = await fetch('https://localhost:3001/api/branches/1/1', {
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
        const res = await fetch('https://localhost:3001/api/branches' ,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${auth.user['username']} ${auth.user['token']}`|| ''
            },
            body: JSON.stringify({"branch_name": randomName, "password": randomName})
        });
        const response = await fetch('https://localhost:3001/api/branches/1/1', {
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
        navigate("/", true);
        return null;
    }

    return (
        <div className="w-3/4">
            <DataGrid rows={branchList} columns={columns} pageSize={5} checkboxSelection />
        </div>

        /*
            
            <div className="max-h-75vh overflow-y-scroll">
                <ul className="bg-green-100">
                <BranchListElement  branch_id="ID" branch_name="Branch Name"/>
                {branchList.map((b) => {return <BranchListElement branch_id={b.branch_id} branch_name={b.branch_name} />})}
                </ul>
            </div>
            <p className='text-white'>Logged in as {auth.user["username"]}</p>
           
            <button className="bg-green-300 rounded p-2" onClick={postBranch}>Post</button>
        </div> */
    );

}

export default BranchListView;