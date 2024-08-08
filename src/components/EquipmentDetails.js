import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

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

        // Nettoyage des abonnements
        return () => {
            off(equipmentRef, 'value', handleEquipmentChange);
            off(checkpointsRef, 'value', handleCheckpointsChange);
        };
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!equipment) return <p>Aucun équipement trouvé.</p>;

    // Function to open modal
    const openModal = (photo) => {
        setSelectedPhoto(photo);
    };

    // close modal when clicked outside the photo
    window.onclick = (event) => {
        if (event.target === document.querySelector('.fixed')) {
            setSelectedPhoto(null);
        }
    };



    const equipmentDetails = [
        { label: 'Domaine', value: equipment.domain },
        { label: 'Batiment', value: equipment.building },
        { label: 'Local', value: equipment.local },
        { label: 'Marque', value: equipment.brand },
        { label: 'Modèle', value: equipment.model },
        { label: 'Numéro de série', value: equipment.serialNumber },
        { label: 'Quantité', value: equipment.quantity },
        { label: 'Status', value: equipment.status },
        { label: 'Notes', value: equipment.notes },
        { label: 'Défauts', value: equipment.nbFaults },
    ];



    return (
        <div className="p-16">
            {/* Section de la photo de l'équipement */}
            <div className="flex gap-20  justify-left ">

                <div className="flex">
                    {equipment.photo && (
                        <img
                            src={equipment.photo}
                            alt={equipment.name}
                            className="rounded-lg w-full h-80 object-cover"
                        />
                    )}
                </div>

                {/* Section des infos de l'équipement */}

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2">{equipment.name}</h1>
                    {equipmentDetails.map((detail, index) => (
                        detail.value && <p key={index}><strong>{detail.label}:</strong> {detail.value}</p>))}
                </div>

            </div>

        <div className="flex flex-col justify-center mt-10">
            <h2 className="text-lg font-bold mb-4">Points de contrôles</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 text-left">Nom</th>
                            <th className="py-2 px-4 text-left">Défauts</th>
                            <th className="py-2 px-4 text-left">Recommandation</th>
                            <th className="py-2 px-4 text-left">Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkpoints.length > 0 ? (
                            checkpoints.map(checkpoint => (
                                <tr key={checkpoint.id} className="border-b">
                                    <td className="py-2 px-4">{checkpoint.name}</td>
                                    <td className="py-2 px-4">{checkpoint.fault || '-'}</td>
                                    <td className="py-2 px-4">{checkpoint.recommendation || '-'}</td>
                                    <td className="py-2 px-4">
                                        {checkpoint.photo ? (
                                            <div
                                                onClick={() => openModal(checkpoint.photo)}
                                                className="text-blue-500 cursor-pointer"
                                            >
                                             Photo
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

            {/* Modal for displaying photo */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className=" flex justify-center w-fit">
                        <img
                            src={selectedPhoto}
                            alt="Checkpoint"
                            className="w-2/4 h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
    );
};

export default EquipmentDetail;
