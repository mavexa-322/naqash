import { ContactClient } from './ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Gallery Location | Naqash Carpets Gallery',
  description:
    'Visit our flagship carpet boutique in F-6 Market Islamabad or contact our concierge for private architectural consultations and custom rug inquiries.',
};

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return <ContactClient />;
}
