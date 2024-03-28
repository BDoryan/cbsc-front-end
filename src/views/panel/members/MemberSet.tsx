import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import {Link, RouteComponentProps, useParams} from 'react-router-dom';
import {useAppContext} from "../../context/AppContext";
import axios from "axios";

const MemberSet: React.FC<RouteComponentProps<{}>> = () => {

    const [loading, setLoading] = useState(false);
    const {API, toResource, token_session, addNotification, getUserById} = useAppContext();
    const {id} = useParams();
    const [user, setUser] = useState<any | boolean>(false);
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState([]);
    const image = useRef(null);

    const addError = (name: string, message: string) => {
        setErrors((prevErrors) => {
            return [...prevErrors, {name, message}];
        });
    }

    const clearErrors = () => {
        setErrors([]);
    }

    const handleRoleChange = (role: string, active: boolean) => {
        setRoles((prevRoles) => {
            if (active && !prevRoles.includes(role)) {
                return [...prevRoles, role];
            } else if (!active && prevRoles.includes(role)) {
                return prevRoles.filter((r) => r !== role);
            } else {
                return prevRoles; // No change needed
            }
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                // @ts-ignore
                const user = await getUserById(id);
                if (user) {
                    setUser(user)

                    if (user.licensed)
                        handleRoleChange('licensed', true)

                    if (user.managing)
                        handleRoleChange('managing', true);
                } else {
                    setUser(null);
                }
            } else {
                setUser(false)
            }
        }

        fetchUser();
        return () => {
            setRoles([]);
        }
    }, [id]);

    const roles_display = {
        'licensed': {
            'html': (
                <div>
                    <label htmlFor="license_number" className="block text-sm font-medium leading-6 text-gray-900">
                        Numéro de licence
                    </label>
                    <div className="mt-2">
                        <input defaultValue={user?.licensed?.license_number ?? ''} id="license_number"
                               name="roles[licensed][license_number]" type="number"
                               required
                               className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        {errors['roles[licensed][license_number]'] && (
                            <p className="text-red-500 text-sm">{errors['roles[licensed][license_number]']}</p>
                        )}
                    </div>
                </div>
            )
        },
        'managing': {
            'html': (
                <div>
                    <label htmlFor="managing_role" className="block text-sm font-medium leading-6 text-gray-900">
                        Rôle dans le bureau
                    </label>
                    <div className="mt-2">
                        <input defaultValue={user?.managing?.role ?? ''} id="managing_role"
                               name="roles[managing][role]" type="text"
                               required
                               className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        {errors['roles[managing][role]'] && (
                            <p className="text-red-500 text-sm">{errors['roles[managing][role]']}</p>
                        )}
                    </div>
                </div>
            )
        }
    }

    const [picture, setPicture] = useState(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        clearErrors();

        const formData = new FormData(e.target);

        if (id)
            formData.append('_method', 'put');

        if (picture)
            formData.append('profile_image', picture);

        // post to the API /users with the form data and axios
        if (!id) {
            try {
                const response = await axios.post(API + 'users', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token_session}`
                    }
                });

                if (response.status === 201) {
                    e.target.reset();
                    addNotification('Membre créé', 'Le membre a été créé avec succès', 'success');
                }
            } catch (e) {
                // console.error(e)
                setErrors(e.response.data);
                addNotification('Erreur lors de la création', 'Une erreur est survenue lors de la création du membre', 'error');
            }
        } else {
            try {
                const response = await axios.post(API + 'users/' + id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token_session}`
                    }
                });

                if (response.status === 200) {
                    addNotification('Membre modifié', 'Le membre ' + user.firstname + ' ' + user.lastname + ' a été créé avec succès', 'success');
                }
            } catch (e) {
                setErrors(e.response.data);
                console.error(e.response)
                addNotification('Erreur lors de la modification', 'Une erreur est survenue lors de la modification du membre', 'error');
            }
        }
    };

    return (
        <>
            {(user == null && id) && (
                <>
                    <p className="text-red-700 text-lg py-4">
                        La récupération du joueur n'est pas possible
                    </p>
                </>
            )}
            {((user && id) || (user === false && !id)) && (
                <>
                    <h1 className="text-2xl mb-2 font-bold">
                        {user ? "Modification de l'utisateur" : "Création d'un membre"}
                    </h1>
                    <p className="text-sm">
                        {
                            user ?
                                "Une fois les modifications sauvegarder elle seront appliqués à l'utilisateur"
                                :
                                "La création d'un membre va lui permettre d'intégrer votre club de pétanque."
                        }
                    </p>
                    <hr className="my-5"/>

                    <form onSubmit={handleSubmit} className="space-y-6" action="#"
                          encType={'multipart/form-data'}>
                        <div>
                            <label htmlFor="profile_image"
                                   className="block text-sm font-medium leading-6 text-gray-900">Choisissez
                                une photo de profil</label>
                            <div className="flex flex-row items-center justify-center ">
                                <div
                                    className="rounded-[50%] overflow-hidden shadow-md max-w-1/2 w-[100px] h-[100px] relative mt-4">
                                    <img ref={image} src={toResource(user.picture) ?? ''} id="preview" className=""
                                         alt=""/>
                                    <div
                                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-25 z-1">
                                        <i className="fa-solid fa-camera text-white text-4xl text-opacity-50">
                                        </i>
                                    </div>
                                    <input
                                        onChange={(e) => {
                                            // @ts-ignore
                                            if (e.target.files && e.target.files[0]) {
                                                // @ts-ignore
                                                image.current.src = URL.createObjectURL(e.target.files[0]);
                                            }
                                            setPicture(e.target.files[0])
                                        }}
                                        name="profile_image" id="profile_image" type="file"
                                        className="absolute top-0 left-0 w-full h-full opacity-0"/>
                                    {
                                        errors['picture'] && (
                                            <p className="text-red-500 text-sm">{errors['picture']}</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstname"
                                       className="block text-sm font-medium leading-6 text-gray-900">Prénom</label>
                                <div className="mt-2">
                                    <input
                                        defaultValue={user.firstname ?? ''} id="firstname" name="firstname"
                                        type="text" autoComplete="firstname" required
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                    {errors['firstname'] && (
                                        <p className="text-red-500 text-sm">{errors['firstname']}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastname"
                                       className="block text-sm font-medium leading-6 text-gray-900">Nom</label>
                                <div className="mt-2">
                                    <input defaultValue={user.lastname ?? ''} id="lastname" name="lastname" type="text"
                                           autoComplete="lastname" required
                                           className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                    {errors['lastname'] && (
                                        <p className="text-red-500 text-sm">{errors['lastname']}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Adresse
                                e-mail</label>
                            <div className="mt-2">
                                <input defaultValue={user.email ?? ''} id="email" name="email" type="email"
                                       autoComplete="email" required
                                       className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                {errors['email'] && (
                                    <p className="text-red-500 text-sm">{errors['email']}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Numéro
                                de téléphone</label>
                            <div className="mt-2">
                                <input defaultValue={user.phone ?? ''} id="phone" name="phone" type="tel"
                                       autoComplete="tel" required
                                       className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>

                                {errors['phone'] && (
                                    <p className="text-red-500 text-sm">{errors['phone']}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="sex-select"
                                   className="block text-sm font-medium leading-6 text-gray-900">Sexe</label>
                            <div className="mt-2">
                                <div
                                    className="block relative h-9 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <select id="sex-select" name="sex"
                                            className="absolute px-3 bg-transparent top-0 left-0 w-full h-full bg-red-700">
                                        {
                                            user.role == "W" ? (
                                                <>
                                                    <option value="W">Femme</option>
                                                    <option value="M">Homme</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="M">Homme</option>
                                                    <option value="W">Femme</option>
                                                </>
                                            )
                                        }
                                    </select>
                                    {errors['sex'] && (
                                        <p className="text-red-500 text-sm">{errors['sex']}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium leading-6 text-gray-900">Date de
                                naissance</label>
                            <div className="mt-2">
                                <div
                                    className="relative h-9 block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <input defaultValue={user.birthdate ?? ''}
                                           className="absolute bg-transparent px-3 top-0 left-0 w-full h-full" id="sex"
                                           name="birthdate" type="date" autoComplete="birthdate" required/>
                                </div>
                                {errors['birthdate'] && (
                                    <p className="text-red-500 text-sm mt-3">{errors['birthdate']}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="example-select"
                                   className="block text-sm font-medium leading-6 text-gray-900">Rôle(s)</label>
                            <div className="mt-2 flex flex-col gap-2">
                                {/* check box with all options */}
                                <div className="flex items-center">
                                    <input onInput={(e) => handleRoleChange('licensed', !e.currentTarget.checked)}
                                           checked={roles.includes('licensed') ?? false} type="checkbox" id="licensed"
                                           name="licensed" value="licensed"
                                           className="h-[15px] w-[15px] rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                    <label htmlFor="licensed" className="ml-2 block text-sm font-medium text-gray-700">Joueur
                                        licencié</label>
                                </div>
                                <div className="flex items-center">
                                    <input onInput={(e) => handleRoleChange('managing', !e.currentTarget.checked)}
                                           checked={roles.includes('managing') ?? false} type="checkbox" id="managing"
                                           name={"managing"} value="managing"
                                           className="h-[15px] w-[15px] rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                    <label htmlFor="managing" className="ml-2 block text-sm font-medium text-gray-700">Membre
                                        du bureau</label>
                                </div>
                            </div>
                        </div>
                        {
                            roles.map((role, index) => {
                                return (
                                    <div key={"role" + index}>
                                        {roles_display[role].html}
                                    </div>
                                )
                            })
                        }

                        <div>
                            {!user && (
                                <p className="text-muted text-sm italic text-gray-500 my-3">
                                    Lorsque vous aurez terminer la création de ce compte l'utilisateur recevra ses accès
                                    dans sa boîte mail, sinon vous aurez la possibilité de l'aider à se connecter avec
                                    un QRCode.
                                </p>
                            )}
                            <button type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                <i className="fa-solid f"></i>
                                {user ? "Modifier le compte" : "Créer le compte"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </>
    )
}

export default MemberSet;
