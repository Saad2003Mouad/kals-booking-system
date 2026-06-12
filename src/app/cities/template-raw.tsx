import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function templateraw() {
  return (
    <>
      <SiteHeader />
      <div className="site-wrapper">
        <section className="page-head">
          <div className="w-layout-blockcontainer container w-container">
            <h1 className="h1-page-hed blog-title">
              Ice Cream Truck Catering in Boston
            </h1>
            <img
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif"
              loading="lazy"
              width="426"
              height="36"
              alt=""
              className="h1-page-line"
            />
          </div>
        </section>
        <main className="main-2">
          <div className="w-layout-blockcontainer container w-container">
            <img
              src="https://cdn.prod.website-files.com/67e8ff4767b61ea98e97fe89/681b3ac7047cea7769550b1f_image13.avif"
              loading="lazy"
              alt=""
              className="blog-img"
            />
            <div className="blog-rtb w-richtext">
              <h1>Ice Cream Truck Catering</h1>
              <p>
                Are you planning a birthday party or a special event in Boston?
                Our ice cream truck catering service is the perfect addition to
                make your celebration unforgettable. We offer a wide variety of
                delicious ice cream flavors that will delight guests of all
                ages.
              </p>
              <h2>Why Choose Us?</h2>
              <p>
                Our ice cream truck is not just a service; it's an experience.
                We bring the fun and excitement of an ice cream truck right to
                your venue. Imagine the smiles on your guests' faces as they
                choose their favorite flavors!
              </p>
              <blockquote>Ice cream brings people together.</blockquote>
              <h2>Perfect for Any Occasion</h2>
              <p>
                Whether it's a birthday party, corporate event, or wedding, our
                ice cream catering service can be tailored to fit your needs. We
                provide everything from cones to sundaes, ensuring that everyone
                leaves with a sweet memory.
              </p>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
