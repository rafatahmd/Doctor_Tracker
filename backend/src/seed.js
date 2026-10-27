const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const specializations = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Oncology',
  'Gastroenterology',
  'Ophthalmology',
  'ENT'
];

const hospitals = [
  'City General Hospital',
  'Memorial Medical Center',
  'University Hospital',
  'St. Mary\'s Hospital',
  'Regional Medical Center',
  'Community Health Hospital',
  'Metro Healthcare',
  'Central Medical Institute'
];

const conditions = [
  'Hypertension',
  'Diabetes Type 2',
  'Asthma',
  'Migraine',
  'Arthritis',
  'Depression',
  'Anxiety',
  'Back Pain',
  'Allergies',
  'Heart Disease',
  'Thyroid Disorder',
  'Obesity',
  'GERD',
  'Eczema',
  'Insomnia'
];

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson'
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generatePhone = () => {
  return `+1-${getRandomInt(200, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
};

const generateEmail = (firstName, lastName, domain = 'email.com') => {
  const num = getRandomInt(1, 999);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${num}@${domain}`;
};

// Generate a random date in the past months
const getRandomPastDate = (monthsAgo) => {
  const date = new Date();
  date.setMonth(date.getMonth() - getRandomInt(0, monthsAgo));
  date.setDate(getRandomInt(1, 28));
  return date;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({})
    ]);

    // Create demo user
    console.log('Creating demo user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123'
    });

    // Create doctors
    console.log('Creating doctors...');
    const doctors = [];
    for (let i = 0; i < 20; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const doctor = await Doctor.create({
        name: `Dr. ${firstName} ${lastName}`,
        specialization: getRandomElement(specializations),
        hospital: getRandomElement(hospitals),
        phone: generatePhone(),
        email: generateEmail(firstName, lastName, 'hospital.com'),
        createdAt: getRandomPastDate(12)
      });
      doctors.push(doctor);
    }
    console.log(`Created ${doctors.length} doctors`);

    // Create patients
    console.log('Creating patients...');
    const patients = [];
    for (let i = 0; i < 80; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const gender = getRandomElement(['Male', 'Female', 'Other']);
      const patient = await Patient.create({
        name: `${firstName} ${lastName}`,
        age: getRandomInt(18, 85),
        gender,
        condition: getRandomElement(conditions),
        phone: generatePhone(),
        email: generateEmail(firstName, lastName),
        doctor: getRandomElement(doctors)._id,
        createdAt: getRandomPastDate(12)
      });
      patients.push(patient);
    }
    console.log(`Created ${patients.length} patients`);

    console.log('\n=================================');
    console.log('Database seeded successfully!');
    console.log('=================================');
    console.log('\nDemo Login Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
