/**
 * ADMIN SETUP SCRIPT
 * 
 * Run this script to make a user an admin:
 *   node scripts/make-admin.js <email>
 * 
 * Example:
 *   node scripts/make-admin.js admin@example.com
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function makeAdmin(email) {
  if (!email) {
    console.error("❌ Please provide an email address.");
    console.log("Usage: node scripts/make-admin.js <email>");
    process.exit(1);
  }

  console.log(`\n🔍 Looking for user: ${email}...`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      console.log("💡 Make sure the user has signed up on the platform first.");
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (Current role: ${user.role})`);

    if (user.role === "ADMIN") {
      console.log("ℹ️  This user is already an ADMIN. No changes made.");
      process.exit(0);
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`\n🎉 SUCCESS! ${updated.name} (${email}) is now an ADMIN.`);
    console.log("They can now access the Admin Dashboard at /admin");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
makeAdmin(email);
