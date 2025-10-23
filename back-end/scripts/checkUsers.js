// Check existing users in database
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('🔍 Checking existing users...\n');

  // Check Users table
  const [users] = await connection.execute('SELECT * FROM Users LIMIT 10');
  console.log('📋 USERS TABLE:');
  console.log('Total users:', users.length);
  users.forEach(user => {
    console.log(`- ${user.username} (${user.role}) - ID: ${user.user_id}`);
  });

  console.log('\n👨‍🏫 LECTURERS:');
  const [lecturers] = await connection.execute(`
    SELECT u.username, u.role, l.name, l.lecturer_id 
    FROM Users u 
    JOIN Lecturers l ON u.user_id = l.user_id 
    LIMIT 10
  `);
  lecturers.forEach(lec => {
    console.log(`- Username: ${lec.username}, Name: ${lec.name}, Lecturer_ID: ${lec.lecturer_id}`);
  });

  console.log('\n👨‍🎓 STUDENTS:');
  const [students] = await connection.execute(`
    SELECT u.username, u.role, s.name, s.student_id 
    FROM Users u 
    JOIN Students s ON u.user_id = s.user_id 
    LIMIT 10
  `);
  students.forEach(std => {
    console.log(`- Username: ${std.username}, Name: ${std.name}, Student_ID: ${std.student_id}`);
  });

  console.log('\n👑 ADMINS:');
  const [admins] = await connection.execute(`
    SELECT username, role FROM Users WHERE role = 'admin'
  `);
  admins.forEach(admin => {
    console.log(`- ${admin.username}`);
  });

  await connection.end();
}

checkUsers().catch(console.error);
