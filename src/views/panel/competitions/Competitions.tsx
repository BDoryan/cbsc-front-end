import React, { useState } from 'react';
// @ts-ignore
import { Link, RouteComponentProps } from 'react-router-dom';

const Competitions: React.FC<RouteComponentProps<{}>> = () => {

    return (
        <>
            <h1 className="text-2xl mb-2 font-bold">Liste des compétitions</h1>
            <p className="text-sm">
                Retrouvez tous les membres de votre club et faciliter leurs gestions et la communication avec eux.
            </p>
            <hr className="my-5" />

        </>
    )
}

export default Competitions;
