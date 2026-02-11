import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-600">
        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
      </p>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Information We Collect</h2>
        <p className="text-sm text-gray-600">
          We collect information you provide directly to us, such as your name, email and addresses. We also collect data related to your orders, preferences, and interactions with our platform.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">How We Use Your Information</h2>
        <p className="text-sm text-gray-600">
          Your information is used to provide and improve our services, process orders, communicate with you, and personalize your experience. We do not sell your personal data to third parties.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Data Protection</h2>
        <p className="text-sm text-gray-600">
          We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Rights</h2>
        <p className="text-sm text-gray-600">
          You have the right to access, update, or delete your personal information. You may also request that we limit how we use your data. Contact our support team to exercise these rights.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Changes to This Policy</h2>
        <p className="text-sm text-gray-600">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Contact Us</h2>
        <p className="text-sm text-gray-600">
          If you have any questions about this Privacy Policy, please contact us at <span className="font-semibold">support@example.com</span>.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
