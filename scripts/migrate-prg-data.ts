import dotenv from "dotenv";
// Load environment variables
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import dbConnect from "../lib/mongodb";
import PRGSession from "../lib/models/PRGSession";

interface Presenter {
  name: string;
  link: string;
}

interface Session {
  date: string;
  paperTitle: string;
  paperLink: string;
  slidesLink?: string;
  resources?: string;
  presenter: Presenter[];
}

interface Schedule {
  [year: string]: Session[];
}

async function migratePRGData(): Promise<void> {
  try {
    // Connect to MongoDB
    await dbConnect();
    console.log("Connected to MongoDB");

    // Read the JSON file
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "data",
      "prg-schedule.json"
    );
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const schedule: Schedule = JSON.parse(jsonData);

    // Clear existing data
    await PRGSession.deleteMany({});
    console.log("Cleared existing PRG sessions");

    // Insert new data
    const sessionsToInsert = [];

    for (const [academicYear, sessions] of Object.entries(schedule)) {
      for (const session of sessions) {
        // Set empty presenter links to '/reading-group'
        const presenters = session.presenter.map((p) => ({
          ...p,
          link: p.link?.trim() || "/reading-group",
        }));
        sessionsToInsert.push({
          ...session,
          presenter: presenters,
          academicYear,
        });
      }
    }

    const result = await PRGSession.insertMany(sessionsToInsert);
    console.log(`Successfully migrated ${result.length} PRG sessions`);

    // Log summary by academic year
    const summary = await PRGSession.aggregate([
      {
        $group: {
          _id: "$academicYear",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    console.log("\nMigration Summary:");
    summary.forEach(({ _id, count }) => {
      console.log(`${_id}: ${count} sessions`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migratePRGData();
}

export default migratePRGData;
