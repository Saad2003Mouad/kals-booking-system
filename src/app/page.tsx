import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="site-wrapper">
        <div className="header-wrapper">
          <div className="bg-holder">
            <div className="p-relative">
              <div className="w-embed">
                <div className="gradient-morning"></div>
              </div>
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/68370bab3a2a59b9eecd7910_5429ba7e106f479fe18b0f9ad0cf5de3_boston-legend-ice-cream-truck-white-header-bg.avif"
                loading="lazy"
                width="1920"
                height="1067"
                alt=""
                className="head-img"
              />
            </div>
          </div>
          <section className="home-header">
            <div className="head-row">
              <div className="home-header-img-block">
                <img
                  src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif"
                  loading="lazy"
                  width="910"
                  height="607"
                  alt="Boston Legend Ice Cream Truck Service For Catering &amp; Events "
                  srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e39363a1a97ce2ec696ed2_0a9cb1b22946640198d997180ee253d2_boston-legend-ice-cream-truck-services-catering-events.avif 910w"
                  sizes="(max-width: 910px) 100vw, 910px"
                  className="home-header-img"
                />
              </div>
              <div className="home-head-block">
                <div className="home-title-block">
                  <div className="before-titel">Boston Legend</div>
                  <h1 className="head-h1-title">
                    Massachusetts’ Premium Ice Cream Truck Experience
                  </h1>
                  <div className="hoem-after-title">
                    The World's First AI-Powered Ice Cream Truck Reservation
                    Platform
                  </div>
                </div>
                <div className="home-form-block">
                  <div className="w-layout-hflex flex-center">
                    <div className="form-title-line"></div>
                    <div className="form-title">
                      Book your ice cream truck now
                    </div>
                  </div>
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
                        fontWeight: "900",
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
                      Get an instant quote and secure your ice cream truck in
                      under 3 minutes.
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
                        fontWeight: "900",
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
          </section>
        </div>
        <section className="service-sec">
          <div className="w-layout-blockcontainer container w-container">
            <div className="border-titel">Events &amp; Caterings</div>
            <h2 className="h1-titel-80">
              Making Your Special Occasion Even Sweeter With Our Unique Flavors!
            </h2>
          </div>
          <div className="service-relative">
            <div className="service-bg">
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg.avif"
                loading="lazy"
                width="1926"
                height="1116"
                alt=""
                srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg.avif 1926w"
                sizes="(max-width: 1926px) 100vw, 1926px"
              />
            </div>
            <div className="wide-container h-100">
              <div className="w-layout-hflex service-flex">
                <div className="service-img-col">
                  <div className="relative-img-col">
                    <div className="absoliute-img-col">
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f206c_birthday-parties-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for birthday parties by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f206c_birthday-parties-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f206c_birthday-parties-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="3eb0f881-1b88-a46f-653e-82802777ab46"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee432c1377394377825_block-parties-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for block parties by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee432c1377394377825_block-parties-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee432c1377394377825_block-parties-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="531302fe-b76e-9f84-d8ea-9db71edbcf74"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee5936df62525aff3e7_corporate-parties-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for corporate parties by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee5936df62525aff3e7_corporate-parties-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee5936df62525aff3e7_corporate-parties-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="691a5ce0-2c2d-32e0-2cbb-748b47a8bf7a"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee614fa50908c9b86d2_fundraisers-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for fundraisers by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee614fa50908c9b86d2_fundraisers-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee614fa50908c9b86d2_fundraisers-boston-legend-ice-cream-truck-catering-p-800.avif 800w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee614fa50908c9b86d2_fundraisers-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="554ceda1-34fb-3f7e-fff4-91a8ee5efb7a"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee66ab75a9e8c52b6f1_launch-parties-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for launch parties by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee66ab75a9e8c52b6f1_launch-parties-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee66ab75a9e8c52b6f1_launch-parties-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="d5c8342d-0929-f729-d909-b7411ceca39a"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee46ab75a9e8c52b62b_marketing-events-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for marketing events by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee46ab75a9e8c52b62b_marketing-events-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee46ab75a9e8c52b62b_marketing-events-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="b12f9235-3d4f-48d9-ae4b-0e4964fc9660"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee77b15f38f994b0830_movie-rental-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for marketing events by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee77b15f38f994b0830_movie-rental-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee77b15f38f994b0830_movie-rental-boston-legend-ice-cream-truck-catering-p-800.avif 800w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee77b15f38f994b0830_movie-rental-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="5d8d3a2d-3d9f-a9a7-b1dd-20a15afe3c08"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee4e7f5478285c6c526_photo-shoots-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for photo sessions by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee4e7f5478285c6c526_photo-shoots-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee4e7f5478285c6c526_photo-shoots-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="aae866b3-3a86-4dc6-377e-c02da6101b5f"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f2068_296fa584c0f5602980203d2931e1a407_reunions-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for reunion parties by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f2068_296fa584c0f5602980203d2931e1a407_reunions-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f2068_296fa584c0f5602980203d2931e1a407_reunions-boston-legend-ice-cream-truck-catering-p-800.avif 800w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f2068_296fa584c0f5602980203d2931e1a407_reunions-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="14a9e203-bff1-084a-ab07-39cde442a8fa"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e7f5478285c6c664_school-events-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for school occasions by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e7f5478285c6c664_school-events-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e7f5478285c6c664_school-events-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="b67dd025-b01f-4617-81fc-c58d590d0595"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6d512ef0eed209634_sporting-events-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for sports occasions by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6d512ef0eed209634_sporting-events-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6d512ef0eed209634_sporting-events-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                    <div
                      data-w-id="1d3f46f3-876a-c1e1-786d-12d77b43dae5"
                      className="absoliute-img-col"
                    >
                      <div className="service-img-inner-col">
                        <img
                          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f206c_birthday-parties-boston-legend-ice-cream-truck-catering.avif"
                          loading="lazy"
                          width="1168"
                          height="796"
                          alt="Ice cream catering for birthday parties by Boston Legend ice cream truck"
                          srcSet="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f206c_birthday-parties-boston-legend-ice-cream-truck-catering-p-500.avif 500w, https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6816eee6e9080f73e70f206c_birthday-parties-boston-legend-ice-cream-truck-catering.avif 1168w"
                          sizes="(max-width: 1168px) 100vw, 1168px"
                          className="service-home-img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="service-txt-col">
                  <div className="service-txt-inner-col w-dyn-list">
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Birthday Parties</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816624976e3390d4b6ada0a_birthday-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Ice cream catering for birthday parties – adding a
                          sweet and creamy touch to your celebration!
                        </div>
                        <div className="card-shortdiscription">
                          We bring the joy of ice cream to birthday parties with
                          our catering service, serving up delightful flavors
                          that everyone will love.
                        </div>
                        <a
                          href="/occasions/birthday-parties"
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
                  <div
                    data-w-id="5705f8e8-418f-75f1-0054-6378c7996158"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Block Parties</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816633f16bb926081bbec13_block-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Boston Legend brings legendary ice cream and good
                          vibes straight to your block party!
                        </div>
                        <div className="card-shortdiscription">
                          Boston Legend isn’t just an ice cream bus – it’s the
                          life of the block party! We roll up with legendary
                          scoops, good vibes, and a whole lot of fun, turning
                          every street into a sweet celebration.
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
                  </div>
                  <div
                    data-w-id="e19a3ae2-812e-d020-07e5-9e7aae48d94a"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">
                            Corporate Parties
                          </h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816663f16bb926081bd7e68_corporate-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Bring the scoop to the suits – Boston Legend makes
                          your corporate party cooler
                        </div>
                        <div className="card-shortdiscription">
                          Boston Legend serves premium ice cream straight from
                          our iconic bus, turning corporate events into
                          unforgettable experiences. Whether it’s a staff
                          appreciation day, product launch, or just a reason to
                          treat the team – we bring the chill, you bring the
                          smiles!
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
                  </div>
                  <div
                    data-w-id="ce9230ff-e2a7-1cf1-a1df-6efd6efe8738"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Fundraisers</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816666e96c820f30ad580af_fundraisers-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
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
                          funds for a great cause. Our ice cream bus creates a
                          fun, engaging atmosphere that makes giving back even
                          more delicious!
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
                  </div>
                  <div
                    data-w-id="0aa0b8c6-6742-4208-6509-1f4b7bd3ea28"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Launch Parties</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816674df2b824328788324a_launch-parties-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Launch in style with Boston Legend – where every scoop
                          makes your event legendary
                        </div>
                        <div className="card-shortdiscription">
                          Take your product launch to the next level with Boston
                          Legend’s mobile ice cream service. Our iconic bus
                          delivers premium, ready-to-serve ice cream straight to
                          your event, bringing a sweet, fun vibe that will leave
                          your guests talking long after the launch is over.
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
                  </div>
                  <div
                    data-w-id="ffbeca68-6e9e-8adc-62ad-a24c5ab9e047"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Marketing Events</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681667598039935425746181_marketing-events-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Elevate your marketing event with Boston Legend – the
                          ice cream that makes your brand unforgettable!
                        </div>
                        <div className="card-shortdiscription">
                          Boston Legend adds the perfect touch to your marketing
                          events, serving premium ice cream directly from our
                          iconic truck. Whether you’re promoting a new product
                          or connecting with clients, we make your event cool,
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
                  </div>
                  <div
                    data-w-id="d376dfbc-f045-47b4-09fa-421ef84ea8bf"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Movie Rental</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/68166834803993542574dbd5_movie-rental-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Bring the movie night magic to life with Boston Legend
                          – ice cream truck style!
                        </div>
                        <div className="card-shortdiscription">
                          Make your movie rental party even sweeter with Boston
                          Legend’s ice cream truck. We deliver premium ice cream
                          right to your door, setting the perfect scene for a
                          fun, laid-back night with friends, family, and your
                          favorite films.
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
                  </div>
                  <div
                    data-w-id="3aad8afc-e7c6-63c5-69a0-b8859918887b"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Photo Sessions</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/6816684563bd8dbd187e81b0_photo-shoots-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Capture the moment with Boston Legend – ice cream that
                          adds flavor to your photo session!
                        </div>
                        <div className="card-shortdiscription">
                          Turn your photo session into a fun, memorable
                          experience with Boston Legend’s ice cream truck.
                          Whether it’s for a special event or just a fun photo
                          shoot, our premium ice cream brings smiles, flavor,
                          and a sweet touch to every shot.
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
                  </div>
                  <div
                    data-w-id="d50b3dd1-81e2-4e3e-11c8-3bb82e4a9b9c"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">Reunions</h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681668e67ee8c804a2972b05_reunions-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Make your reunion unforgettable with Boston Legend –
                          ice cream that brings everyone together!
                        </div>
                        <div className="card-shortdiscription">
                          Boston Legend’s ice cream truck is the perfect
                          addition to your reunion. We serve premium ice cream
                          that sparks joy and nostalgia, turning your gathering
                          into a sweet celebration of old memories and new
                          moments.
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
                  </div>
                  <div
                    data-w-id="6665f5ae-8817-8531-4b3e-7907c8427461"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
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
                          graduation party, Boston Legend's ice cream truck
                          brings premium treats directly to your event. We add a
                          fun, delicious twist to any school occasion, creating
                          sweet memories for students, teachers, and parents
                          alike.
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
                  </div>
                  <div
                    data-w-id="1c289724-2d36-ccd0-c0d6-1b72f856f70a"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h3 className="secive-card-name">Sports Occasions</h3>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/68166983f7a8aada9a73b175_sporting-events-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Celebrate your victory with Boston Legend – the ice
                          cream truck that fuels the fun!
                        </div>
                        <div className="card-shortdiscription">
                          After the game, it's time to cool down and celebrate
                          with Boston Legend’s ice cream truck. Whether it's a
                          team victory, a tournament, or just a fun day on the
                          field, we bring premium ice cream straight to your
                          event, turning every sports occasion into a delicious
                          celebration.
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
                  </div>
                  <div
                    data-w-id="a2d2406b-f96a-8ee2-9ccf-f130f881de41"
                    className="service-txt-inner-col w-dyn-list"
                  >
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="service-card w-dyn-item">
                        <div className="w-layout-hflex service-name-flex">
                          <h2 className="secive-card-name">
                            Wedding Receptions
                          </h2>
                          <img
                            src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681669a6bc647287a8bf0f22_wedding-receptions-boston-legend-ice-cream-truck-catering-icon.svg"
                            loading="lazy"
                            alt=""
                            className="service-cart-icon"
                          />
                        </div>
                        <div className="card-intro">
                          Sweeten your wedding reception with Boston Legend –
                          ice cream that makes your day even more special!
                        </div>
                        <div className="card-shortdiscription">
                          Boston Legend’s ice cream truck is the perfect way to
                          cool down and sweeten up your wedding reception. We
                          bring premium, ready-to-serve ice cream directly to
                          your celebration, offering a fun and delicious treat
                          that your guests will remember long after the last
                          dance.
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
            </div>
          </div>
        </section>
        <section className="about-sec">
          <div className="w-layout-blockcontainer container w-container">
            <div className="border-titel mb-0">Best Ice crem Truck</div>
            <div className="row">
              <div className="about-pic-col">
                <img
                  src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6818117a6690f3cac9d20e49_4b0293a0327fa7b4227ee6f41d631251_boston-legend-best-ice-crem-truck-greater-boston.avif"
                  loading="lazy"
                  width="416"
                  height="749"
                  alt="Boston Legend Best Ice crem Truck in Greater Boston
"
                  className="about-img-1"
                />
              </div>
              <div className="about-block">
                <h2 className="h1-titel">
                  Boston Legend: Ice Cream Truck – Sweetening Greater Boston
                  Events!
                </h2>
                <div className="about-flex">
                  <div className="about-txt">
                    <div>
                      Boston Legend Ice Cream Truck brings legendary flavors to
                      life, offering event catering across Greater Boston. From
                      weddings to birthdays, With a wide variety of rich, creamy
                      flavors and top-notch service make every celebration
                      unforgettable.
                    </div>
                    <div className="brown-title">Why Choose Us:</div>
                    <div className="rtb bold w-richtext">
                      <ul role="list">
                        <li>Convenient on-the-go service.</li>
                        <li>Variety of delicious ice cream flavors.</li>
                        <li>Perfect for any event – big or small.</li>
                        <li>Serving all of Greater Boston with a smile.</li>
                      </ul>
                    </div>
                    <div className="w-layout-hflex flex-center">
                      <img
                        src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681811af9d6a90168b8ec603_boston-legend-ice-cream-truck-phone-number.avif"
                        loading="lazy"
                        width="50"
                        height="50"
                        alt="CALL Boston legend ice-cream truck"
                        className="about-phone-pic"
                      />
                      <a href="tel:617-999-3803" className="w-inline-block">
                        <div className="phome-title">For booking</div>
                        <div className="about-phone-num">
                          617-999-3803
                          <br />
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="about-s-img">
                    <img
                      src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6818117a03d6efa474f5a6fc_Birthday%20table%20in%20yard.avif"
                      loading="lazy"
                      width="310"
                      height="445"
                      alt="Boston Legend Ice Cream Truck – Sweetening Greater Boston Events"
                      className="about-img-2"
                    />
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
        <section className="plog-sec">
          <div className="w-layout-blockcontainer container w-container">
            <div className="row">
              <div className="blog-sec-title">
                <div className="border-titel mb-10">News &amp; Articles</div>
                <h2 className="h1-titel mb-50">Our Recent Blog</h2>
                <a href="/blog" className="link-bt">
                  View all
                </a>
              </div>
              <div className="blog-sec-list">
                <div className="w-dyn-list">
                  <div role="list" className="w-dyn-items">
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/blog/bringing-an-ice-cream-truck"
                        className="blog-item w-inline-block"
                      >
                        <img
                          src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/69e16aed5e1c28392d30ab63_jon-tyson-KpnxgfCLBmE-unsplash.jpg"
                          loading="lazy"
                          alt="Tips for Bringing an Ice Cream Truck to a Somerville Street Festival"
                          className="blog-item-img"
                        />
                        <div>
                          <h3 className="plog-item-title">
                            Tips for Bringing an Ice Cream Truck to a Somerville
                            Street Festival
                          </h3>
                          <div className="read-blog">Read article</div>
                        </div>
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/blog/ice-cream-trucks-local-marketing-events"
                        className="blog-item w-inline-block"
                      >
                        <img
                          src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/69d59b763b0bf04e4d4794a3_getty-images-ruIY_mRYC5Y-unsplash.jpg"
                          loading="lazy"
                          alt="Why Ice Cream Trucks Are a Hit at Local Marketing Events"
                          className="blog-item-img"
                        />
                        <div>
                          <h3 className="plog-item-title">
                            Why Ice Cream Trucks Are a Hit at Local Marketing
                            Events
                          </h3>
                          <div className="read-blog">Read article</div>
                        </div>
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/blog/ice-cream-catering-teacher-appreciation-events"
                        className="blog-item w-inline-block"
                      >
                        <img
                          src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/69c9d8a4678c5793853a0119_getty-images-v07MJYxRcTU-unsplash.jpg"
                          loading="lazy"
                          alt="How Ice Cream Catering Helps Make Teacher Appreciation Events Special"
                          className="blog-item-img"
                        />
                        <div>
                          <h3 className="plog-item-title">
                            How Ice Cream Catering Helps Make Teacher
                            Appreciation Events Special
                          </h3>
                          <div className="read-blog">Read article</div>
                        </div>
                      </a>
                    </div>
                  </div>
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
                      <a href="/cities/abington" className="city-link">
                        Abington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/allston" className="city-link">
                        Allston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/andover" className="city-link">
                        Andover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/arlington" className="city-link">
                        Arlington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/avon" className="city-link">
                        Avon
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/barnstable" className="city-link">
                        Barnstable
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/bedford" className="city-link">
                        Bedford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/belmont" className="city-link">
                        Belmont
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/billerica" className="city-link">
                        Billerica
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/boston" className="city-link">
                        Boston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/braintree" className="city-link">
                        Braintree
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/brewster" className="city-link">
                        Brewster
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/bridgewater" className="city-link">
                        Bridgewater
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/brighton" className="city-link">
                        Brighton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/brookline" className="city-link">
                        Brookline
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/burlington" className="city-link">
                        Burlington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/cambridge" className="city-link">
                        Cambridge
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/cape-cod" className="city-link">
                        Cape Cod
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/carver" className="city-link">
                        Carver
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/charlestown" className="city-link">
                        Charlestown
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/chatham" className="city-link">
                        Chatham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/chelmsford" className="city-link">
                        Chelmsford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/clinton" className="city-link">
                        Clinton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/cohasset" className="city-link">
                        Cohasset
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/concord" className="city-link">
                        Concord
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/danvers" className="city-link">
                        Danvers
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/dedham" className="city-link">
                        Dedham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/dennis" className="city-link">
                        Dennis
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/dorchester" className="city-link">
                        Dorchester
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/dover" className="city-link">
                        Dover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/dracut" className="city-link">
                        Dracut
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/duxbury" className="city-link">
                        Duxbury
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/east-boston" className="city-link">
                        East Boston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/erving" className="city-link">
                        Erving
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/essex" className="city-link">
                        Essex
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/everett" className="city-link">
                        Everett
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/falmouth" className="city-link">
                        Falmouth
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/foxborough" className="city-link">
                        Foxborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/framingham" className="city-link">
                        Framingham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/franklin" className="city-link">
                        Franklin
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/freetown" className="city-link">
                        Freetown
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/georgetown" className="city-link">
                        Georgetown
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/gloucester" className="city-link">
                        Gloucester
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/cities/greater-boston-area"
                        className="city-link"
                      >
                        Greater Boston area
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/groton" className="city-link">
                        Groton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/halifax" className="city-link">
                        Halifax
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hamilton" className="city-link">
                        Hamilton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hancock" className="city-link">
                        Hancock
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hanover" className="city-link">
                        Hanover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hanson" className="city-link">
                        Hanson
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/harwich" className="city-link">
                        Harwich
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/haverhill" className="city-link">
                        Haverhill
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hingham" className="city-link">
                        Hingham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/holbrook" className="city-link">
                        Holbrook
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/holliston" className="city-link">
                        Holliston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hopkinton" className="city-link">
                        Hopkinton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hudson" className="city-link">
                        Hudson
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/hull" className="city-link">
                        Hull
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/ipswich" className="city-link">
                        Ipswich
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/jamaica-plain" className="city-link">
                        Jamaica Plain
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/kingston" className="city-link">
                        Kingston
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lancaster" className="city-link">
                        Lancaster
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lawrence" className="city-link">
                        Lawrence
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/leominster" className="city-link">
                        Leominster
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lexington" className="city-link">
                        Lexington
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lincoln" className="city-link">
                        Lincoln
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/littleton" className="city-link">
                        Littleton.
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lowell" className="city-link">
                        Lowell
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lynn" className="city-link">
                        Lynn
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/lynnfield" className="city-link">
                        Lynnfield
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/malden" className="city-link">
                        Malden
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a
                        href="/cities/manchester-by-the-sea"
                        className="city-link"
                      >
                        Manchester-by-the-Sea
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/mansfield" className="city-link">
                        Mansfield
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/marblehead" className="city-link">
                        Marblehead
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/marlborough" className="city-link">
                        Marlborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/marshfield" className="city-link">
                        Marshfield
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/mashpee" className="city-link">
                        Mashpee
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/maynard" className="city-link">
                        Maynard
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/medford" className="city-link">
                        Medford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/melrose" className="city-link">
                        Melrose
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/merrimac" className="city-link">
                        Merrimac
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/middleborough" className="city-link">
                        Middleborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/milford" className="city-link">
                        Milford
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/millis" className="city-link">
                        Millis
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/milton" className="city-link">
                        Milton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/nahant" className="city-link">
                        Nahant
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/natick" className="city-link">
                        Natick
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/needham" className="city-link">
                        Needham
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/newbury" className="city-link">
                        Newbury
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/newburyport" className="city-link">
                        Newburyport
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/newton" className="city-link">
                        Newton
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/norfolk" className="city-link">
                        Norfolk
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/north-andover" className="city-link">
                        North Andover
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/north-attleboro" className="city-link">
                        North Attleboro
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/northborough" className="city-link">
                        Northborough
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/north-reading" className="city-link">
                        North Reading
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/north-shore" className="city-link">
                        North Shore
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/norwell" className="city-link">
                        Norwell
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/norwood" className="city-link">
                        Norwood
                      </a>
                    </div>
                    <div role="listitem" className="w-dyn-item">
                      <a href="/cities/peabody" className="city-link">
                        Peabody
                      </a>
                    </div>
                  </div>
                  <div
                    role="navigation"
                    aria-label="List"
                    className="w-pagination-wrapper d-none"
                  >
                    <a
                      href="?3996dd1c_page=2"
                      aria-label="Next Page"
                      className="w-pagination-next"
                    >
                      <div className="w-inline-block">Next</div>
                      <svg
                        className="w-pagination-next-icon"
                        height="12px"
                        width="12px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        transform="translate(0, 1)"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          fill-rule="evenodd"
                          d="M4 2l4 4-4 4"
                        />
                      </svg>
                    </a>
                    <link />
                    <div
                      aria-label="Page 1 of 2"
                      role="heading"
                      className="w-page-count"
                    >
                      1 / 2
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
