import React, {useEffect, useState} from 'react';
import { useParams} from 'react-router-dom';
import axios from "axios";
import {useAppContext} from "../../context/AppContext";


const ConvocationView: any = () => {

    const {API, addNotification, toResource, token_session} = useAppContext();
    const {id}: any = useParams();
    const [convocation, setConvocation] = useState<any>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`${API}convocations/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token_session
                    }
                });

                if (response.status === 200) {
                    setConvocation(response.data);
                }
            } catch (e) {
                console.error(e);
                addNotification('Erreur', 'Une erreur est survenue lors de la récupération de la convocation', 'error')
            }
        }

        fetch();
    }, [API, addNotification, id, token_session]);

    const getStatus = (invitation: any) => {
        return (invitation.accepted == null && invitation.declined == null) ? 'circle' : (invitation.accepted ? 'check-circle' : 'circle-xmark');
    }

    return (
        <>
            {convocation && (
                <>
                    <h1 className="text-2xl mb-2 font-bold">
                        {convocation.title ?? ''}
                    </h1>
                    <hr className="my-5"/>
                    <h2 className="text-lg font-medium text-gray-900 mb-1">
                        Détails de la convocation :
                    </h2>
                    <p className="text-sm">
                        {convocation.content ?? ''}
                    </p>
                    <p className="text-sm text-gray-600 mt-10">
                        <span className="text-indigo-600">{convocation?.invitations.length ?? 0} membre(s)</span> ont été
                        convié(s) à cet événement.<br/>
                        <span className="text-gray-600">Le <span
                            className="text-indigo-600">{new Date(convocation.datetime).toLocaleString()}</span></span>
                    </p>
                    <div className="mt-5 w-full">
                        <label htmlFor="search" className="mb-2 block text-sm font-medium leading-6 text-gray-900">Rechercher
                            un
                            membre</label>
                        <input id="search" name="search" type="text" autoComplete="search" required
                               className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                    </div>
                    <div className="flex flex-col gap-3 mt-5">
                        {
                            convocation?.invitations.map((invitation: any, index: number) => (
                                <div key={index} className="flex items-center shadow p-3 rounded-2xl">
                                    <img className="w-10 h-10 object-cover rounded-full shadow-2xl"
                                         src={toResource(invitation.user.picture) ?? ''}
                                         alt="Person 1"/>
                                    <h3 className="text-lg font-medium text-gray-900 ms-2 me-auto">{invitation.user.firstname + ' ' + invitation.user.lastname}</h3>
                                    <i className={`fa-solid fa-${getStatus(invitation)} me-1 text-${getStatus(invitation) === 'check-circle' ? 'green' : getStatus(invitation) === 'circle-xmark' ? 'red' : 'gray'}-700`}></i>
                                </div>
                            ))
                        }
                    </div>
                </>
            )}
        </>
    )
}

export default ConvocationView;
