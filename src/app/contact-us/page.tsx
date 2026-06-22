"use client";

import React, { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Failed to send message.");
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          padding: 60px 0;
        }
        @media (max-width: 850px) {
          .contact-container {
            grid-template-columns: 1fr;
          }
        }

        /* Info Card */
        .contact-info-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,2,35,0.05);
          border: 1px solid rgba(0,2,35,0.05);
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .contact-info-block h3 {
          font-size: 18px;
          font-weight: 800;
          color: #000223;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .contact-info-icon {
          background: rgba(255,160,0,0.15);
          color: #FFA000;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .contact-info-text {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.6;
        }
        .contact-info-link {
          color: #FFA000;
          font-weight: 700;
          text-decoration: none;
          display: block;
          margin-top: 4px;
        }
        .contact-info-link:hover {
          text-decoration: underline;
        }

        /* Form Card */
        .contact-form-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,2,35,0.08);
          border: 1px solid rgba(0,2,35,0.05);
        }
        .contact-form-title {
          font-size: 24px;
          font-weight: 800;
          color: #000223;
          margin-bottom: 24px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group.full {
          grid-column: 1 / -1;
        }
        .form-label {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }
        .form-input, .form-textarea, .form-select {
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          color: #1f2937;
          background: #f9fafb;
          font-family: inherit;
          transition: all 0.2s ease;
          outline: none;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #FFA000;
          background: white;
          box-shadow: 0 0 0 4px rgba(255,160,0,0.1);
        }
        .form-textarea {
          resize: vertical;
          min-height: 140px;
        }
        .form-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #FFA000 0%, #FFB300 100%);
          color: #000223;
          font-weight: 800;
          font-size: 16px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
          box-shadow: 0 8px 20px rgba(255,160,0,0.3);
        }
        .form-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(255,160,0,0.4);
        }
        .form-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .alert-success {
          background: #dcfce7;
          color: #166534;
          padding: 16px;
          border-radius: 12px;
          font-weight: 600;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          padding: 16px;
          border-radius: 12px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0,2,35,0.2);
          border-top-color: #000223;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />

      <SiteHeader />

      <section className="page-head">
        <div className="w-layout-blockcontainer container w-container">
          <h1 className="h1-page-hed">
            <span className="page-titel-top">Contact Us</span><br/>
            Boston Legend <br/>
            <span className="title-event">Ice Cream truck</span>
          </h1>
          <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif" loading="lazy" width="426" height="36" alt="" className="h1-page-line"/>
        </div>
      </section>

      <main className="main">
        <div className="w-layout-blockcontainer container w-container">
          <div className="border-titel mb-0">Get In Touch</div>
          
          <div className="contact-container">
          
          {/* Contact Information */}
          <div className="contact-info-card">
            <div className="contact-info-block">
              <h3>
                <div className="contact-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                Call Us
              </h3>
              <div className="contact-info-text">
                Need an immediate answer? Give us a call.
                <a href="tel:6179993803" className="contact-info-link">617-999-3803</a>
                <a href="tel:6178662727" className="contact-info-link">617-866-2727</a>
              </div>
            </div>

            <div className="contact-info-block">
              <h3>
                <div className="contact-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                Email Us
              </h3>
              <div className="contact-info-text">
                For general inquiries or detailed requests.
                <a href="mailto:info@bostonlegendicecreamtruck.com" className="contact-info-link">info@bostonlegendicecreamtruck.com</a>
              </div>
            </div>

            <div className="contact-info-block">
              <h3>
                <div className="contact-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                Business Hours
              </h3>
              <div className="contact-info-text">
                <span style={{ fontWeight: 700 }}>Open 24 Hours for Scheduled Events</span><br/>
                Available 24 hours by reservation
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card">
            <h2 className="contact-form-title">Send a Message</h2>
            
            {status === "success" && (
              <div className="alert-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Thank you! Your message has been sent successfully. Our team will contact you soon.
              </div>
            )}
            
            {status === "error" && (
              <div className="alert-error">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-input"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="(617) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    name="subject" 
                    className="form-select"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic...</option>
                    <option value="Event Catering">Event Catering</option>
                    <option value="Pricing Inquiry">Pricing Inquiry</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    required
                    className="form-textarea"
                    placeholder="Tell us about your event or inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="form-submit-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner"></span> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
