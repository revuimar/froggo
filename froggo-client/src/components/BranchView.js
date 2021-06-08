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


function BranchView(props) {
    const auth = useAuth();
    console.log(props);

    if(auth.user == null) {
        navigate("/", true);
        return null;
    }

    return (
        <>
        Branch details id {props.id.id}
        </>
    );

}

export default BranchView;