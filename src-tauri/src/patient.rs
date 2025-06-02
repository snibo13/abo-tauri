use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};
use crate::datatypes::{Height, Medication, Prescription, Patient};



#[tauri::command]
pub fn add_patient(db: tauri::State<Arc<Mutex<sled::Db>>>, patient: Patient) -> bool {
    // sled database operations to add a patient
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let key = patient.id.to_string();
    let value = serde_json::to_string(&patient).expect("Failed to serialize patient");
    
    match db_lock.insert(key, value.as_bytes()) {
        Ok(_) => {
            db_lock.flush().expect("failed to flush db");
            true},
        Err(_) => false,
    }
    // MutexGuard is automatically dropped here

}

#[tauri::command]
pub fn get_patient(db: tauri::State<Arc<Mutex<sled::Db>>>, patient_id: u64) -> Option<Patient> {
    // sled database operations to get a patient
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let patient = db_lock.iter()
        .filter_map(|result| result.ok())
        .filter_map(|(_key, value)| serde_json::from_slice::<Patient>(&value).ok())
        .filter(|patient| patient.id == patient_id);
    let patient = patient.collect::<Vec<_>>().pop();
    match patient {
        Some(p) => Some(p),
        None => None,
    }
}

#[tauri::command]
pub fn get_patients(db: tauri::State<Arc<Mutex<sled::Db>>>, search_term: String) -> Vec<Patient> {
    // sled database operations to get a patient
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let patients = db_lock.iter()
        .filter_map(|result| result.ok())
        .filter_map(|(_key, value)| serde_json::from_slice::<Patient>(&value).ok())
        .filter(|patient| patient.id.to_string().to_lowercase().contains(&search_term.to_lowercase()) || 
                patient.name.to_lowercase().contains(&search_term.to_lowercase()));
    patients.collect::<Vec<_>>()
}

#[tauri::command]
pub fn delete_patient(db: tauri::State<Arc<Mutex<sled::Db>>>, patient_id: u64) -> bool {
    // sled database operations to delete a patient
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let key = patient_id.to_string();
    match db_lock.remove(key) {
        Ok(_) => {
            db_lock.flush().expect("failed to flush db");
            true},
        Err(_) => false,
    }
    // MutexGuard is automatically dropped here

}