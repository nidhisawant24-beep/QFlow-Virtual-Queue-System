const User = require('../models/User');
const Queue = require('../models/Queue');
const Token = require('../models/Token');
const bcrypt = require('bcryptjs');

const seedDataIfEmpty = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[Seed] Database already contains records. Skipping auto-seed.');
    return;
  }

  console.log('[Seed] Database is empty. Seeding initial test data for QFlow...');

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // 1. Create Customers
  const customer1 = await User.create({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: hashedPassword,
    role: 'customer',
    phone: '+1 555-0199',
  });

  const customer2 = await User.create({
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    password: hashedPassword,
    role: 'customer',
    phone: '+1 555-0244',
  });

  const customer3 = await User.create({
    name: 'David Kim',
    email: 'david@example.com',
    password: hashedPassword,
    role: 'customer',
    phone: '+1 555-0378',
  });

  // 2. Create Target Businesses
  const businessesData = [
    {
      name: 'Dr. Arthur Pendelton',
      email: 'clinic@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 234-5678',
      businessName: 'Metro Health Clinic',
      businessCategory: 'Clinic',
      businessDescription:
        'Premier outpatient clinic providing family medicine, pediatrics, and preventive healthcare diagnostics with minimal physical wait times.',
      businessAddress: '742 Evergreen Terrace, Suite 101, Medical District',
      businessHours: {
        open: '08:30 AM',
        close: '05:30 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      queues: [
        {
          name: 'General Consultation (Dr. Smith)',
          department: 'Outpatient Medicine',
          prefix: 'MHC',
          estimatedTimePerPerson: 12,
          capacity: 40,
        },
        {
          name: 'Pediatric Care OPD',
          department: 'Pediatrics',
          prefix: 'PED',
          estimatedTimePerPerson: 15,
          capacity: 25,
        },
      ],
    },
    {
      name: 'Elena Rostova',
      email: 'bank@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 889-1234',
      businessName: 'Apex National Bank',
      businessCategory: 'Bank',
      businessDescription:
        'Full-service financial institution offering teller services, personal loan advisory, foreign exchange, and wealth management.',
      businessAddress: '100 Financial Plaza, Downtown Metro',
      businessHours: {
        open: '09:00 AM',
        close: '04:30 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      queues: [
        {
          name: 'Teller Counter & Cash Deposits',
          department: 'Teller Operations',
          prefix: 'BNK',
          estimatedTimePerPerson: 6,
          capacity: 60,
        },
        {
          name: 'Loans & Personal Banking',
          department: 'Relationship Banking',
          prefix: 'LOAN',
          estimatedTimePerPerson: 20,
          capacity: 20,
        },
      ],
    },
    {
      name: 'Dr. Marcus Vance',
      email: 'hospital@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 911-7000',
      businessName: 'City Care General Hospital',
      businessCategory: 'Hospital',
      businessDescription:
        'State-of-the-art tertiary care center equipped with 24/7 emergency response, specialized imaging, and surgical facilities.',
      businessAddress: '500 Health Boulevard, Central Metro',
      businessHours: {
        open: '08:00 AM',
        close: '08:00 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      queues: [
        {
          name: 'Radiology, CT & X-Ray Diagnostics',
          department: 'Diagnostic Imaging',
          prefix: 'RAD',
          estimatedTimePerPerson: 14,
          capacity: 50,
        },
        {
          name: 'Emergency Urgent Care Triage',
          department: 'Urgent Care',
          prefix: 'URG',
          estimatedTimePerPerson: 10,
          capacity: 80,
        },
      ],
    },
    {
      name: 'Chef Marco Rossi',
      email: 'restaurant@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 432-9876',
      businessName: 'Gourmet Bistro & Grill',
      businessCategory: 'Restaurant',
      businessDescription:
        'Artisanal Italian-Mediterranean dining featuring wood-fired specialties, hand-crafted pastas, and curated vintage wines.',
      businessAddress: '88 Waterfront Pier, Marina District',
      businessHours: {
        open: '11:30 AM',
        close: '10:30 PM',
        days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      queues: [
        {
          name: 'Indoor Dining Table (2-4 Guests)',
          department: 'Host Stand',
          prefix: 'TAB',
          estimatedTimePerPerson: 15,
          capacity: 35,
        },
        {
          name: 'Patio & Skyline Lounge Seating',
          department: 'Outdoor Lounge',
          prefix: 'PAT',
          estimatedTimePerPerson: 20,
          capacity: 30,
        },
      ],
    },
    {
      name: 'Chantal Dubois',
      email: 'salon@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 765-4321',
      businessName: 'Luxe Glamour Salon & Spa',
      businessCategory: 'Salon',
      businessDescription:
        'Bespoke hair styling, organic color treatments, therapeutic massages, and luxury aesthetic wellness.',
      businessAddress: '24 Fashion Row, Design District',
      businessHours: {
        open: '10:00 AM',
        close: '07:00 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      queues: [
        {
          name: 'Hair Cut & Master Styling',
          department: 'Salon Floor',
          prefix: 'HAIR',
          estimatedTimePerPerson: 25,
          capacity: 20,
        },
      ],
    },
    {
      name: 'Director Arthur Sterling',
      email: 'gov@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 311-4000',
      businessName: 'Central City Municipal Office',
      businessCategory: 'Government Office',
      businessDescription:
        'Civic department handling official citizen documentation, passport renewals, driver licenses, and municipal permits.',
      businessAddress: '1 City Hall Square, Civic Center',
      businessHours: {
        open: '08:30 AM',
        close: '04:00 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      queues: [
        {
          name: 'Passport & Identity Verification Desk',
          department: 'Civil Registry',
          prefix: 'GOV',
          estimatedTimePerPerson: 8,
          capacity: 100,
        },
      ],
    },
    {
      name: 'Liam Chen',
      email: 'techserve@qflow.com',
      password: hashedPassword,
      role: 'business',
      phone: '+1 (555) 678-9012',
      businessName: 'Nova TechServe Center',
      businessCategory: 'Service Center',
      businessDescription:
        'Certified electronics diagnostics, warranty servicing, screen replacements, and motherboard repair for smart devices.',
      businessAddress: '42 Silicon Avenue, Tech Quarter',
      businessHours: {
        open: '09:30 AM',
        close: '06:30 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      queues: [
        {
          name: 'Device Diagnostics & Check-in',
          department: 'Service Desk',
          prefix: 'TECH',
          estimatedTimePerPerson: 10,
          capacity: 50,
        },
      ],
    },
  ];

  for (const bData of businessesData) {
    const { queues, ...userFields } = bData;
    const businessUser = await User.create(userFields);

    for (const qData of queues) {
      const queue = await Queue.create({
        business: businessUser._id,
        name: qData.name,
        department: qData.department,
        prefix: qData.prefix,
        estimatedTimePerPerson: qData.estimatedTimePerPerson,
        capacity: qData.capacity,
        status: 'open',
        isAcceptingTokens: true,
        lastIssuedTokenNumber: 4,
        currentServingToken: `${qData.prefix}002`,
      });

      // Create realistic tokens:
      // Token 1: Completed
      const completedToken = await Token.create({
        queue: queue._id,
        business: businessUser._id,
        customer: customer3._id,
        customerName: 'David Kim',
        customerEmail: 'david@example.com',
        customerPhone: '+1 555-0378',
        tokenNumber: `${qData.prefix}001`,
        sequenceNumber: 1,
        status: 'completed',
        joinedAt: new Date(Date.now() - 45 * 60000),
        calledAt: new Date(Date.now() - 35 * 60000),
        completedAt: new Date(Date.now() - 15 * 60000),
        actualWaitTimeMinutes: 10,
      });

      // Token 2: Currently Serving
      const servingToken = await Token.create({
        queue: queue._id,
        business: businessUser._id,
        customer: customer1._id,
        customerName: 'Alex Morgan',
        customerEmail: 'alex@example.com',
        customerPhone: '+1 555-0199',
        tokenNumber: `${qData.prefix}002`,
        sequenceNumber: 2,
        status: 'serving',
        joinedAt: new Date(Date.now() - 25 * 60000),
        calledAt: new Date(Date.now() - 5 * 60000),
        actualWaitTimeMinutes: 20,
      });

      queue.currentServingTokenId = servingToken._id;
      await queue.save();

      // Token 3: Waiting (Sarah Connor)
      await Token.create({
        queue: queue._id,
        business: businessUser._id,
        customer: customer2._id,
        customerName: 'Sarah Connor',
        customerEmail: 'sarah@example.com',
        customerPhone: '+1 555-0244',
        tokenNumber: `${qData.prefix}003`,
        sequenceNumber: 3,
        status: 'waiting',
        joinedAt: new Date(Date.now() - 12 * 60000),
        estimatedWaitTimeMinutes: queue.estimatedTimePerPerson,
      });

      // Token 4: Waiting (Guest)
      await Token.create({
        queue: queue._id,
        business: businessUser._id,
        customer: null,
        customerName: 'Michael Brown (Guest)',
        customerEmail: 'michael@gmail.com',
        customerPhone: '+1 555-9011',
        tokenNumber: `${qData.prefix}004`,
        sequenceNumber: 4,
        status: 'waiting',
        joinedAt: new Date(Date.now() - 4 * 60000),
        estimatedWaitTimeMinutes: queue.estimatedTimePerPerson * 2,
      });
    }
  }

  console.log('[Seed] Sample data seeded successfully! 7 Target Businesses, Queues, and Live Tokens are active.');
};

module.exports = { seedDataIfEmpty };
