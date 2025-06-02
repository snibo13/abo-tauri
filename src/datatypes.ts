
export type Height = {
    feet: number;
    inches: number;
    centimeters: number;
}

export type Medication = {
    id: number;
    name: string;
    dosage: string;
    cost_per_pill: number;
}

export type Prescription = {
    id: number;
    medication_id: number;
    medication_name: string;
    quantity: number;
    instructions: string;
    description: string;
    doctor: string;
    frequency: string;
    start_date: string;
    end_date: string;
    refills: number;
    notes: string;
}

export type Patient = {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    date_of_birth: string;
    pregnant: boolean;
    height: Height;
    weight: number;
    allergies: string[];
    prescriptions?: Prescription[]
}