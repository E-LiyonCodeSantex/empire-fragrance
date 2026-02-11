// pages/user/about/index.tsx
import React from "react";

const AboutUsPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg">
          We are a modern online marketplace dedicated to connecting people with all kinds of
          quality perfume, ouds, body sprace and  other products they can be trusted. Our platform makes shopping simple,
          secure, and engaging by combining a seamless buying experience with
          authentic customer reviews. We are Empire Fragrance
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-5xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-hoverPrimary mb-4">Our Mission</h2>
          <p>
            To empower customers with confidence in their purchases by offering
            a transparent, user‑friendly platform where authentic reviews and
            trusted products meet.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-hoverPrimary mb-4">Our Vision</h2>
          <p>
            To become the most trusted online marketplace in Africa and beyond —
            a place where shoppers and sellers connect effortlessly, guided by
            honesty, innovation, and community.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-hoverPrimary mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Trust & Transparency:</strong> Honest reviews and clear product information.</li>
            <li><strong>Customer‑First:</strong> Every feature is designed to make shopping easier and rewarding.</li>
            <li><strong>Innovation:</strong> Continuously improving to deliver a modern, efficient experience.</li>
            <li><strong>Community:</strong> Fostering growth for users, sellers, and brands together.</li>
            <li><strong>Integrity:</strong> Fairness and accountability in every transaction.</li>
          </ul>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-hoverPrimary mb-4">Our Story</h2>
          <p className="text-lg leading-relaxed">
            Founded with the vision of creating a marketplace that prioritizes
            trust and transparency, we started as a small team passionate about
            making online shopping better. Today, we continue to grow by
            listening to our customers, innovating our platform, and building a
            community where every purchase feels secure and rewarding.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-2xl font-bold text-hoverPrimary mb-4">Join Our Journey</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Whether you’re a shopper looking for reliable products or a seller
          ready to reach new customers, we invite you to be part of our growing
          community.
        </p>
        <a
          href="/user/contact"
          className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-hoverPrimary transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default AboutUsPage;
