import React from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Features from '../components/sections/Features.jsx';
import ParcelTracker from '../components/ui/ParcelTracker.jsx';
import bridgePhoto from '../assets/photos/brazzaville-bridge-night.webp';

export default function Services({ onNavigate }) {
  return (
    <section className="pb-20 pt-36 sm:pt-44 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <PageHeader
          title="Ce que nous"
          accent="transportons."
          description="Un passager, une lettre, un carton. On part à l’heure, on suit le colis et on répond au téléphone."
          image={bridgePhoto}
          imageAlt="Le pont de Brazzaville illuminé la nuit"
          imageCredit="Allen Chouyy / CC BY-SA 4.0"
        />

        <div className="mt-10">
          <Features onNavigate={onNavigate} />
        </div>

        <div className="mt-10">
          <ParcelTracker />
        </div>
      </div>
    </section>
  );
}
