import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { NewPatientForm, PatientList, ExistingPatient } from "./Patient";
import { NewMedicationForm, MedicationList, ExistingMedication } from "./Medication";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/add_patient" element={<NewPatientForm />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patient/:patient_id" element={<ExistingPatient />} />
        <Route path="/add_medication" element={<NewMedicationForm />} />
        <Route path="/medications" element={<MedicationList />} />
        <Route path="/medication/:medication_id" element={<ExistingMedication />} />
      </Routes>
    </BrowserRouter>
  );
}


function HomeScreen() {
  return (
    <main className="container">
      <h1>Abo Patient Management</h1>
      <div id="menu">
        <a href="/add_patient"><button className="button-1" type="button" title="add_patient">Add Patient</button></a>
        <a href="/patients"><button className="button-1" type="button" title="add_patient">View Patients</button></a>
        <a href="/add_medication"><button className="button-1" type="button" title="add_patient">Add Medication</button></a>
        <a href="/medications"><button className="button-1" type="button" title="add_patient">View Medications</button></a>
        {/* <button className="button-1" type="button" title="add_patient">Exit</button> */}
      </div>
    </main>
  )
}

export default App;
