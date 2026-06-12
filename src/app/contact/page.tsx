import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="site-wrapper">
        <section className="page-head">
          <div className="w-layout-blockcontainer container w-container">
            <h1 className="h1-page-hed">
              <span className="page-titel-top">Contact </span>
              <br />
              Boston Legend <br />
              <span className="title-event">Ice Cream truck</span>
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
        <main className="main contact-main">
          <div className="w-layout-blockcontainer container w-container">
            <div className="border-titel">Contact us</div>
            <div className="row">
              <div className="contact-col">
                <h2 className="h2-service-title">
                  Get in Touch with Boston Legend Ice Cream!
                </h2>
                <p>
                  We're excited to make your upcoming Greater Boston event
                  unforgettable with our delicious ice cream and excellent
                  service. Whether you have questions, want to book our truck,
                  or have any special requests, our team is here to help.
                </p>
                <div className="w-layout-hflex contact-flex">
                  <div className="phome-title">Phone</div>
                  <a
                    href="tel:6179993803"
                    className="contact-page-link w-inline-block"
                  >
                    <div>
                      617-999-3803
                      <br />
                    </div>
                  </a>
                  <a href="tel:6179993803" className="w-inline-block">
                    <div className="contact-page-link">
                      617-999-3803
                      <br />
                    </div>
                  </a>
                  <a href="tel:6178662727" className="w-inline-block">
                    <div className="contact-page-link">
                      617-866-2727
                      <br />
                    </div>
                  </a>
                </div>
                <div className="w-layout-hflex contact-flex">
                  <div className="phome-title">Email</div>
                  <a
                    href="mailto: info@bostonlegendicecreamtruck.com"
                    className="contact-page-link w-inline-block"
                  >
                    <div>info@bostonlegendicecreamtruck.com</div>
                  </a>
                </div>
                <div className="w-layout-hflex contact-flex">
                  <div className="phome-title">Work Hours</div>
                  <div>Open 24 Hours for Scheduled Events</div>
                  <div>Available 24 hours by reservation</div>
                </div>
              </div>
              <div className="contact-col">
                <div className="contact-form w-form">
                  <form
                    id="wf-form-Contact-Form"
                    name="wf-form-Contact-Form"
                    data-name="Contact Form"
                    data-redirect="/contact-thank-you"
                    method="get"
                    className="contact-form-border"
                    data-wf-page-id="681ead0d2b55043268c0295e"
                    data-wf-element-id="c095ceae-e875-8603-4a80-840f053f687e"
                    data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"
                  >
                    <label htmlFor="name" className="contact-lable">
                      Name
                    </label>
                    <input
                      className="form-field no-border w-input"
                      maxLength={256}
                      name="name"
                      data-name="Name"
                      placeholder=""
                      type="text"
                      id="name"
                    />
                    <label htmlFor="email" className="contact-lable">
                      Email Address
                    </label>
                    <input
                      className="form-field no-border w-input"
                      maxLength={256}
                      name="email"
                      data-name="Email"
                      placeholder=""
                      type="email"
                      id="email"
                      required
                    />
                    <label htmlFor="Phone" className="contact-lable">
                      Phone
                    </label>
                    <input
                      className="form-field no-border w-input"
                      maxLength={256}
                      name="Phone"
                      data-name="Phone"
                      placeholder=""
                      type="tel"
                      id="Phone"
                      required
                    />
                    <label htmlFor="Message" className="contact-lable">
                      Message
                    </label>
                    <textarea
                      id="Message"
                      name="Message"
                      maxLength={5000}
                      data-name="Message"
                      placeholder=""
                      className="form-field-area no-border w-input"
                    ></textarea>
                    <input
                      type="submit"
                      data-wait="Please wait..."
                      className="link-bt mt-30 w-button"
                      value="Submit"
                    />
                  </form>
                  <div className="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div className="w-form-fail">
                    <div>
                      Oops! Something went wrong while submitting the form.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
