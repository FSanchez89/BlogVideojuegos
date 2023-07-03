import React from 'react'

export const HeaderComponent = () => {
    return (
        <header className="bg-light text-Dark text-center py-3">
            <div>
                <img src={process.env.PUBLIC_URL + '/Gamemaster.png'} alt="Gamemaster Logo" height="10" width="30%" className="img-fluid"/>
            </div>
        </header>
    )
}
