use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Height {
    pub feet: u32,
    pub inches: u32,
    pub centimeters: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Medication {
    pub id: u64,
    pub name: String,
    pub dosage: String,
    pub frequency: String,
    pub cost_per_pill: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Prescription {
    pub id: u64,
    pub medication_id: u64,
    pub medication_name: String,
    pub frequency: String,
    pub start_date: String,
    pub end_date: String,
    pub refills: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Patient {
    pub id: u64,
    pub name: String,
    pub address: String,
    pub phone_number: String,
    pub date_of_birth: String,
    pub pregnant: bool,
    pub height: Height,
    pub weight: f64,
    pub allergies: Vec<String>,
    pub prescriptions: Option<Vec<Prescription>>,
}