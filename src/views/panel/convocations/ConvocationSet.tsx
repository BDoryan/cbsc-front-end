import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import {Link, RouteComponentProps, useParams} from 'react-router-dom';
import axios from "axios";
import {useAppContext} from "../../context/AppContext";

const ConvocationSet: React.FC<RouteComponentProps<{}>> = () => {

    const { API, addNotification, token_session} = useAppContext();
    const { id } = useParams();
    const [convocation, setConvocation] = useState<any>({});
    const [errors, setErrors] = useState([]);
    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [current_datetime, setCurrentDatetime] = useState<string>('');

    const setError = (name: string, message: string) => {
        setErrors((prevErrors) => {
            prevErrors[name] = message;
            return prevErrors;
        });
    }

    const removeError = (name: string) => {
        setErrors((prevErrors) => {
            return prevErrors.filter((error: any) => error.name !== name);
        });
    }

    const clearErrors = () => {
        setErrors([]);
    }

    useEffect(() => {
        // si la date est inférieure à la date actuelle, on ajoute une erreur
        const date = new Date(current_datetime);
        const now = new Date();
        console.log(date, now)
        if (date < now) {
            console.log('error')
            setError('datetime', 'La date de la convocation doit être supérieure à la date actuelle');
        } else {
            removeError('datetime');
        }
    }, [current_datetime]);

    useEffect(() => {
        const fetchConvocation = async () => {
            if (id) {
                try {
                    const response = await axios.get(API + 'convocations/' + id, {
                        headers: {
                            'Authorization': 'Bearer ' + token_session
                        }
                    });

                    if (response.status === 200) {
                        setConvocation(response.data);
                        setInvitations(response.data.invitations.map((invitation: any) => Number.parseInt(invitation.user_id)));
                        setCurrentDatetime(convertToDateInput(response.data.datetime));
                    }
                } catch (e) {
                    console.error(e);
                    addNotification('Erreur', 'Une erreur est survenue lors de la récupération de la convocation', 'error');
                }
            } else {
                setConvocation({})
            }
        }

        const fetchMembers = async () => {
            try {
                const response = await axios.get(API + 'users/all', {
                    headers: {
                        'Authorization': 'Bearer ' + token_session
                    }
                });

                console.log('members', response.data)
                if (response.status === 200) {
                    setMembers(response.data);
                } else {
                    addNotification('Erreur', 'Une erreur est survenue lors de la récupération des membres', 'error')
                }
            } catch (e) {
                console.error(e);
                addNotification('Erreur', 'Une erreur est survenue lors de la récupération des membres', 'error')
            }
        }

        fetchMembers();
        fetchConvocation();
        return () => {
            setConvocation({});
            setMembers([])
            setCurrentDatetime('')
            setInvitations([])
        }
    }, [id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        // add invitations[] to the formData
        invitations.forEach((invitation: number) => {
            console.log(invitation)
            formData.append('invitations[]', invitation+'');
        });

        if (id)
            formData.append('_method', 'put');

        // post to the API /convocations with the form data and axios
        if (!id) {
            try {
                const response = await axios.post(API + 'convocations', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token_session}`
                    }
                });

                if (response.status === 201) {
                    e.target.reset();
                    setInvitations([])
                    setCurrentDatetime('');

                    addNotification('Convocation créée', 'La convocation a été créée avec succès', 'success');
                }
            } catch (e) {
                // console.error(e)
                setErrors(e.response.data);
                addNotification('Erreur lors de la création', 'Une erreur est survenue lors de la création de la convocation', 'error');
            }
        } else {
            try {
                const response = await axios.post(API + 'convocations/' + id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token_session}`
                    }
                });

                if (response.status === 200) {
                    addNotification('Convocation modifiée', 'La convocation a été modifiée avec succès', 'success');
                }
            } catch (e) {
                setErrors(e.response.data);
                console.error(e.response)
                addNotification('Erreur lors de la modification', 'Une erreur est survenue lors de la modification de la convocation', 'error');
            }
        }
    }

    const convertToDateInput = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hours = d.getHours();
        const minutes = d.getMinutes();

        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}T${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }

    return (
        <>
            <h1 className="text-2xl mb-2 font-bold">Création de la convocation</h1>
            <hr className="my-5" />

            <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Titre de la convocation</label>
                    <div className="mt-2">
                        <input defaultValue={convocation.title ?? ''} id="title" name="title" type="text" autoComplete="title" required className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors['title'] && (
                            <p className="text-red-500 text-sm">{errors['title']}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">Message de la convocation</label>
                    <div className="mt-2">
                        <textarea defaultValue={convocation.content ?? ''} rows={4} id="content" name="content" autoComplete="content" required className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors['content'] && (
                            <p className="text-red-500 text-sm">{errors['content']}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="datetime" className="block text-sm font-medium leading-6 text-gray-900">Date de la convocation</label>
                    <div className="mt-2">
                        <div className="relative h-9 block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <input value={current_datetime} onChange={(e) => setCurrentDatetime(e.target.value)} className="absolute bg-transparent px-3 top-0 left-0 w-full h-full" id="datetime" name="datetime" type="datetime-local" autoComplete="birthday" required />
                        </div>
                        {errors['datetime'] && (
                            <p className="text-red-500 text-sm">{errors['datetime']}</p>
                        )}
                    </div>
                </div>
                <div className={'overflow-y-auto h-[300px] py-2 border-[1px] border-gray-300 rounded-md shadow-sm'}>
                    {
                        (invitations && members && members.length > 0) && members.map((member: any) => {
                            return (
                                <div key={member.id} className="flex items-center justify-between px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium">{member.id} - {member.firstname} {member.lastname}</p>
                                    </div>
                                    <div>
                                        <input onChange={(e) =>
                                            setInvitations((prevInvitations) => {
                                                if (e.target.checked) {
                                                    return [...prevInvitations, member.id];
                                                } else {
                                                    return prevInvitations.filter((id: number) => id !== member.id);
                                                }
                                            })
                                        } checked={invitations.includes(member.id) ?? false} type="checkbox" className={"h-[16px] w-[16px] "}  />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    <p className="text-muted text-sm italic text-gray-500 mb-3">
                        Lorsqu'on vous aurez terminé la création de votre convocation, une notification sera envoyé à tous les membres de l'association.
                    </p>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <i className="fa-solid f"></i>
                        {
                            id ? 'Modifier la convocation' : 'Créer la convocation'
                        }
                    </button>
                </div>
            </form>
        </>
    )
}

export default ConvocationSet;
