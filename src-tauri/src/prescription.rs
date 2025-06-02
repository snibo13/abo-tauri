use std::sync::{Arc, Mutex};
use crate::datatypes::Prescription;



#[tauri::command]
pub fn add_prescription(db: tauri::State<Arc<Mutex<sled::Db>>>, prescription: Prescription) -> bool {
    // sled database operations to add a prescription
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let key = prescription.id.to_string();
    let value = serde_json::to_string(&prescription).expect("Failed to serialize prescription");
    
    match db_lock.insert(key, value.as_bytes()) {
        Ok(_) => {
            db_lock.flush().expect("failed to flush db");
            true},
        Err(_) => false,
    }
    // MutexGuard is automatically dropped here

}

#[tauri::command]
pub fn get_prescription(db: tauri::State<Arc<Mutex<sled::Db>>>, prescription_id: u64) -> Option<Prescription> {
    // sled database operations to get a prescription
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let prescription = db_lock.iter()
        .filter_map(|result| result.ok())
        .filter_map(|(_key, value)| serde_json::from_slice::<Prescription>(&value).ok())
        .filter(|prescription| prescription.id == prescription_id);
    let prescription = prescription.collect::<Vec<_>>().pop();
    match prescription {
        Some(p) => Some(p),
        None => None,
    }
}

#[tauri::command]
pub fn get_prescriptions(db: tauri::State<Arc<Mutex<sled::Db>>>, search_term: String) -> Vec<Prescription> {
    // sled database operations to get a prescription
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let prescriptions = db_lock.iter()
        .filter_map(|result| result.ok())
        .filter_map(|(_key, value)| serde_json::from_slice::<Prescription>(&value).ok())
        .filter(|prescription| prescription.id.to_string().to_lowercase().contains(&search_term.to_lowercase()) || 
                prescription.medication_name.to_lowercase().contains(&search_term.to_lowercase()));
    prescriptions.collect::<Vec<_>>()
}

#[tauri::command]
pub fn delete_prescription(db: tauri::State<Arc<Mutex<sled::Db>>>, prescription_id: u64) -> bool {
    // sled database operations to delete a prescription
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let key = prescription_id.to_string();
    match db_lock.remove(key) {
        Ok(_) => {
            db_lock.flush().expect("failed to flush db");
            true},
        Err(_) => false,
    }
    // MutexGuard is automatically dropped here
}