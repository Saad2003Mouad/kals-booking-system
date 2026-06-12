import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import { FadeInUp } from "@/components/MotionWrapper";
import Script from "next/script";

// Define the content for all occasions
const occasionsData = {
  "birthday-parties": {
    title: "Birthday Parties",
    subtitle: "Boston Legend Ice Cream Truck For Unforgettable Birthdays",
    description:
      "Make your birthday party legendary with Boston Legend Ice Cream Truck! We’re here to turn your celebration into a sweet and unforgettable experience. With premium ice cream, professional service, and a festive atmosphere, our truck delivers smiles and deliciousness for guests of all ages.",
    bullets: [
      "Wide Flavor Selection: Something to delight every taste bud.",
      "Fun and Festive Ambiance: Adds excitement and charm to your event.",
      "Customizable Packages: Tailored to fit your party’s needs.",
      "Professional and Friendly Service: Dedicated to making your event perfect.",
    ],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "block-parties": {
    title: "Block Parties",
    subtitle: "Turn Your Street Into A Celebration",
    description:
      "Boston Legend isn’t just an ice cream bus – it’s the life of the block party! We roll up with legendary scoops, good vibes, and a whole lot of fun, turning every street into a sweet celebration.",
    bullets: [
      "Perfect for Neighborhoods: Brings everyone together.",
      "Easy Setup: We park, serve, and clean up.",
      "Music & Fun: The classic truck experience.",
      "Memorable Moments: A sweet treat for the whole block.",
    ],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "corporate-parties": {
    title: "Corporate Parties",
    subtitle: "Bring the Scoop to the Suits",
    description:
      "Boston Legend serves premium ice cream straight from our iconic bus, turning corporate events into unforgettable experiences. Whether it’s a staff appreciation day, product launch, or just a reason to treat the team – we bring the chill, you bring the smiles!",
    bullets: [
      "Employee Appreciation: Show your team some love.",
      "Flexible Timing: We work around your schedule.",
      "Brand Activation: Great for drawing a crowd.",
      "High Volume: Capable of serving hundreds quickly.",
    ],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  fundraisers: {
    title: "Fundraisers",
    subtitle: "Sweeten Your Cause",
    description:
      "Boston Legend adds a sweet touch to your fundraiser by serving premium ice cream to your guests while raising funds for a great cause.",
    bullets: ["Give Back: A portion goes to your cause."],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "launch-parties": {
    title: "Launch Parties",
    subtitle: "Launch In Style",
    description:
      "Take your product launch to the next level with Boston Legend’s mobile ice cream service.",
    bullets: ["Memorable Impressions: Leave a lasting mark."],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "marketing-events": {
    title: "Marketing Events",
    subtitle: "Elevate Your Brand",
    description:
      "Boston Legend adds the perfect touch to your marketing events, serving premium ice cream directly from our iconic truck.",
    bullets: ["Draw Crowds: Everyone loves free ice cream."],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "movie-rental": {
    title: "Movie Rental",
    subtitle: "Movie Night Magic",
    description:
      "Make your movie rental party even sweeter with Boston Legend’s ice cream truck.",
    bullets: ["Perfect Pairing: Ice cream and a movie."],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "photo-sessions": {
    title: "Photo Sessions",
    subtitle: "Capture The Moment",
    description:
      "Turn your photo session into a fun, memorable experience with Boston Legend’s ice cream truck.",
    bullets: ["Great Props: Our truck is photogenic."],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  reunions: {
    title: "Reunions",
    subtitle: "Bring Everyone Together",
    description:
      "Boston Legend’s ice cream truck is the perfect addition to your reunion.",
    bullets: ["Nostalgia: Classic ice cream truck vibes."],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "school-occasions": {
    title: "School Occasions",
    subtitle: "Sweeten Your School Event",
    description:
      "Whether it's a school celebration, field day, or graduation party, Boston Legend's ice cream truck brings premium treats directly to your event.",
    bullets: ["Kid Favorite: Guaranteed smiles."],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "sports-occasions": {
    title: "Sports Occasions",
    subtitle: "Fuel The Fun",
    description:
      "After the game, it's time to cool down and celebrate with Boston Legend’s ice cream truck.",
    bullets: ["Post-Game Treat: Refreshing and sweet."],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "wedding-receptions": {
    title: "Wedding Receptions",
    subtitle: "Sweeten Your Big Day",
    description:
      "Boston Legend’s ice cream truck is the perfect way to cool down and sweeten up your wedding reception.",
    bullets: ["Unique Dessert: Stand out from the crowd."],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },

  // NEW OCCASIONS ADDED
  "employee-appreciation": {
    title: "Employee Appreciation",
    subtitle: "Show Your Team Some Love",
    description:
      "Boost morale and show your employees how much you value them with a surprise visit from the Boston Legend Ice Cream Truck.",
    bullets: ["Instant Morale Boost", "Great for Team Building"],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "hoa-events": {
    title: "HOA Events",
    subtitle: "Bring the Neighborhood Together",
    description:
      "Make your next HOA meeting or neighborhood gathering a hit with premium ice cream for all residents.",
    bullets: ["Family Friendly", "Community Building"],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "apartment-community-events": {
    title: "Apartment Community Events",
    subtitle: "Treat Your Residents",
    description:
      "Organize the perfect resident appreciation day with a sweet ice cream social right in your parking lot.",
    bullets: ["High Turnout", "Resident Satisfaction"],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "senior-center-events": {
    title: "Senior Center Events",
    subtitle: "Nostalgic Sweet Treats",
    description:
      "Bring back the classic ice cream truck memories with a delightful visit to your senior living community.",
    bullets: ["Classic Flavors", "Nostalgic Experience"],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "company-picnic": {
    title: "Company Picnic",
    subtitle: "The Ultimate Picnic Dessert",
    description:
      "No company picnic is complete without ice cream! We'll pull right up to the park and serve your entire staff.",
    bullets: ["Outdoor Friendly", "Fast Service"],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "grand-opening": {
    title: "Grand Opening",
    subtitle: "Draw a Huge Crowd",
    description:
      "Make sure your grand opening gets noticed by offering free ice cream to your first customers from our legendary truck.",
    bullets: ["Attract Foot Traffic", "Memorable First Impression"],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "summer-camp": {
    title: "Summer Camp",
    subtitle: "The Highlight of Camp",
    description:
      "Surprise your campers with an ice cream truck visit! It's the perfect mid-summer treat to keep spirits high.",
    bullets: ["Kid Approved", "Allergy Friendly Options"],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "college-events": {
    title: "College Events",
    subtitle: "Campus Favorite",
    description:
      "From welcome week to finals destress days, college students love when the Boston Legend truck rolls onto campus.",
    bullets: ["Late Night Options", "High Volume Service"],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  "graduation-parties": {
    title: "Graduation Parties",
    subtitle: "Celebrate the Grad",
    description:
      "Celebrate their big achievement with a sweet treat that everyone will enjoy. Perfect for backyard grad parties.",
    bullets: ["Easy Dessert Catering", "Fun Photo Ops"],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "church-events": {
    title: "Church Events",
    subtitle: "Fellowship and Ice Cream",
    description:
      "Enhance your church picnic, VBS, or youth group event with ice cream for the whole congregation.",
    bullets: ["Family Focused", "Community Bonding"],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
  festivals: {
    title: "Festivals",
    subtitle: "Feed the Crowd",
    description:
      "Boston Legend is equipped to handle massive crowds at music festivals, street fairs, and town days.",
    bullets: ["Fast Paced Service", "Eye Catching Truck"],
    image:
      "https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6811725689a09a644ee08f1b_birthday-parties-boston-legend-ice-cream-truck-catering.avif",
  },
  "wedding-ice-cream-truck": {
    title: "Wedding Ice Cream Truck",
    subtitle: "The Sweetest Exit",
    description:
      "Serve ice cream during cocktail hour or as a late-night snack before your guests head home. The perfect wedding addition.",
    bullets: ["Elegant Presentation", "Unforgettable Experience"],
    image:
      "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif",
  },
};

export function generateStaticParams() {
  return Object.keys(occasionsData).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const data = occasionsData[params.slug as keyof typeof occasionsData];
  if (!data) return {};
  return {
    title: `${data.title} | Boston Ice Cream Hire`,
    description: data.description,
  };
}

export default function OccasionPage({ params }: { params: { slug: string } }) {
  const data = occasionsData[params.slug as keyof typeof occasionsData];
  if (!data) notFound();

  return (
    <>
      <SiteHeader />
      <div className="site-wrapper">
        <section className="page-head">
          <div className="w-layout-blockcontainer container w-container">
            <FadeInUp>
              <div className="w-embed">
                <h1 className="h1-page-hed">
                  <span className="page-titel-top">Boston Legend</span>
                  <br />
                  Ice Cream Truck Rental for
                  <br />
                  <span className="title-event">{data.title}</span>
                </h1>
              </div>
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif"
                loading="lazy"
                width="429"
                height="36"
                alt=""
                className="h1-page-line"
              />
            </FadeInUp>
          </div>
        </section>

        <main className="main">
          <div className="w-layout-blockcontainer container w-container">
            <div className="border-titel">Boston {data.title} Bliss</div>
            <div className="row mb-100">
              <div className="service-page-col-info">
                <FadeInUp>
                  {/* AI Feature Trust Badge */}
                  <div
                    style={{
                      display: "inline-block",
                      background: "#FFA000",
                      color: "#000223",
                      padding: "6px 12px",
                      borderRadius: "50px",
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      marginBottom: "15px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Serving Massachusetts Since 1999 • Real-Time Availability
                  </div>

                  <h2 className="h2-service-title">{data.subtitle}</h2>
                  <p>{data.description}</p>
                  <h3 className="service-h3">
                    Benefits of Booking Our Ice Cream Truck:
                  </h3>
                  <div className="rtb w-richtext">
                    <ul role="list">
                      {data.bullets.map((b, i) => (
                        <li key={i}>
                          <strong>{b}</strong>
                        </li>
                      ))}
                    </ul>
                    <p>
                      🎉 Let us make your {data.title.toLowerCase()} a truly
                      legendary celebration!
                    </p>
                  </div>
                  <div className="w-layout-hflex reserve-row">
                    <div className="w-layout-hflex flex-center">
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681811af9d6a90168b8ec603_boston-legend-ice-cream-truck-phone-number.avif"
                        loading="lazy"
                        width="50"
                        height="50"
                        alt="CALL Boston legend ice-cream truck"
                        className="about-phone-pic"
                      />
                      <a href="tel:6179993803" className="w-inline-block">
                        <div className="phome-title">For booking</div>
                        <div className="about-phone-num">
                          <strong>
                            617-999-3803
                            <br />
                          </strong>
                        </div>
                      </a>
                    </div>
                    <a href="/booking" className="link-bt menu-bt">
                      Reserve Now
                    </a>
                  </div>
                </FadeInUp>
              </div>
              <div className="service-page-coll-img">
                <FadeInUp delay={0.2}>
                  <div className="service-min-img">
                    <img
                      src={data.image}
                      loading="lazy"
                      alt={data.subtitle}
                      className="servie-img"
                    />
                  </div>
                </FadeInUp>
              </div>
            </div>
          </div>

          <div className="w-layout-blockcontainer container-w book w-container">
            <FadeInUp>
              <div className="book-row">
                <div className="w-layout-hflex page-book-title">
                  <div className="h1-titel">
                    Delight your guests with a touch of sweet elegance — book
                    the Boston Legend ice cream truck now
                  </div>
                </div>
                <div className="home-header-img-block">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif"
                    loading="lazy"
                    width="910"
                    height="607"
                    alt="Catering &amp; Events"
                    className="home-header-img"
                  />
                </div>
                <div className="home-head-block">
                  <div className="home-form-block">
                    {/* Booking Message CTA Integration */}
                    <div
                      className="w-form premium-cta-container"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "60px 20px",
                        background:
                          "linear-gradient(135deg, rgba(255, 160, 0, 0.1), rgba(243, 145, 189, 0.1))",
                        borderRadius: "24px",
                        border: "1px solid rgba(255,160,0,0.3)",
                        minHeight: "400px",
                        textAlign: "center",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                        margin: "40px 0",
                      }}
                    >
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
                        alt="Boston Legend Logo"
                        style={{
                          height: "60px",
                          marginBottom: "30px",
                          objectFit: "contain",
                          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                        }}
                      />
                      <h3
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 900,
                          fontSize: "2rem",
                          color: "#000223",
                          marginBottom: "10px",
                        }}
                      >
                        Ready to sweeten your event?
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontSize: "1.1rem",
                          color: "#666",
                          marginBottom: "30px",
                          maxWidth: "400px",
                        }}
                      >
                        Book Your Ice Cream Truck In Less Than 3 Minutes.
                      </p>
                      <a
                        href="/booking"
                        className="link-bt w-button hover-cta"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontSize: "1.25rem",
                          padding: "20px 48px",
                          borderRadius: "50px",
                          background: "#000223",
                          color: "#FFA000",
                          boxShadow: "0 10px 30px rgba(0, 2, 35, 0.3)",
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          display: "inline-block",
                        }}
                      >
                        Start Your Booking 🍦
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </main>

        <section className="page-services-sec">
          <div className="servie-bg-stik">
            <img
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg.avif"
              loading="lazy"
              width="1926"
              height="1116"
              alt=""
              srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg.avif 1926w"
              sizes="(max-width: 1926px) 100vw, 1926px"
              className="image"
            />
          </div>
          <div className="w-layout-blockcontainer container service w-container">
            <div className="border-titel">Events &amp; Caterings</div>
            <h2 className="h1-titel-80">
              Making Your Special Occasion Even Sweeter With Our Unique Flavors!
            </h2>
            <div className="page-service-collection w-dyn-list">
              <div role="list" className="row w-dyn-items">
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Birthday Parties</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816624976e3390d4b6ada0a_birthday-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Birthday Parties"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Ice cream catering for birthday parties – adding a sweet
                      and creamy touch to your celebration!
                    </div>
                    <div className="card-shortdiscription">
                      We bring the joy of ice cream to birthday parties with our
                      catering service, serving up delightful flavors that
                      everyone will love.
                    </div>
                    <a
                      href="/occasions/birthday-parties"
                      aria-current="page"
                      className="service-card-link w-inline-block w--current"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Block Parties</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816633f16bb926081bbec13_block-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Block Parties"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Boston Legend brings legendary ice cream and good vibes
                      straight to your block party!
                    </div>
                    <div className="card-shortdiscription">
                      Boston Legend isn’t just an ice cream bus – it’s the life
                      of the block party! We roll up with legendary scoops, good
                      vibes, and a whole lot of fun, turning every street into a
                      sweet celebration.
                    </div>
                    <a
                      href="/occasions/block-parties"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Corporate Parties</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816663f16bb926081bd7e68_corporate-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Corporate Parties"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Bring the scoop to the suits – Boston Legend makes your
                      corporate party cooler
                    </div>
                    <div className="card-shortdiscription">
                      Boston Legend serves premium ice cream straight from our
                      iconic bus, turning corporate events into unforgettable
                      experiences. Whether it’s a staff appreciation day,
                      product launch, or just a reason to treat the team – we
                      bring the chill, you bring the smiles!
                    </div>
                    <a
                      href="/occasions/corporate-parties"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Fundraisers</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816666e96c820f30ad580af_fundraisers-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Fundraisers"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Sweeten your cause with Boston Legend – ice cream that
                      supports your mission!
                    </div>
                    <div className="card-shortdiscription">
                      Boston Legend adds a sweet touch to your fundraiser by
                      serving premium ice cream to your guests while raising
                      funds for a great cause. Our ice cream bus creates a fun,
                      engaging atmosphere that makes giving back even more
                      delicious!
                    </div>
                    <a
                      href="/occasions/fundraisers"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Launch Parties</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816674df2b824328788324a_launch-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Launch Parties"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Launch in style with Boston Legend – where every scoop
                      makes your event legendary
                    </div>
                    <div className="card-shortdiscription">
                      Take your product launch to the next level with Boston
                      Legend’s mobile ice cream service. Our iconic bus delivers
                      premium, ready-to-serve ice cream straight to your event,
                      bringing a sweet, fun vibe that will leave your guests
                      talking long after the launch is over.
                    </div>
                    <a
                      href="/occasions/launch-parties"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Marketing Events</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681667598039935425746181_marketing-events-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Marketing Events"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Elevate your marketing event with Boston Legend – the ice
                      cream that makes your brand unforgettable!
                    </div>
                    <div className="card-shortdiscription">
                      Boston Legend adds the perfect touch to your marketing
                      events, serving premium ice cream directly from our iconic
                      truck. Whether you’re promoting a new product or
                      connecting with clients, we make your event cool,
                      memorable, and full of flavor.
                    </div>
                    <a
                      href="/occasions/marketing-events"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Movie Rental</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/68166834803993542574dbd5_movie-rental-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Movie Rental"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Bring the movie night magic to life with Boston Legend –
                      ice cream truck style!
                    </div>
                    <div className="card-shortdiscription">
                      Make your movie rental party even sweeter with Boston
                      Legend’s ice cream truck. We deliver premium ice cream
                      right to your door, setting the perfect scene for a fun,
                      laid-back night with friends, family, and your favorite
                      films.
                    </div>
                    <a
                      href="/occasions/movie-rental"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Photo Sessions</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816684563bd8dbd187e81b0_photo-shoots-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Photo Sessions"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Capture the moment with Boston Legend – ice cream that
                      adds flavor to your photo session!
                    </div>
                    <div className="card-shortdiscription">
                      Turn your photo session into a fun, memorable experience
                      with Boston Legend’s ice cream truck. Whether it’s for a
                      special event or just a fun photo shoot, our premium ice
                      cream brings smiles, flavor, and a sweet touch to every
                      shot.
                    </div>
                    <a
                      href="/occasions/photo-sessions"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Reunions</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681668e67ee8c804a2972b05_reunions-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Reunions"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Make your reunion unforgettable with Boston Legend – ice
                      cream that brings everyone together!
                    </div>
                    <div className="card-shortdiscription">
                      Boston Legend’s ice cream truck is the perfect addition to
                      your reunion. We serve premium ice cream that sparks joy
                      and nostalgia, turning your gathering into a sweet
                      celebration of old memories and new moments.
                    </div>
                    <a
                      href="/occasions/reunions"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">School Occasions</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816690e96c820f30ad6f369_school-events-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="School Occasions"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Sweeten your school occasion with Boston Legend – ice
                      cream that makes every event extra special!
                    </div>
                    <div className="card-shortdiscription">
                      Whether it's a school celebration, field day, or
                      graduation party, Boston Legend's ice cream truck brings
                      premium treats directly to your event. We add a fun,
                      delicious twist to any school occasion, creating sweet
                      memories for students, teachers, and parents alike.
                    </div>
                    <a
                      href="/occasions/school-occasions"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Sports Occasions</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/68166983f7a8aada9a73b175_sporting-events-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Sports Occasions"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Celebrate your victory with Boston Legend – the ice cream
                      truck that fuels the fun!
                    </div>
                    <div className="card-shortdiscription">
                      After the game, it's time to cool down and celebrate with
                      Boston Legend’s ice cream truck. Whether it's a team
                      victory, a tournament, or just a fun day on the field, we
                      bring premium ice cream straight to your event, turning
                      every sports occasion into a delicious celebration.
                    </div>
                    <a
                      href="/occasions/sports-occasions"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
                <div role="listitem" className="service-item w-dyn-item">
                  <div className="pag-service-card">
                    <div className="w-layout-hflex service-name-flex">
                      <h2 className="secive-card-name">Wedding Receptions</h2>
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681669a6bc647287a8bf0f22_wedding-receptions-boston-legend-ice-cream-truck-catering-icon.svg"
                        loading="lazy"
                        alt="Wedding Receptions"
                        className="service-cart-icon"
                      />
                    </div>
                    <div className="card-intro">
                      Sweeten your wedding reception with Boston Legend – ice
                      cream that makes your day even more special!
                    </div>
                    <div className="card-shortdiscription">
                      Boston Legend’s ice cream truck is the perfect way to cool
                      down and sweeten up your wedding reception. We bring
                      premium, ready-to-serve ice cream directly to your
                      celebration, offering a fun and delicious treat that your
                      guests will remember long after the last dance.
                    </div>
                    <a
                      href="/occasions/wedding-receptions"
                      className="service-card-link w-inline-block"
                    >
                      <div>Read more </div>
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816d54b38f6bb5a307d8e3a_blue-arrow.png"
                        loading="lazy"
                        width="12"
                        height="8"
                        alt=""
                        className="link-arrrow"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="review-sec">
          <div className="review-title-block">
            <div className="review-title-card">
              <div className="border-titel">Reviews</div>
              <h2 className="h1-titel white">
                Smiles, Stories, and Sweet Moments
              </h2>
              <div className="white-text">
                Hear from our happy customers about how we made their events
                unforgettable! From weddings to birthdays and everything in
                between, our ice cream truck has brought joy and delicious
                memories to countless celebrations. Let their experiences
                inspire yours!
              </div>
            </div>
          </div>
          <div className="review-block">
            <div className="review-card">
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681b137e210aa69b3820f2e4_double-quotes.avif"
                loading="lazy"
                width="142"
                height="137"
                alt=""
                className="double-quotes"
              />
              <div className="swiper swiper-review w-dyn-list">
                <div role="list" className="swiper-wrapper w-dyn-items">
                  <div
                    role="listitem"
                    className="swiper-slide _w-100 w-dyn-item"
                  >
                    <div className="w-layout-hflex flex-review-center">
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681ae16f2f31f94216cc643a_john-thompson.avif"
                        loading="lazy"
                        width="152"
                        height="189"
                        alt="Perfect for Corporate Parties!"
                        className="rewie-pic"
                      />
                      <div className="review-txt-block">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681b03bd1ff6e342fea4c12b_stars.png"
                          loading="lazy"
                          width="131"
                          height="22"
                          alt="Five stare rating for Boston Legend ice cream truck"
                          className="stars"
                        />
                        <div className="review-title">
                          Perfect for Corporate Parties!
                        </div>
                        <div>
                          "We hired the Boston Legend Ice Cream Truck for our
                          corporate party, and it was fantastic! Great selection
                          of flavors, friendly staff, and a fun experience.
                          Highly recommend for company events!"
                        </div>
                        <div className="w-layout-hflex review-name-box">
                          <div className="review-name">John Thompson</div>
                          <div className="name-separator">|</div>
                          <div>Event Coordinator</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    role="listitem"
                    className="swiper-slide _w-100 w-dyn-item"
                  >
                    <div className="w-layout-hflex flex-review-center">
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681ae17947c603ee5ce63e25_michael-t.avif"
                        loading="lazy"
                        width="152"
                        height="189"
                        alt="Unforgettable Ice Cream Experience!"
                        className="rewie-pic"
                      />
                      <div className="review-txt-block">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681b03bd1ff6e342fea4c12b_stars.png"
                          loading="lazy"
                          width="131"
                          height="22"
                          alt="Five stare rating for Boston Legend ice cream truck"
                          className="stars"
                        />
                        <div className="review-title">
                          Unforgettable Ice Cream Experience!
                        </div>
                        <div>
                          "We booked the ice cream truck for our event, and it
                          was an absolute hit! The variety of flavors, the
                          friendly service, and the overall experience were
                          beyond amazing. Our guests couldn’t stop raving about
                          it! Highly recommend for any occasion—you won’t regret
                          it!"
                        </div>
                        <div className="w-layout-hflex review-name-box">
                          <div className="review-name">Michael T.</div>
                          <div className="name-separator">|</div>
                          <div>Event Planner</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    role="listitem"
                    className="swiper-slide _w-100 w-dyn-item"
                  >
                    <div className="w-layout-hflex flex-review-center">
                      <img
                        src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681ae16515497262ba8aac02_sarah-johnson.avif"
                        loading="lazy"
                        width="152"
                        height="189"
                        alt="Sweet Wedding Reception!"
                        className="rewie-pic"
                      />
                      <div className="review-txt-block">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681b03bd1ff6e342fea4c12b_stars.png"
                          loading="lazy"
                          width="131"
                          height="22"
                          alt="Five stare rating for Boston Legend ice cream truck"
                          className="stars"
                        />
                        <div className="review-title">
                          Sweet Wedding Reception!
                        </div>
                        <div>
                          "We had the Boston Legend Ice Cream Truck at our
                          wedding reception, and it was amazing! Guests loved
                          the variety and the truck added a fun, unique touch to
                          our special day."
                        </div>
                        <div className="w-layout-hflex review-name-box">
                          <div className="review-name">Sarah Johnson</div>
                          <div className="name-separator">|</div>
                          <div>Bride</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="brand-section">
          <div className="w-layout-blockcontainer container w-container">
            <h1 className="h1-titel center">
              Experience the finest ice cream brands served straight from our
              trucks!
            </h1>
            <div className="swiper swiper-movies">
              <div className="swiper-wrapper s-w-brands">
                <div className="swiper-slide">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681a83e4999b574275de470b_boston-legend-ice-cream-truck-good-humor.avif"
                    loading="lazy"
                    width="220"
                    height="220"
                    alt="Good humor ice-cream in Boston legend ice-cream truck"
                    className="swiper-slide-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681a83e4b45bd1063cd81e4f_boston-legend-ice-cream-truck-richies-italian-ice.avif"
                    loading="lazy"
                    width="220"
                    height="220"
                    alt="Richies italian ice-cream in Boston legend ice-cream truck"
                    className="swiper-slide-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681a83e4fe9f6d889af44f16_boston-legend-ice-cream-truck-popsicle.avif"
                    loading="lazy"
                    width="220"
                    height="220"
                    alt="Popsicle ice-cream in Boston legend ice-cream truck"
                    className="swiper-slide-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681a83e405283ef94e7cd70e_boston-legend-ice-cream-truck-blue-bunny.avif"
                    loading="lazy"
                    width="220"
                    height="220"
                    alt="Blue bunny ice-cream in Boston legend ice-cream truck"
                    className="swiper-slide-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681a83e4987cee08325b8927_boston-legend-ice-cream-truck-hood.avif"
                    loading="lazy"
                    width="220"
                    height="220"
                    alt="Hood ice-cream in Boston legend ice-cream truck"
                    className="swiper-slide-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681a83e4db57d2dcf6c3f03b_boston-legend-ice-cream-truck-klondike.avif"
                    loading="lazy"
                    width="220"
                    height="220"
                    alt="Klondike ice-cream in Boston legend ice-cream truck"
                    className="swiper-slide-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="areas-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="row row-area">
              <div className="area-title-col">
                <div className="area-bg"></div>
                <div className="border-titel mb-10">Where We Serve</div>
                <h2 className="h1-titel mb-30">
                  Bringing Happiness to Every Corner in Greater Boston
                </h2>
                <p className="areas-p">
                  Our ice cream truck travels throughout Greater Boston,
                  delivering smiles and unforgettable moments to events of all
                  kinds. Wherever your celebration takes place, we're ready to
                  roll in and serve up our premium ice cream creations.
                </p>
              </div>
              <div className="area-title-list">
                <div
                  fs-list-load="all"
                  fs-list-element="list"
                  className="w-dyn-list"
                >
                  <div role="list" className="city-list w-dyn-items">
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-abington"
                        className="city-link"
                      >
                        Abington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-allston"
                        className="city-link"
                      >
                        Allston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-andover"
                        className="city-link"
                      >
                        Andover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-arlington"
                        className="city-link"
                      >
                        Arlington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-avon"
                        className="city-link"
                      >
                        Avon
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-barnstable"
                        className="city-link"
                      >
                        Barnstable
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-bedford"
                        className="city-link"
                      >
                        Bedford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-belmont"
                        className="city-link"
                      >
                        Belmont
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-billerica"
                        className="city-link"
                      >
                        Billerica
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-boston"
                        className="city-link"
                      >
                        Boston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-braintree"
                        className="city-link"
                      >
                        Braintree
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-brewster"
                        className="city-link"
                      >
                        Brewster
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-bridgewater"
                        className="city-link"
                      >
                        Bridgewater
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-brighton"
                        className="city-link"
                      >
                        Brighton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-brookline"
                        className="city-link"
                      >
                        Brookline
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-burlington"
                        className="city-link"
                      >
                        Burlington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-cambridge"
                        className="city-link"
                      >
                        Cambridge
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-cape-cod"
                        className="city-link"
                      >
                        Cape Cod
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-carver"
                        className="city-link"
                      >
                        Carver
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-charlestown"
                        className="city-link"
                      >
                        Charlestown
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-chatham"
                        className="city-link"
                      >
                        Chatham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-chelmsford"
                        className="city-link"
                      >
                        Chelmsford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-clinton"
                        className="city-link"
                      >
                        Clinton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-cohasset"
                        className="city-link"
                      >
                        Cohasset
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-concord"
                        className="city-link"
                      >
                        Concord
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-danvers"
                        className="city-link"
                      >
                        Danvers
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-dedham"
                        className="city-link"
                      >
                        Dedham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-dennis"
                        className="city-link"
                      >
                        Dennis
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-dorchester"
                        className="city-link"
                      >
                        Dorchester
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-dover"
                        className="city-link"
                      >
                        Dover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-dracut"
                        className="city-link"
                      >
                        Dracut
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-duxbury"
                        className="city-link"
                      >
                        Duxbury
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-east-boston"
                        className="city-link"
                      >
                        East Boston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-erving"
                        className="city-link"
                      >
                        Erving
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-essex"
                        className="city-link"
                      >
                        Essex
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-everett"
                        className="city-link"
                      >
                        Everett
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-falmouth"
                        className="city-link"
                      >
                        Falmouth
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-foxborough"
                        className="city-link"
                      >
                        Foxborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-framingham"
                        className="city-link"
                      >
                        Framingham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-franklin"
                        className="city-link"
                      >
                        Franklin
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-freetown"
                        className="city-link"
                      >
                        Freetown
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-georgetown"
                        className="city-link"
                      >
                        Georgetown
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-gloucester"
                        className="city-link"
                      >
                        Gloucester
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-greater-boston-area"
                        className="city-link"
                      >
                        Greater Boston area
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-groton"
                        className="city-link"
                      >
                        Groton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-halifax"
                        className="city-link"
                      >
                        Halifax
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hamilton"
                        className="city-link"
                      >
                        Hamilton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hancock"
                        className="city-link"
                      >
                        Hancock
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hanover"
                        className="city-link"
                      >
                        Hanover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hanson"
                        className="city-link"
                      >
                        Hanson
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-harwich"
                        className="city-link"
                      >
                        Harwich
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-haverhill"
                        className="city-link"
                      >
                        Haverhill
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hingham"
                        className="city-link"
                      >
                        Hingham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-holbrook"
                        className="city-link"
                      >
                        Holbrook
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-holliston"
                        className="city-link"
                      >
                        Holliston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hopkinton"
                        className="city-link"
                      >
                        Hopkinton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hudson"
                        className="city-link"
                      >
                        Hudson
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-hull"
                        className="city-link"
                      >
                        Hull
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-ipswich"
                        className="city-link"
                      >
                        Ipswich
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-jamaica-plain"
                        className="city-link"
                      >
                        Jamaica Plain
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-kingston"
                        className="city-link"
                      >
                        Kingston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lancaster"
                        className="city-link"
                      >
                        Lancaster
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lawrence"
                        className="city-link"
                      >
                        Lawrence
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-leominster"
                        className="city-link"
                      >
                        Leominster
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lexington"
                        className="city-link"
                      >
                        Lexington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lincoln"
                        className="city-link"
                      >
                        Lincoln
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-littleton"
                        className="city-link"
                      >
                        Littleton.
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lowell"
                        className="city-link"
                      >
                        Lowell
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lynn"
                        className="city-link"
                      >
                        Lynn
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-lynnfield"
                        className="city-link"
                      >
                        Lynnfield
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-malden"
                        className="city-link"
                      >
                        Malden
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-manchester-by-the-sea"
                        className="city-link"
                      >
                        Manchester-by-the-Sea
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-mansfield"
                        className="city-link"
                      >
                        Mansfield
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-marblehead"
                        className="city-link"
                      >
                        Marblehead
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-marlborough"
                        className="city-link"
                      >
                        Marlborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-marshfield"
                        className="city-link"
                      >
                        Marshfield
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-mashpee"
                        className="city-link"
                      >
                        Mashpee
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-maynard"
                        className="city-link"
                      >
                        Maynard
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-medford"
                        className="city-link"
                      >
                        Medford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-melrose"
                        className="city-link"
                      >
                        Melrose
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-merrimac"
                        className="city-link"
                      >
                        Merrimac
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-middleborough"
                        className="city-link"
                      >
                        Middleborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-milford"
                        className="city-link"
                      >
                        Milford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-millis"
                        className="city-link"
                      >
                        Millis
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-milton"
                        className="city-link"
                      >
                        Milton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-nahant"
                        className="city-link"
                      >
                        Nahant
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-natick"
                        className="city-link"
                      >
                        Natick
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-needham"
                        className="city-link"
                      >
                        Needham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-newbury"
                        className="city-link"
                      >
                        Newbury
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-newburyport"
                        className="city-link"
                      >
                        Newburyport
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-newton"
                        className="city-link"
                      >
                        Newton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-norfolk"
                        className="city-link"
                      >
                        Norfolk
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-north-andover"
                        className="city-link"
                      >
                        North Andover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-north-attleboro"
                        className="city-link"
                      >
                        North Attleboro
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-northborough"
                        className="city-link"
                      >
                        Northborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-north-reading"
                        className="city-link"
                      >
                        North Reading
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-north-shore"
                        className="city-link"
                      >
                        North Shore
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-norwell"
                        className="city-link"
                      >
                        Norwell
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-norwood"
                        className="city-link"
                      >
                        Norwood
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/occasion/birthday-parties-in-peabody"
                        className="city-link"
                      >
                        Peabody
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
