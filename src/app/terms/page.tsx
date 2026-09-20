import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Naqash Carpets Gallery",
  description: "Terms and conditions of service for Naqash Carpets Gallery.",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-text-muted text-xs sm:text-sm font-light">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-sm sm:prose-base max-w-none text-text-muted font-light leading-relaxed prose-headings:font-heading prose-headings:font-medium prose-headings:text-text-dark prose-a:text-burgundy hover:prose-a:text-burgundy-deep">
            <h2 className="text-xl sm:text-2xl mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="mb-6">
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Naqash Carpets Gallery ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">2. Products and Authenticity</h2>
            <p className="mb-6">
              We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
              <br /><br />
              All our rugs are guaranteed to be authentic hand-knotted pieces, and a Certificate of Authenticity is provided with eligible purchases.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">3. Purchases and Payment</h2>
            <p className="mb-6">
              We currently accept payments via manual bank transfer. By placing an order, you agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, so that we can complete your transactions and contact you as needed.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">4. Shipping and Delivery</h2>
            <p className="mb-6">
              We offer complimentary nationwide shipping across Pakistan. Delivery times are estimates and commence from the date of payment confirmation, rather than the date of order. We shall not be liable for any delays in shipments.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">5. Return Policy</h2>
            <p className="mb-6">
              Due to the bespoke nature of our hand-knotted rugs, returns and exchanges are handled on a case-by-case basis. Please contact us within 7 days of receiving your order if you wish to discuss a return or exchange. Returned items must be in their original, unused condition.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">6. Intellectual Property Rights</h2>
            <p className="mb-6">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
            </p>

            <h2 className="text-xl sm:text-2xl mt-8 mb-4">7. Contact Us</h2>
            <p className="mb-6">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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
