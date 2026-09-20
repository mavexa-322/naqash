import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Naqash Carpets Gallery",
  description: "Privacy policy and data handling practices for Naqash Carpets Gallery.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory pb-16 sm:pb-28 pt-28 sm:pt-36">
      <div className="container max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-white border border-[#DFD7C9] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 shadow-xs">
          {/* Header */}
          <div className="border-b border-[#DFD7C9] pb-8 mb-8 text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-burgundy font-semibold block mb-3">
              Legal Information
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-text-dark tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-text-muted text-xs sm:text-sm font-light">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-sm sm:prose-base max-w-none text-text-muted font-light leading-relaxed prose-headings:font-heading prose-headings:font-medium prose-headings:text-text-dark prose-a:text-burgundy hover:prose-a:text-burgundy-deep">
            <h2 className="text-xl sm:text-2xl mt-8 mb-4">1. Introduction</h2>
            <p className="mb-6">
              Welcome to Naqash Carpets Gallery. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at contact@naqashcarpets.com.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">2. Information We Collect</h2>
            <p className="mb-6">
              We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website, or otherwise when you contact us.
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><strong>Personal Information Provided by You:</strong> We collect names; phone numbers; email addresses; mailing addresses; billing addresses; and other similar information.</li>
              <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number and the security code associated with your payment instrument. Currently, we process manual bank transfers.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="mb-6">
              We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>To fulfill and manage your orders.</li>
              <li>To deliver and facilitate delivery of services to the user.</li>
              <li>To respond to user inquiries/offer support to users.</li>
              <li>To send administrative information to you.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">4. Will Your Information Be Shared With Anyone?</h2>
            <p className="mb-6">
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. For instance, we may share shipping details with our logistics partners to deliver your purchased carpets.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">5. How Long Do We Keep Your Information?</h2>
            <p className="mb-6">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">6. Contact Us</h2>
            <p className="mb-6">
              If you have questions or comments about this notice, you may email us or by post to:
              <br /><br />
              <strong>Naqash Carpets Gallery</strong><br />
              Islamabad, Pakistan<br />
              Email: <a href="mailto:info@naqashcarpets.com" className="font-medium underline underline-offset-4">info@naqashcarpets.com</a>
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#DFD7C9] text-center">
            <Link href="/" className="inline-flex text-xs uppercase tracking-wider font-semibold text-burgundy hover:text-burgundy-deep transition-colors">
              &larr; Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
