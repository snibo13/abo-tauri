mod datatypes;
use std::sync::{Arc, Mutex};
mod patient;
use patient::{add_patient, get_patient, get_patients, delete_patient};
mod medication;
use medication::{add_medication, get_medication, get_medications, delete_medication};
mod prescription;
use prescription::{add_prescription, get_prescription, get_prescriptions, delete_prescription};





#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize sled database
    #[cfg(debug_assertions)]
    let database_path = "/tmp/abo_db_debug";
    #[cfg(not(debug_assertions))]
    let database_path = "abo_db";

    let db = Arc::new(Mutex::new(sled::open(database_path).expect("Failed to open database")));
    tauri::Builder::default()
    .manage(db.clone()) // Pass the Arc<Mutex<Db>> to Tauri
    .on_window_event({
        let db = Arc::clone(&db); // Clone the Arc for the closure
        move |_window, event| {
            match event {
                tauri::WindowEvent::CloseRequested {..} => {
                    let db_lock = db.lock().unwrap(); // Lock the Mutex
                    db_lock.flush().expect("failed to flush db");
                    drop(db_lock);
                    // MutexGuard is automatically dropped here
                }
                _ => {}
            }
        }
    })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_patient,
            get_patient,
            get_patients,
            delete_patient,

            add_medication,
            get_medication,
            get_medications,
            delete_medication,

            add_prescription,
            get_prescription,
            get_prescriptions,
            delete_prescription,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
