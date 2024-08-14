import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';
import Loader from '../ui/Loader';
import { CgClose } from "react-icons/cg";

const EquipmentDetail = () => {
    const { id } = useParams();
    const [equipment, setEquipment] = useState(null);
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const equipmentRef = ref(database, `Equipments/${id}`);
        const checkpointsRef = ref(database, 'Checkpoints');

        const handleEquipmentChange = (snapshot) => {
            setEquipment(snapshot.val());
            setLoading(false);
        };

        const handleCheckpointsChange = (snapshot) => {
            const data = snapshot.val();
            const equipmentCheckpoints = data ? Object.keys(data)
                .filter(key => data[key].equipmentKey === id)
                .map(key => ({ ...data[key], id: key })) : [];
            setCheckpoints(equipmentCheckpoints);
        };

        try {
            onValue(equipmentRef, handleEquipmentChange);
            onValue(checkpointsRef, handleCheckpointsChange);
        } catch (err) {
            setError('Erreur lors de la récupération des données');
        }

        return () => {
            off(equipmentRef, 'value', handleEquipmentChange);
            off(checkpointsRef, 'value', handleCheckpointsChange);
        };
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;
    if (!equipment) return <div className="flex justify-center items-center h-screen"> <p>Aucun équipement trouvé.</p> </div>;

    const openModal = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
    };

    return (
        <div className="p-16">
            <div className="flex gap-20 justify-left ">
                <div className="flex">
                    {equipment.photo && (
                        <img
                            src={equipment.photo}
                            alt={equipment.name}
                            className="rounded-lg w-full h-80 object-cover"
                        />
                    )}
                </div>

                <div className="mb-6">
                    {equipment.name && <h1 className="text-2xl font-semibold mb-2">{equipment.name}</h1>}
                    {[
                        { label: 'Domaine', value: equipment.domain },
                        { label: 'Nom du bâtiment', value: equipment.building },
                        { label: 'Local', value: equipment.local },
                        { label: 'Marque', value: equipment.brand },
                        { label: 'Modèle', value: equipment.model },
                        { label: 'Numéros de série', value: equipment.serialNumber },
                        { label: 'Quantité', value: equipment.quantity },
                        { label: 'Status', value: equipment.status },
                        { label: 'Notes', value: equipment.notes },
                        { label: 'Défaults', value: equipment.nbFaults !== 0 ? equipment.nbFaults : null },
                    ].map((item, index) =>
                        item.value && (
                            <p key={index}>
                                <strong>{item.label}:</strong> {item.value}
                            </p>
                        )
                    )}
                </div>
            </div>

            <div className="flex flex-col justify-center mt-10">
                <h2 className="text-lg font-bold mb-4">Points de contrôles</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left text-sm whitespace-nowrap">Nom</th>
                                <th className="py-2 px-4 text-left text-sm whitespace-nowrap">Défauts</th>
                                <th className="py-2 px-4 text-left text-sm whitespace-nowrap">Recommandation</th>
                                <th className="py-2 px-4 text-left text-sm whitespace-nowrap">Photo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkpoints.length > 0 ? (
                                checkpoints.map((checkpoint) => (
                                    <tr key={checkpoint.id} className="border-b">
                                        <td className="py-2 px-4 text-sm">{checkpoint.name}</td>
                                        <td className="py-2 px-4 text-sm">{checkpoint.fault || '-'}</td>
                                        <td className="py-2 px-4 text-sm">{checkpoint.recommendation || '-'}</td>
                                        <td className="py-2 px-4 text-sm">
                                            {checkpoint.photo ? (
                                                <div
                                                    onClick={() => openModal(checkpoint.photo)}
                                                    className="text-blue-500 cursor-pointer"
                                                >
                                                    Voir
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 text-center">Pas de point de contrôles trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {selectedPhoto && (
                    <div
                        className="fixed flex inset-0 w-full h-full bg-black bg-opacity-50 backdrop-blur justify-evenly items-center z-50"
                        onClick={closeModal}
                    >
                        <div className="absolute top-4 right-4 cursor-pointer">
                            <CgClose className="text-white w-8 h-8 hover:scale-105" onClick={closeModal} />
                        </div>

                        <img
                            onClick={(e) => e.stopPropagation()}
                            src={selectedPhoto}
                            alt="Checkpoint"
                            className="max-w-[80%] max-h-[80%]"
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default EquipmentDetail;
