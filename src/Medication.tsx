import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import "./App.css";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Medication } from './datatypes';



export function NewMedicationForm() {
    const [medication, setMedication] = useState<Medication>({
        id: new Date().getTime(), // Generate a unique ID based on the current timestamp,
        name: "",
        dosage: "",
        cost_per_pill: 0
    });

    function resetMedication() {
        setMedication({
            id: new Date().getTime(), // Generate a unique ID based on the current timestamp
            // or use a library like uuid to generate a unique ID
            name: "",
            dosage: "",
            cost_per_pill: 0
        });
    }

    function onSubmit(medication: Medication) {
        console.log("Submitting medication data:", medication);
        invoke("add_medication", { medication })
            .then((response: any) => {
                console.log("Medication added successfully:", response);
                // Reset the form after submission
                resetMedication();
            })
            .catch((error: Error) => {
                console.error("Error adding medication:", error);
            });
    };

    return (
        <div id="mf-container">
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(medication);
            }}
                className="medication-form"
            >
                <label htmlFor="id">ID</label>
                <input type="text" placeholder="ID" value={medication.id} disabled />
                <label htmlFor="name">Name</label>
                <input type="text" placeholder="Name" value={medication.name} onChange={(e) => setMedication({ ...medication, name: e.target.value })} />
                <label htmlFor="dosage">Dosage</label>
                <input type="text" placeholder="Dosage" value={medication.dosage} onChange={(e) => setMedication({ ...medication, dosage: e.target.value })} />
                <label htmlFor="cost_per_pill">Cost per Pill</label>
                <input type="number" placeholder="Cost per Pill" value={medication.cost_per_pill} onChange={(e) => setMedication({ ...medication, cost_per_pill: parseFloat(e.target.value) })} />

            </form >
            <div id="buttons">
                <button type="button" onClick={() => { window.history.back(); }}>Back</button>
                <button type="submit" onClick={() => { onSubmit(medication) }}>Add Medication</button>
                <button type="submit" onClick={() => { onSubmit(medication); window.location.href = "\\" }}>Add Medication and Return</button>
                <button type="button" onClick={resetMedication}>Clear</button>

            </div>
        </div>
    )
}

export function ExistingMedication() {
    const [medication, setMedication] = useState<Medication>({
        id: new Date().getTime(), // Generate a unique ID based on the current timestamp,
        name: "",
        dosage: "",
        cost_per_pill: 0
    });

    function resetMedication() {
        setMedication({
            id: new Date().getTime(), // Generate a unique ID based on the current timestamp
            // or use a library like uuid to generate a unique ID
            name: "",
            dosage: "",
            cost_per_pill: 0
        });
    }

    const { medication_id } = useParams<{ medication_id: string }>();

    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response: Medication = await invoke("get_medication", { medication_id });
                setMedication(response);
            } catch (err) {
                console.error("Error fetching medication:", err);
            }
        };
        fetchMedication();
    }, [medication_id]);

    function onSubmit(medication: Medication) {
        console.log("Submitting medication data:", medication);
        invoke("add_medication", { medication })
            .then((response: any) => {
                console.log("Medication added successfully:", response);
                // Reset the form after submission
                resetMedication();
            })
            .catch((error: Error) => {
                console.error("Error adding medication:", error);
            });
    };

    function deleteMedication(medication: Medication) {
        console.log("Deleting medication data:", medication);
        invoke("delete_medication", { medication })
            .then((response: any) => {
                console.log("Medication deleted successfully:", response);
                // Reset the form after submission
                resetMedication();
            })
            .catch((error: Error) => {
                console.error("Error deleting medication:", error);
            });
    }

    return (
        <div id="mf-container">
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(medication);
            }}
                className="medication-form"
            >
                <label htmlFor="id">ID</label>
                <input type="text" placeholder="ID" value={medication.id} disabled />
                <label htmlFor="name">Name</label>
                <input type="text" placeholder="Name" value={medication.name} onChange={(e) => setMedication({ ...medication, name: e.target.value })} />
                <label htmlFor="dosage">Dosage</label>
                <input type="text" placeholder="Dosage" value={medication.dosage} onChange={(e) => setMedication({ ...medication, dosage: e.target.value })} />
                <label htmlFor="cost_per_pill">Cost per Pill</label>
                <input type="number" placeholder="Cost per Pill" value={medication.cost_per_pill} onChange={(e) => setMedication({ ...medication, cost_per_pill: parseFloat(e.target.value) })} />

            </form >
            <div id="buttons">
                <button type="button" onClick={() => { window.history.back(); }}>Back</button>
                <button type="submit" onClick={() => { onSubmit(medication) }}>Update Medication</button>
                <button type="submit" onClick={() => { onSubmit(medication); window.location.href = "\\" }}>Update Medication and Return</button>
                <button type="button" onClick={() => { deleteMedication(medication) }}>Delete Medication</button>
            </div>
        </div>
    )
}


export function MedicationList() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMedications = async () => {
        try {
            const response: Medication[] = await invoke("get_medications", { searchTerm: "" });
            setMedications(response);
        } catch (err) {
            console.error("Error fetching medications:", err);
            setError("Failed to fetch medications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    return (
        <div>
            <a href="/">Home</a>
            <input type="text" placeholder="Search medications..." onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredMedications = medications.filter((medication) =>
                    medication.name.toLowerCase().includes(searchTerm)
                );
                setMedications(filteredMedications);
            }} />
            <button type="button" onClick={fetchMedications}>Refresh</button>
            <div className="medication-list-container">
                <h2>Medication List</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && medications.length === 0 && <p>No medications found.</p>}
                {!loading && !error && medications.length > 0 && (
                    <ul className="medication-list">
                        {medications.map((medication) => (
                            <li key={medication.id} >
                                <a href={"/medication/" + medication.id}>
                                    {medication.name} - {medication.id}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}