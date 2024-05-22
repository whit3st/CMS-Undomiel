import React from 'react';
import UserBanner from './user-banner';
import Logo from './logo';

const Header = () => {
    return (
        <header className='flex items-center justify-between py-8'>
            <Logo />
            <UserBanner />
        </header>
    );
};

export default Header;