const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const { ROLES } = require("./constants/roles");
const Doctor = require("./models/Doctor");
const Patient = require("./models/Patient");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const specializations = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Oncology",
];

const hospitals = [
  "City General Hospital",
  "Popular",
  "LabAid",
  "BSH",
  "Dhaka Medical College",
  "Rangpur Medical College",
];

const conditions = [
  "Hypertension",
  "Heart Disease",
  "Thyroid Disorder",
  "Obesity",
  "GERD",
  "Eczema",
  "Insomnia",
];

const firstNames = [
  "Kamrunnahar",
  "AfrozaKhanam",
  "John",
  "Test1",
  "Test2",
  "Test3",
];

const lastNames = ["Jui", "Lucky", "Doe", "Test2", "Test3", "Test4"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generatePhone = () => {
  return `+1-${getRandomInt(200, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
};

const generateEmail = (firstName, lastName, domain = "email.com") => {
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
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
    ]);

    // Create demo user
    console.log("Creating demo user...");
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: ROLES.ADMIN,
    });

    // Create doctors
    console.log("Creating doctors...");
    const doctors = [];
    for (let i = 0; i < 3; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const doctor = await Doctor.create({
        name: `Dr. ${firstName} ${lastName}`,
        specialization: getRandomElement(specializations),
        hospital: getRandomElement(hospitals),
        phone: generatePhone(),
        email: generateEmail(firstName, lastName, "hospital.com"),
        createdAt: getRandomPastDate(12),
      });
      doctors.push(doctor);
    }
    console.log(`Created ${doctors.length} doctors`);

    // Create patients
    console.log("Creating patients...");
    const patients = [];
    for (let i = 0; i < 6; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const gender = getRandomElement(["Male", "Female", "Other"]);
      const patient = await Patient.create({
        name: `${firstName} ${lastName}`,
        age: getRandomInt(18, 85),
        gender,
        condition: getRandomElement(conditions),
        phone: generatePhone(),
        email: generateEmail(firstName, lastName),
        doctor: getRandomElement(doctors)._id,
        createdAt: getRandomPastDate(12),
      });
      patients.push(patient);
    }
    console.log(`Created ${patients.length} patients`);

    console.log("\nDatabase seeded successfully.\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
