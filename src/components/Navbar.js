import React from 'react';
import { Link } from 'react-router-dom';

const  Navbar = () => {

    return (

        <div className = "sticky top-0 z-40 w-full backdrop-blur flex-none border-b  border-slate-200 ">
            <div className="max-w-8xl mx-auto">
                <div className = "py-4 px-4">
                    <div className="flex w-full items-center justify-between">
                        <Link to="/">
                        <img src="/beeldi.svg" alt="Beeldi logo"/>
                        </Link>
                    </div>
                </div>
                
            </div> 
        </div>

    );

}


export default Navbar;