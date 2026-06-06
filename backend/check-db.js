const prisma = require('./src/config/postgres');

async function check() {
  const users = await prisma.user.findMany();
  let violations = [];
  
  // Check length constraints
  users.forEach(u => {
    if (u.username.length < 3) violations.push(`Username too short: ${u.username}`);
    if (!u.email.includes('@') || !u.email.includes('.')) violations.push(`Invalid email: ${u.email}`);
    if (u.fullName.length < 1) violations.push(`FullName empty: ${u.username}`);
    if (u.password.length < 20) violations.push(`Password hash too short: ${u.username}`);
  });
  
  // Check case-insensitive duplicates
  const lowerEmails = new Set();
  const lowerUsernames = new Set();
  users.forEach(u => {
    const lEmail = u.email.toLowerCase();
    const lUsername = u.username.toLowerCase();
    if (lowerEmails.has(lEmail)) violations.push(`Duplicate case-insensitive email: ${lEmail}`);
    if (lowerUsernames.has(lUsername)) violations.push(`Duplicate case-insensitive username: ${lUsername}`);
    lowerEmails.add(lEmail);
    lowerUsernames.add(lUsername);
  });
  
  if (violations.length > 0) {
    console.log('VIOLATIONS FOUND:');
    console.log(violations);
  } else {
    console.log('ALL CLEAR. SAFE TO APPLY CONSTRAINTS.');
  }
  process.exit(0);
}
check().catch(console.error);
