import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import ConfirmDialog from "../dialog/ConfirmDialog";
import {useDialog} from "../../context/DialogContext";
import axios from "axios";
import {useAppContext} from "../../context/AppContext";

interface ConvocationResponseProps {
    id: number;
    title: string;
    content: string;
    datetime: string;
    members: any;
    onFinish: () => void
}

const ConvocationResponse: React.FC<ConvocationResponseProps> = ({
                                                                     id,
                                                                     title,
                                                                     content,
                                                                     datetime,
                                                                     members,
                                                                     onFinish
                                                                 }
) => {

    const {API, token_session, addNotification} = useAppContext();
    const {setDialog} = useDialog();

    const decline = () => {
        setDialog(
            <ConfirmDialog confirm={{
                color: 'red',
                text: 'Je serais absent',
                onclick: async () => {
                    // post await /user/login with email and password with axios (wait response to return success or not)
                    try {
                        const response = await axios.post(API + 'convocations/' + id + '/decline', {}, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token_session}`
                            }
                        });

                        if (response.status === 200) {
                            onFinish();
                        }
                    } catch (error) {
                        addNotification('Erreur', 'Une erreur est survenue lors de la confirmation de votre présence.', 'error');
                    }
                }
            }}
                           cancel={{
                               color: 'white',
                               text: 'Annuler',
                               onclick: () => {

                               }
                           }}
                           title={"Confirmez vous que vous serez bien absent"}
                           content={"Vous êtes vraiment sûr que vous ne serez pas présent pour cette convocation."}
            />
        )
    }

    const accept = () => {
        setDialog(
            <ConfirmDialog confirm={{
                background: 'green',
                color: 'green',
                text: 'Je serais présent',
                onclick: async () => {
                    onFinish();
                    // post await /user/login with email and password with axios (wait response to return success or not)
                    try {
                        const response = await axios.post(API + 'convocations/' + id + '/accept', {}, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token_session}`
                            }
                        });

                        if (response.status === 200) {
                            onFinish();
                        }
                    } catch (error) {
                        addNotification('Erreur', 'Une erreur est survenue lors de la confirmation de votre présence.', 'error');
                    }
                }
            }}
                           cancel={{
                               color: 'white',
                               text: 'Annuler',
                               onclick: () => {

                               }
                           }}
                           title={"Confirmez vous que vous serez bien présent"}
                           content={"Vous êtes vraiment sûr que vous serez présent pour cette convocation."}
            />
        )
    }

    return (
        <>
            <div className="bg-gray-100 h-[100vh] relative overflow-auto">
                <div className="p-5">
                    <h1 className="text-2xl mb-2 font-bold">
                        {title}
                    </h1>
                    <hr className="my-5"/>
                    <h2 className="text-lg font-medium text-gray-900 mb-1">
                        Détails de la convocation :
                    </h2>
                    <p className="text-sm">
                        {content}
                    </p>
                    <p className="text-sm text-gray-600 mt-10">
                        <span className="text-indigo-600">{members.length} membre(s)</span> ont été convié(s) à cet
                        événement.<br/>
                        <span className="text-gray-600">Le <span
                            className="text-indigo-600">{datetime}</span></span>
                    </p>
                </div>
                <div
                    className="absolute left-0 right-0 bottom-0 bg-white p-3 border-t-[1px] border-gray-200 shadow-inner py-6">
                    <p className={"leading-[1em] text-gray-600"}>
                        Est-ce que vous serez présent ?
                    </p>
                    <div className="flex justify-between gap-3 mt-5">
                        <button
                            onClick={decline}
                            className="text-sm w-full bg-red-700 rounded-lg px-4 py-2 text-gray-200 hover:bg-red-800">
                            Je ne serais pas présent
                        </button>
                        <button
                            onClick={accept}
                            className="text-sm w-full bg-green-700 rounded-lg px-4 py-2 text-white hover:bg-green-800 hover:text-white">
                            Je serais présent
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConvocationResponse;
