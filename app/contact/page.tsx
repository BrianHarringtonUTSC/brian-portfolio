import React from "react";
import Image from "next/image";
import Layout from "@/components/layout";

export default function ContactPage() {
  return (
    <Layout>
      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center">
        {/* Fun Graphic */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/img/contact.svg?width=inherit&height=inherit"
            alt="Contact Graphic"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        {/* Contact Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-primary mb-4">Contact Me</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Feel free to reach out via email, phone, or visit my office.
          </p>

          <div className="space-y-4">
            <p>
              📧 <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:brian.harrington@utoronto.ca"
                className="text-blue-600 hover:underline"
              >
                brian.harrington@utoronto.ca
              </a>
            </p>

            <p>
              📞 <span className="font-semibold">Telephone:</span> 416.287.7457
            </p>

            <p>
              📠 <span className="font-semibold">Fax:</span> 416.287.7409
            </p>

            <p>
              🏢 <span className="font-semibold">Building:</span> IA 4146
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
