import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/layout";
import news from "@/public/data/news.json";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/img/brian_headshot.webp?width=200&height=200"
          alt="Dr. Brian Harrington"
          width={200}
          height={200}
          className="rounded-full"
        />
        <h1 className="text-4xl font-bold">Brian Harrington</h1>
        <p className="text-xl text-center max-w-2xl">
          Professor, Teaching Stream <br />
          Department of Computer and Mathematical Sciences <br />
          University of Toronto Scarborough <br />
          <a href="mailto:brian.harrington@utoronto.ca">
            brian.harrington@utoronto.ca
          </a>
        </p>

        <section className="mt-8 bg-secondary p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-primary mb-4">Bio</h2>
          <p className="text-base text-foreground leading-relaxed">
            I am a Teaching Stream Professor in the{" "}
            <a className="underline" href="https://www.utsc.utoronto.ca/cms/">
              Department of Computer and Mathematical Sciences
            </a>{" "}
            at the{" "}
            <a className="underline" href="https://www.utsc.utoronto.ca/home/">
              University of Toronto Scarborough.
            </a>{" "}
            My research focuses on Computer Science Education and Pedagogy, with
            a special emphasis on involving undergraduate students in research.
          </p>
          <p className="text-base text-foreground leading-relaxed mt-4">
            I completed my Doctorate in Computer Science at the{" "}
            <a className="underline" href="https://www.cs.ox.ac.uk/">
              Oxford University Department of Computer Science
            </a>{" "}
            under the supervision of{" "}
            <a
              className="underline"
              href="https://cambridgequantum.com/scientist/stephen-clark/"
            >
              Dr. Stephen Clark.
            </a>{" "}
            My research focused on the intersection of Artificial Intelligence
            and Natural Language Processing, in particular, the automated
            construction of Semantic Network with the ASKNet system.
          </p>
          <p className="text-base text-foreground leading-relaxed mt-4">
            Prior to joining UTSC, I held a Research and Tutorial Fellowship in
            Computer Science at{" "}
            <a className="underline" href="https://www.keble.ox.ac.uk/">
              Keble College, Oxford.
            </a>{" "}
            And worked as a Research Scientist in the Medical Informatics Group
            at the{" "}
            <a className="underline" href="https://uwm.edu/">
              University of Wisconsin Milwaukee.
            </a>
          </p>
        </section>

        {/* Latest News Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Latest News
          </h2>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.length > 0 ? (
              news.map((item, index) => (
                <Card
                  key={index}
                  className="bg-card shadow-lg rounded-lg overflow-hidden"
                >
                  <Image
                    src={item.link}
                    alt={item.title}
                    width={800}
                    height={400}
                    className="w-full h-60 object-cover"
                    priority
                  />
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No news available.</p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
