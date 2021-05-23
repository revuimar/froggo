import React, { useState, useEffect } from 'react';
import {useAuth} from '../useAuth.js'

import {navigate} from 'hookrouter';

function BranchListElement(props) {
    return (
        <li className="p-2 bg-green-100 | hover:bg-green-400 | transition-colors duration-200" key={props.branch_id}>
            <div className="flex flex-row justify-start">
                <div className="mx-4 justify-self-start">
                    {props.branch_id}
                </div>
                <div className="mx-4">
                {props.branch_name}
                </div>
            </div>
            
                
        </li>
    )
    
}

export default BranchListElement;