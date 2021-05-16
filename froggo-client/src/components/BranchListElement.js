import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'

import {navigate} from 'hookrouter';

function BranchListElement(props) {
    return (
        <li key={props.branch_id}>{props.branch_id} | {props.branch_name}</li>
    )
    
}

export default BranchListElement;