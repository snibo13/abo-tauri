// use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};
use crate::datatypes::Medication;



#[tauri::command]
pub fn add_medication(db: tauri::State<Arc<Mutex<sled::Db>>>, medication: Medication) -> bool {
    // sled database operations to add a medication
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let key = medication.id.to_string();
    let value = serde_json::to_string(&medication).expect("Failed to serialize medication");
    
    match db_lock.insert(key, value.as_bytes()) {
        Ok(_) => {
            db_lock.flush().expect("failed to flush db");
            true},
        Err(_) => false,
    }
    // MutexGuard is automatically dropped here

}

#[tauri::command]
pub fn get_medication(db: tauri::State<Arc<Mutex<sled::Db>>>, medication_id: u64) -> Option<Medication> {
    // sled database operations to get a medication
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let medication = db_lock.iter()
        .filter_map(|result| result.ok())
        .filter_map(|(_key, value)| serde_json::from_slice::<Medication>(&value).ok())
        .filter(|medication| medication.id == medication_id);
    let medication = medication.collect::<Vec<_>>().pop();
    match medication {
        Some(p) => Some(p),
        None => None,
    }
}

#[tauri::command]
pub fn get_medications(db: tauri::State<Arc<Mutex<sled::Db>>>, search_term: String) -> Vec<Medication> {
    // sled database operations to get a medication
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let medications = db_lock.iter()
        .filter_map(|result| result.ok())
        .filter_map(|(_key, value)| serde_json::from_slice::<Medication>(&value).ok())
        .filter(|medication| medication.id.to_string().to_lowercase().contains(&search_term.to_lowercase()) || 
                medication.name.to_lowercase().contains(&search_term.to_lowercase()));
    medications.collect::<Vec<_>>()
}

#[tauri::command]
pub fn delete_medication(db: tauri::State<Arc<Mutex<sled::Db>>>, medication_id: u64) -> bool {
    // sled database operations to delete a medication
    let db_lock = db.lock().unwrap(); // Lock the Mutex
    let key = medication_id.to_string();
    match db_lock.remove(key) {
        Ok(_) => {
            db_lock.flush().expect("failed to flush db");
            true},
        Err(_) => false,
    }
    // MutexGuard is automatically dropped here
}