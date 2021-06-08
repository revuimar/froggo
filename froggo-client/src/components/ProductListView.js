import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'

import {navigate, A} from 'hookrouter';

import { DataGrid } from '@material-ui/data-grid';
import {Fab, Modal, TextField, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'branch_name', headerName: 'Branch Name', width: 200 },
  ];


function ProductListView() {
    const auth = useAuth();
    const [productList, setProductList] = useState([]);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    

    useEffect(() => {
        if(auth.user != null) {
            getAllProducts();
        }
        return () => {
            //cleanup
        }
    }, []);

    let getAllProducts = async () => {
        const response = await fetch('https://localhost:3001/api/supplies/1/1', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${auth.user['token']}`|| ''
            },
        });
        if(!response.ok) {
            return setProductList([]);
        }
        let data = await response.json();
        setProductList(data);
    }

    let addNewProduct = async () => {
        let n = document.getElementById("branch_name").value;
        let p = document.getElementById("branch_password").value;
        await postProduct(n, p);
        await getAllProducts();
    }
    
    let postProduct = async (name, password) => {
        const res = await fetch('https://localhost:3001/api/branches' , {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user['token']}`|| ''
            },
            body: JSON.stringify({"branch_name": name, "password": password})
        });
    };

    if(auth.user == null) {
        navigate("/", true);
        return null;
    }

    return (
        <>
        <div className="flex flex-row justify-center pt-2 pb-2">
            <A className="px-4" href="/branches">Show Branches</A>
            <A className="px-4" href="/products">Show Products</A>
            <A className="px-4" href="/deliveries">Show Deliveries</A>
        </div>
        {/* <div className="w-3/4 max-h-75vh h-75vh text-white">
            <DataGrid rows={branchList} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25, 50, 100]} pagination autoHeight={true}/>
            <div className="py-2"></div>
            <Fab color="primary" aria-label="add" className='float-right' onClick={handleOpen}>
                <Add />
            </Fab>
            <Modal open={open} onClose={handleClose} className="">
                <div style={{ position: "absolute", top: "50%", left:"50%", transform: "translate(-50%, -50%)"}} className="w-1/3 h-1/2 bg-white rounded-lg">
                    <div className="px-4 py-8 flex flex-col text-center">
                        <div>
                            Add a new branch account
                        </div>
                        <form noValidate autoComplete="off" className="flex flex-col">
                            <TextField id="branch_name" label="Branch Name" variant="filled" />
                            <TextField id="branch_password" label="Password" variant="filled" type="password" />
                            <Button variant="contained" color="primary" onClick={addNewProduct}>
                            Add Branch
                            </Button>
                        </form>
                    </div>
                </div>
            
            </Modal>
        </div> */}
        </>
    );

}

export default ProductListView;