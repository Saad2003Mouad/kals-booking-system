import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import { citiesData } from "@/lib/cityContent";
import { FadeInUp } from "@/components/MotionWrapper";
import Script from "next/script";

export function generateStaticParams() {
  return Object.keys(cityContent).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const content = cityContent[params.slug];
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const content = cityContent[params.slug];

  if (!content) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Ice Cream Truck Catering",
    provider: {
      "@type": "LocalBusiness",
      name: "Boston Legend",
      telephone: "617-999-3803",
    },
    areaServed: {
      "@type": "City",
      name: content.name,
    },
    description: content.metaDescription,
  };

  return (
    <>
      <Script
        id={`json-ld-city-${params.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <div className="site-wrapper">
        <section className="page-head">
          <div className="w-layout-blockcontainer container w-container">
            <FadeInUp>
              {/* AI Marketing Badge Injection */}
              <div
                style={{
                  display: "inline-block",
                  background: "#000223",
                  color: "#FFA000",
                  padding: "8px 16px",
                  borderRadius: "50px",
                  fontSize: "0.875rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                World's First AI-Powered Ice Cream Truck Reservation Platform
              </div>
              <h1 className="h1-page-hed blog-title">{content.h1}</h1>
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif"
                loading="lazy"
                width="426"
                height="36"
                alt=""
                className="h1-page-line"
              />
            </FadeInUp>
          </div>
        </section>
        <main className="main-2">
          <div className="w-layout-blockcontainer container w-container">
            <FadeInUp delay={0.2}>
              <img
                src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681b3ac7047cea7769550b1f_image13.avif"
                loading="lazy"
                alt={`Ice Cream Truck in ${content.name}`}
                className="blog-img"
              />
              <div
                className="blog-rtb w-richtext"
                dangerouslySetInnerHTML={{ __html: content.introHtml }}
              />

              {content.faq && content.faq.length > 0 && (
                <div style={{ marginTop: "60px" }}>
                  <h2>Frequently Asked Questions in {content.name}</h2>
                  {content.faq.map((q, i) => (
                    <div key={i} style={{ marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                        {q.question}
                      </h3>
                      <p>{q.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </FadeInUp>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
