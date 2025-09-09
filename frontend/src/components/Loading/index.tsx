import React from 'react';
import './styles.scss';

export default function Loading() {
    return (
        <div className="loadingContainer">
            <img src={require('../../assets/images/loadingImg.gif')} width={50} />
        </div>
    );
}
