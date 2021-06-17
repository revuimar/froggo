import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'

import {navigate, A} from 'hookrouter';

import { DataGrid } from '@material-ui/data-grid';
import {Fab, Modal, TextField, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', width: 200, editable: true },
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

    
    let getAllProducts = async () => {
        const response = await fetch('http://localhost:3050/api/supplies', {
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
        console.log(data);
        setProductList(data);
    }

    let addNewProduct = async () => {
        let n = document.getElementById("item_name").value;
        let q = document.getElementById("quantity").value;
        await postProduct(n, q);
        await getAllProducts();
    }
    
    let postProduct = async (name, quantity) => {
        const res = await fetch('http://localhost:3050/api/supplies' , {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user['token']}`|| ''
            },
            body: JSON.stringify({
                "item_name": name, 
                "quantity": quantity,
                "branch_id":1
            })
        });
    };

    const handleEditCellChangeCommitted = React.useCallback(
        ({ id, field, props }) => {
          console.log(id, field, props);
          if (field === 'quantity') {
            productList.forEach(product => {
                if(product.id === id) {
                    /// api/supply/:id/update/
                    product[field] = props.value;
                    const res = fetch(`http://localhost:3050/api/supply/${id}/update/` , {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth.user['token']}`|| ''
                        },
                        body: JSON.stringify({
                            "quantity": props.value,
                        })
                    });
                }
            })
            setProductList(productList);
            
          }
        },
        [productList, auth],
      );
    
    const handleSync = async () => {
        const response = await fetch('http://localhost:3050/api/sync/supplies', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${auth.user['token']}`|| ''
            },
            body: {
                "branch_name": auth.user['username']
            }
        });
        if(!response.ok) {
            alert("Sync Failed!");

        }
        else {
            const j = await response.json();
            console.log(j);
            alert(j.success);
        }
    }

    useEffect(() => {
        if(auth.user != null) {
            getAllProducts();
        }
        return () => {
            //cleanup
        }
    }, []);


    if(auth.user == null) {
        navigate("/", true);
        return null;
    }

    /// api/sync/supplies
    return (
        <>
        <div className="flex flex-row justify-center pt-2 pb-2">
            <A className="px-4" href="/products">Show Supplies</A>
            <A className="px-4" href="/deliveries">Show Deliveries</A>
        </div>
        <div className="w-3/4 max-h-75vh h-75vh text-white">
            <DataGrid rows={productList} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25, 50, 100]} 
                autoHeight={true} onEditCellChangeCommitted={handleEditCellChangeCommitted}/>
            <div className="py-2"></div>
            <Fab color="primary" aria-label="add" className='float-right' onClick={handleOpen}>
                <Add />
            </Fab>
            <Fab color="primary" aria-label="add" className='float-left' onClick={handleSync}>
                Sync
            </Fab>
            <Modal open={open} onClose={handleClose} className="">
                <div style={{ position: "absolute", top: "50%", left:"50%", transform: "translate(-50%, -50%)"}} className="w-1/3 h-1/2 bg-white rounded-lg">
                    <div className="px-4 py-8 flex flex-col text-center">
                        <div>
                            Add a new product
                        </div>
                        <form noValidate autoComplete="off" className="flex flex-col">
                            <TextField id="item_name" label="Item Name" variant="filled" />
                            <TextField id="quantity" label="Quantity" variant="filled" />
                            <Button variant="contained" color="primary" onClick={addNewProduct}>
                            Add Product
                            </Button>
                        </form>
                    </div>
                </div>
            
            </Modal>
        </div> 
        </>
    );

}

export default ProductListView;
