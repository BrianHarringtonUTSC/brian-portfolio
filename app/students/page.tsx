import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import members from "@/public/data/members.json";

interface Student {
  memberName: string;
  memberImage: string;
  memberURL: string;
  memberDesc: string;
}

export default function StudentsPage() {
  const students: Student[] = members;

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          Past Students
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Amazing students I&apos;ve had the pleasure of working with during my time at UTSC
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {students.map((student, index) => (
            <div
              key={index}
              className="bg-secondary p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center"
            >
              {student.memberURL ? (
                <Link
                  href={student.memberURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full h-56 mb-4 overflow-hidden rounded-lg"
                >
                  <Image
                    src={student.memberImage}
                    alt={student.memberName}
                    fill
                    className="object-cover"
                  />
                </Link>
              ) : (
                <div className="relative w-full h-56 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={student.memberImage}
                    alt={student.memberName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="w-full text-center">
                <h2 className="text-xl font-semibold text-primary">
                  {student.memberName}
                </h2>
                {student.memberDesc && (
                  <p className="text-sm text-muted-foreground">
                    {student.memberDesc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
