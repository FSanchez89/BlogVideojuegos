import React from 'react'

export const FooterComponent = () => {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary text-light text-center py-1">
            <div>
                <p>&copy; {currentYear} Gamemaster</p>
            </div>
        </footer>
    )
}
