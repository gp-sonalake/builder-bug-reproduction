import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import { GetStaticProps } from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import "../builder-registry";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Define a function that fetches the Builder
// content for a given page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Fetch the builder content for the given page
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/builder-array-length-binding-bug",
      },
    })
    .toPromise();

  // Return the page content as props
  return {
    props: {
      page: page || null,
    },
    // Revalidate the content every 5 seconds
    revalidate: 5,
  };
};

// Define the Page component
export default function Page({ page }: { page: BuilderContent | null }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  // If the page content is not available
  // and not in preview mode, show a 404 error page
  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // If the page content is available, render
  // the BuilderComponent with the page content
  return (
    <>
      <Head>
        <title>{page?.data?.title}</title>
      </Head>
      {/* Render the Builder page */}
      <BuilderComponent
        model="page"
        content={page || undefined}
        data={{ arr: ["a", "b", "c"] }}
      />
    </>
  );
}
