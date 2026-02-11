import React from "react";

const TermsOfServicePage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms of Service</h1>
      <p className="mb-4 text-sm text-gray-600">
        These Terms of Service govern your use of our platform. By accessing or using our services, you agree to comply with these terms.
      </p>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Use of Services</h2>
        <p className="text-sm text-gray-600">
          You agree to use our services only for lawful purposes and in accordance with these terms. You must not misuse our platform or attempt to disrupt its functionality.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Account Responsibilities</h2>
        <p className="text-sm text-gray-600">
          If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Orders and Transactions</h2>
        <p className="text-sm text-gray-600">
          All orders placed through our platform are subject to availability and acceptance. We reserve the right to refuse or cancel any order at our discretion.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Intellectual Property</h2>
        <p className="text-sm text-gray-600">
          All content, trademarks, and designs on our platform are the property of our company or our licensors. You may not reproduce, distribute, or exploit them without permission.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Limitation of Liability</h2>
        <p className="text-sm text-gray-600">
          We are not liable for any indirect, incidental, or consequential damages arising from your use of our services. Your sole remedy is to discontinue use of the platform.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Termination</h2>
        <p className="text-sm text-gray-600">
          We may suspend or terminate your access to our services at any time if you violate these terms or engage in harmful behavior.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Changes to Terms</h2>
        <p className="text-sm text-gray-600">
          We may update these Terms of Service from time to time. Any changes will be posted on this page with an updated effective date.
        </p>
      </section>

      <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Contact Us</h2>
        <p className="text-sm text-gray-600">
          If you have any questions about these Terms of Service, please contact us at <span className="font-semibold">support@example.com</span>.
        </p>
      </section>
    </main>
  );
};

export default TermsOfServicePage;
