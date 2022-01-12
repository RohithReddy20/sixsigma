import React from 'react'
import Announcements from '../Announcements/Announcements'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

function AnnouncementsPage() {
    return (
        <>
            <Navbar style={{height: "60px !important"}} />
            <Sidebar />
            <Announcements />
        </>
    )
}

export default AnnouncementsPage
