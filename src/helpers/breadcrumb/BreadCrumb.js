import React from 'react'
import "./BreadCrumb.css"

function BreadCrumb() {
    return (
        <div className="container">
            <ul className="breadcrumb">
                <li className="breadcrumb__item breadcrumb__item-firstChild">
                    <span className="breadcrumb__inner">
                        <span className="breadcrumb__title">Monster Hunter</span>
                    </span>
                </li>
                <li className="breadcrumb__item">
                    <span className="breadcrumb__inner">
                        <span className="breadcrumb__title">Final Fantasy</span>
                    </span>
                </li>
                <li className="breadcrumb__item">
                    <span className="breadcrumb__inner">
                        <span className="breadcrumb__title">Doom</span>
                    </span>
                </li>
                <li className="breadcrumb__item breadcrumb__item-lastChild">
                    <span className="breadcrumb__inner">
                        <span className="breadcrumb__title">Zombie Hunter</span>
                    </span>
                </li>
                <li className="breadcrumb__item breadcrumb__item-lastChild">
                    <span className="breadcrumb__inner">
                        <span className="breadcrumb__title">WarCraft</span>
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default BreadCrumb