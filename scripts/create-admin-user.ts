// Load environment variables FIRST before any other imports
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";

async function createAdminUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin User";

  if (!email || !password) {
    console.error(
      "Usage: tsx scripts/create-admin-user.ts <email> <password> [name]"
    );
    console.error(
      "Example: tsx scripts/create-admin-user.ts admin@example.com mypassword123 'John Doe'"
    );
    process.exit(1);
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("\n=== Admin User Configuration ===");
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Hashed Password: ${hashedPassword}`);
    console.log("\nAdd this to your NextAuth configuration:");
    console.log(
      "{\n" +
        `  id: "1",\n` +
        `  email: "${email}",\n` +
        `  name: "${name}",\n` +
        `  password: "${hashedPassword}",\n` +
        `  role: "admin"\n` +
        "}"
    );

    console.log("\n=== Login Credentials ===");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  createAdminUser();
}

export default createAdminUser;
