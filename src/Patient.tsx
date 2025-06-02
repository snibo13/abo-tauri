import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import "./App.css";
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Medication, Prescription, Patient } from './datatypes';



export function NewPatientForm() {
    const [patient, setPatient] = useState<Patient>({
        id: new Date().getTime(), // Generate a unique ID based on the current timestamp,
        name: "",
        address: "",
        // city: "",
        phone_number: "",
        date_of_birth: "",
        pregnant: false,
        height: {
            feet: 0,
            inches: 0,
            centimeters: 0
        },
        weight: 0,
        allergies: [],
        prescriptions: []
    });

    function resetPatient() {
        setPatient({
            id: new Date().getTime(), // Generate a unique ID based on the current timestamp
            // or use a library like uuid to generate a unique ID

            name: "",
            address: "",
            // city: "",
            phone_number: "",
            date_of_birth: "",
            pregnant: false,
            height: {
                feet: 0,
                inches: 0,
                centimeters: 0
            },
            weight: 0,
            allergies: [],
            prescriptions: []
        });
    }

    function onSubmit(patient: Patient) {
        console.log("Submitting patient data:", patient);
        invoke("add_patient", { patient })
            .then((response: any) => {
                console.log("Patient added successfully:", response);
                // Reset the form after submission
                setPatient({
                    id: new Date().getTime(), // Generate a unique ID based on the current timestamp
                    // or use a library like uuid to generate a unique ID

                    name: "",
                    address: "",
                    // city: "",
                    phone_number: "",
                    date_of_birth: "",
                    pregnant: false,
                    height: {
                        feet: 0,
                        inches: 0,
                        centimeters: 0
                    },
                    weight: 0,
                    allergies: [],
                    prescriptions: []
                });
            })
            .catch((error: Error) => {
                console.error("Error adding patient:", error);
            });
    };

    return (
        <div id="pf-container">
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(patient);
            }}
                className="patient-form"
            >
                <label htmlFor="id">ID</label>
                <input type="text" placeholder="ID" value={patient.id} onChange={(e) => setPatient({ ...patient, id: parseInt(e.target.value) })} disabled />
                <label htmlFor="name">Name</label>
                <input type="text" placeholder="Name" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
                <label htmlFor="address">Address</label>
                <input type="text" placeholder="Address" value={patient.address} onChange={(e) => setPatient({ ...patient, address: e.target.value })} />
                <label htmlFor="phone_number">Phone Number</label>
                <input type="tel" placeholder="Phone Number" value={patient.phone_number} onChange={(e) => setPatient({ ...patient, phone_number: e.target.value })} />
                <label htmlFor="city">Date of Birth</label>
                <input type="date" placeholder="Date of Birth" value={patient.date_of_birth} onChange={(e) => setPatient({ ...patient, date_of_birth: e.target.value })} />
                <label htmlFor="pregnant">Pregnant</label>
                <input title="pregnant" type="checkbox" checked={patient.pregnant} onChange={(e) => setPatient({ ...patient, pregnant: e.target.checked })} />
                <span id="height">
                    <label htmlFor="height">Height (ft)</label>
                    <input type="number" placeholder="Height (feet)" value={patient.height.feet} onChange={(e) => setPatient({ ...patient, height: { ...patient.height, feet: parseInt(e.target.value) } })} />
                    <label htmlFor="height">Height (in)</label>
                    <input type="number" placeholder="Height (inches)" value={patient.height.inches} onChange={(e) => setPatient({ ...patient, height: { ...patient.height, inches: parseInt(e.target.value) } })} />
                    <br></br>
                    <label htmlFor="height">Height (cm)</label>
                    <input type="number" placeholder="Height (cm)" value={patient.height.centimeters} onChange={(e) => setPatient({ ...patient, height: { ...patient.height, centimeters: parseInt(e.target.value) } })} />
                </span>
                <label htmlFor="weight">Weight</label>
                <input type="number" placeholder="Weight" value={patient.weight} onChange={(e) => setPatient({ ...patient, weight: parseInt(e.target.value) })} />
                <input type="text" placeholder="Allergies" value={patient.allergies.join(", ")} onChange={(e) => setPatient({ ...patient, allergies: e.target.value.split(", ") })} />

            </form >
            <div id="buttons">
                <button type="button" onClick={() => { window.history.back(); }}>Back</button>
                <button type="submit" onClick={() => { onSubmit(patient) }}>Add Patient</button>
                <button type="submit" onClick={() => { onSubmit(patient); window.location.href = "\\" }}>Add Patient and Return</button>
                <button type="button" onClick={resetPatient}>Clear</button>

            </div>
        </div>
    )
}


export function ExistingPatient() {
    const { patient_id } = useParams<{ patient_id: string }>();
    let patient = useRef<Patient>({
        id: parseInt(patient_id || "") || 0,
        name: "",
        address: "",
        // city: "",
        phone_number: "",
        date_of_birth: "",
        pregnant: false,
        height: {
            feet: 0,
            inches: 0,
            centimeters: 0
        },
        weight: 0,
        allergies: [],
        prescriptions: []
    });
    const [medications, setMedications] = useState<Medication[]>([]);
    const [prescription, setPrescription] = useState<Prescription>({
        id: new Date().getTime(), // Generate a unique ID based on the current timestamp,
        quantity: 0,
        instructions: "",
        medication_name: "",
        medication_id: 0,
        frequency: "",
        start_date: "",
        end_date: "",
        refills: 0,
        notes: "",
        description: "",
        doctor: ""
    });

    const [showingModal, setShowingModal] = useState(false);
    const toggleModal = () => {
        setShowingModal(!showingModal);
    };

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                if (!patient_id) {
                    console.error("No patient ID provided.");
                    return;
                }
                const id = parseInt(patient_id, 0);
                console.log(patient_id, id);
                const response: Patient = await invoke("get_patient", { patientId: id });
                console.log("Fetched patient data:", response);
                patient.current = response;
            } catch (err) {
                console.error("Error fetching patient:", err);
            }
        };
        fetchPatient();

        const fetchMedications = async () => {
            try {
                const response: Medication[] = await invoke("get_medications", { searchTerm: "" });
                setMedications(response);
            } catch (err) {
                console.error("Error fetching medications:", err);
            }
        };
        fetchMedications();
    }, [patient_id]);


    function deletePatient(id: number) {
        console.log("Deleting patient data:", id);
        invoke("delete_patient", { patientId: id })
            .then((response: any) => {
                console.log("Patient deleted successfully:", response);
                window.location.href = "/patients";
            })
            .catch((error: Error) => {
                console.error("Error deleting patient:", error);
            });
    };

    function onSubmit(patient: Patient) {
        console.log("Submitting patient data:", patient);
        invoke("add_patient", { patient })
            .then((response: any) => {
                console.log("Patient added successfully:", response);

            })
            .catch((error: Error) => {
                console.error("Error adding patient:", error);
            });
    };

    // function showPrescriptions(patient: Patient) {
    //     console.log("Showing prescriptions for patient:", patient);
    //     setShowingModal(true);
    // };

    function addPrescription() {
        prescription.medication_id = parseInt((document.querySelector("select") as HTMLSelectElement).value);
        prescription.medication_name = medications.find((med) => med.id === prescription.medication_id)?.name || "";
        console.log("Submitting prescription data:", prescription);
        // Call the backend function to add the prescription
        invoke("add_prescription", { prescription })
            .then((response: any) => {
                console.log("Prescription added successfully:", response);
                // closeCallback();
            })
            .catch((error: Error) => {
                console.error("Error adding prescription:", error);
            });

        // Add the prescription to the patient's prescriptions array
        patient.current.prescriptions?.push(prescription);
        console.log("Updated patient data:", patient.current);
        let p = patient.current
        invoke("add_patient", { patient: p })
            .then((response: any) => {
                console.log(patient);
                console.log("Patient added successfully:", response);
                setShowingModal(false);
            })
            .catch((error: Error) => {
                console.error("Error adding patient:", error);
            });

    }

    return (
        <div id="pf-container">
            <h2>Patient Details</h2>
            {showingModal &&
                <dialog className="modal">
                    <form>
                        <h2>New Prescription</h2>
                        {medications.length > 0 && (
                            <select>
                                {medications.map((medication) => (
                                    <option key={medication.id} value={medication.id}>
                                        {medication.name} - {medication.dosage}
                                    </option>
                                ))}
                            </select>
                        )}
                        <br></br>
                        {medications.length === 0 && <p>No medications found.</p>}
                        <label htmlFor="frequency">Frequency</label>
                        <input type="text" placeholder="Frequency" value={prescription.frequency} onChange={(e) => setPrescription({ ...prescription, frequency: e.target.value })} />
                        <label htmlFor="start_date">Start Date</label>
                        <input type="date" placeholder="Start Date" value={prescription.start_date} onChange={(e) => setPrescription({ ...prescription, start_date: e.target.value })} />
                        <label htmlFor="end_date">End Date</label>
                        <input type="date" placeholder="End Date" value={prescription.end_date} onChange={(e) => setPrescription({ ...prescription, end_date: e.target.value })} />
                        <label htmlFor="refills">Refills</label>
                        <input type="number" placeholder="Refills" value={prescription.refills} onChange={(e) => setPrescription({ ...prescription, refills: parseInt(e.target.value) })} />
                        <label htmlFor="notes">Notes</label>
                        <input type="text" placeholder="Notes" value={prescription.notes} onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })} />
                        <button type="button" onClick={addPrescription}>Add Prescription</button>
                        <button type="button" onClick={() => { setShowingModal(false) }}>Cancel</button>
                    </form>
                </dialog>

            }
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(patient.current);
            }}
                className="patient-form"
            >
                <label htmlFor="id">ID</label>
                <input type="text" placeholder="ID" value={patient.current.id} onChange={(e) => { patient.current.id = parseInt(e.target.value) }} disabled />
                <label htmlFor="name">Name</label>
                <input type="text" placeholder="Name" value={patient.current.name} onChange={(e) => { patient.current.name = e.target.value }} />
                <label htmlFor="address">Address</label>
                <input type="text" placeholder="Address" value={patient.current.address} onChange={(e) => { patient.current.address = e.target.value }} />
                <label htmlFor="phone_number">Phone Number</label>
                <input type="tel" placeholder="Phone Number" value={patient.current.phone_number} onChange={(e) => { patient.current.phone_number = e.target.value }} />
                <label htmlFor="city">Date of Birth</label>
                <input type="date" placeholder="Date of Birth" value={patient.current.date_of_birth} onChange={(e) => { patient.current.date_of_birth = e.target.value }} />
                <label htmlFor="pregnant">Pregnant</label>
                <input title="pregnant" type="checkbox" checked={patient.current.pregnant} onChange={(e) => { patient.current.pregnant = e.target.checked }} />
                <span id="height">
                    <label htmlFor="height">Height (ft)</label>
                    <input type="number" placeholder="Height (feet)" value={patient.current.height.feet} onChange={(e) => { patient.current.height.feet = parseFloat(e.target.value) }} />
                    <label htmlFor="height">Height (in)</label>
                    <input type="number" placeholder="Height (inches)" value={patient.current.height.inches} onChange={(e) => { patient.current.height.inches = parseFloat(e.target.value) }} />
                    <br></br>
                    <label htmlFor="height">Height (cm)</label>
                    <input type="number" placeholder="Height (cm)" value={patient.current.height.centimeters} onChange={(e) => { patient.current.height.centimeters = parseFloat(e.target.value) }} />
                </span>
                <label htmlFor="weight">Weight</label>
                <input type="number" placeholder="Weight" value={patient.current.weight} onChange={(e) => { patient.current.weight = parseInt(e.target.value) }} />
                <input type="text" placeholder="Allergies" value={patient.current.allergies.join(", ")} onChange={(e) => { { patient.current.allergies = e.target.value.split(",") } }} />

            </form >
            <div id="prescription-container">
                <h1>Prescriptions</h1>
                <button type="button" onClick={toggleModal}>Add Prescription</button>
                {patient.current.prescriptions && patient.current.prescriptions.length > 0 ? (
                    <ul className="prescription-list">
                        {patient.current.prescriptions.map((prescription) => (
                            <li key={prescription.id}>
                                {prescription.medication_name} - {prescription.frequency} - {prescription.start_date} to {prescription.end_date}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No prescriptions found.</p>
                )}
            </div>
            <div id="buttons-container">
                <button type="button" onClick={() => { window.history.back(); }}>Back</button>
                <button type="submit" onClick={() => { onSubmit(patient.current) }}>Update Patient</button>
                <button type="submit" onClick={() => { onSubmit(patient.current); window.location.href = "\\" }}>Update Patient and Return</button>
                <button type="button" onClick={() => { deletePatient(patient.current.id) }}>Delete Patient</button>

            </div>
        </div>
    )
}


export function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        try {
            const response: Patient[] = await invoke("get_patients", { searchTerm: "" });
            setPatients(response);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError("Failed to fetch patients. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div>
            <span id="head">

                <a href="/">Home</a>
                <input type="text" placeholder="Search patients..." onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredPatients = patients.filter((patient) =>
                        patient.name.toLowerCase().includes(searchTerm) ||
                        patient.id.toString().includes(searchTerm)
                    );
                    setPatients(filteredPatients);
                }} />
                <button type="button" onClick={fetchPatients}>Refresh</button>
            </span>
            <div className="patient-list-container">
                <h2>Patient List</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && patients.length === 0 && <p>No patients found.</p>}
                {!loading && !error && patients.length > 0 && (
                    <ul className="patient-list">
                        {patients.map((patient) => (
                            <li key={patient.id} >
                                <a href={"/patient/" + patient.id}>
                                    {patient.name} - {patient.id}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}