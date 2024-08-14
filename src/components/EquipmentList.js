import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { MdLastPage, MdFirstPage } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';

function EquipmentList() {
    const [equipments, setEquipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        const equipmentRef = ref(database, 'Equipments');
        const unsubscribe = onValue(equipmentRef, (snapshot) => {
            const data = snapshot.val();
            const equipmentList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            equipmentList.sort((a, b) => a.name.localeCompare(b.name));
            setEquipments(equipmentList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const filteredEquipments = equipments.filter(equipment => 
        Object.keys(equipment).some(key => 
            equipment[key] && 
            equipment[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    

    const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        return (
            <div className="flex justify-between mt-10">
                <div
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-3 py-1 mx-1 rounded bg-gray-500/20 cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <MdFirstPage className="w-5 h-5" />
                </div>
                <div className="flex">
                  {currentPage} / {totalPages}
                </div>
                <div
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-3 py-1 mx-1 rounded bg-gray-500/20 cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <MdLastPage className="w-5 h-5" />
                </div>
            </div>
        );
    };

    return (
        <div className="p-16 min-h-screen justify-center">
            <h1 className="flex justify-center text-2xl uppercase font-semibold">Liste des équipements</h1>
            <div className="px-5 pt-20 sm:p-20">
                <div className="flex pb-10 relative">
                    <IoIosSearch className="absolute text-gray-500 w-4 h-4 mt-2 ml-2" />
                    <input
                        className="bg-gray-400/20 pl-8 rounded-lg min-w-64 py-1"
                        type="text"
                        placeholder="Rechercher"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                {loading ? (
                    <Skeleton />
                ) : (
                    <div className="grid gap-10 lg:grid-cols-2">
                        {currentEquipments.map(equipment => (
                            <Link key={equipment.id} to={`/equipments/${equipment.id}`} className="group relative flex flex-col overflow-hidden cursor-pointer duration-100 ease-in transform hover:scale-105">
                                <img className="rounded-lg w-full h-60 object-cover" src={equipment.photo} alt={equipment.name} />
                                <div className="pt-2">
                                    <h2 className="text-xl">{equipment.name}</h2>
                                    <p className="text-slate-600 uppercase text-sm">Domaine: {equipment.domain}</p>
                                    <p className="text-slate-600 uppercase text-sm">Défauts: {equipment.nbFaults}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <div className="select-none">
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
}

export default EquipmentList;
