import React from 'react';
import accountImg from '../img/icons8-user-64.png'

export default function Navbar(props) {

    return(
        <div className='nav'>

            <h1 style={{fontWeight: 'bolder', marginLeft: '500px'}}>{props.route}</h1>

            <div className='nav-right'>
                <a href='#'  onClick={() => props.profileControl('Show')}>User Profile <img src={accountImg} alt='account-image'/></a>
                <div className="btn" onClick={() => props.routeChange('signin')} >Log Out</div>
            </div>
        </div>
    )
}