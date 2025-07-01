import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-blue-50/75'>
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-slate-800 mb-4'>
            Privacy Policy
          </h1>
          <p className='text-lg text-slate-600'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/80'>
          <div className='prose prose-slate max-w-none'>
            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Information We Collect
            </h2>
            <p className='text-slate-700 mb-6'>
              Waffle Game is designed with privacy in mind. We collect minimal
              information to provide you with the best gaming experience:
            </p>
            <ul className='list-disc list-inside text-slate-700 mb-6 space-y-2'>
              <li>Game statistics (stored locally on your device)</li>
              <li>Puzzle completion data (stored locally)</li>
              <li>Theme preferences (stored locally)</li>
            </ul>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              How We Use Information
            </h2>
            <p className='text-slate-700 mb-6'>
              All data is stored locally on your device using browser storage.
              We do not collect or transmit personal information to external
              servers.
            </p>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Data Security
            </h2>
            <p className='text-slate-700 mb-6'>
              Your game data is stored securely in your browser's local storage
              and never transmitted to external servers.
            </p>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Contact Us
            </h2>
            <p className='text-slate-700 mb-6'>
              If you have any questions about this Privacy Policy, please
              contact us through our GitHub repository.
            </p>
          </div>
        </div>

        <div className='text-center mt-12'>
          <Link
            href='/'
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
          >
            ← Back to Game
          </Link>
        </div>
      </div>
    </div>
  );
}
