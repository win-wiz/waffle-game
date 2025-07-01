import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-blue-50/75'>
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-slate-800 mb-4'>
            Terms of Service
          </h1>
          <p className='text-lg text-slate-600'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/80'>
          <div className='prose prose-slate max-w-none'>
            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Acceptance of Terms
            </h2>
            <p className='text-slate-700 mb-6'>
              By accessing and playing Waffle Game, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Game Usage
            </h2>
            <p className='text-slate-700 mb-6'>
              Waffle Game is provided free of charge for entertainment purposes.
              You may:
            </p>
            <ul className='list-disc list-inside text-slate-700 mb-6 space-y-2'>
              <li>Play the game for personal, non-commercial use</li>
              <li>Share your scores and achievements</li>
              <li>Provide feedback and suggestions</li>
            </ul>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Restrictions
            </h2>
            <p className='text-slate-700 mb-6'>You agree not to:</p>
            <ul className='list-disc list-inside text-slate-700 mb-6 space-y-2'>
              <li>Use automated tools or bots to play the game</li>
              <li>Reverse engineer or modify the game code</li>
              <li>Use the game for any illegal or unauthorized purpose</li>
            </ul>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Intellectual Property
            </h2>
            <p className='text-slate-700 mb-6'>
              The game concept, design, and implementation are protected by
              intellectual property laws. All rights are reserved.
            </p>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Disclaimer
            </h2>
            <p className='text-slate-700 mb-6'>
              Waffle Game is provided "as is" without any warranties, expressed
              or implied. We do not guarantee uninterrupted or error-free
              operation.
            </p>

            <h2 className='text-2xl font-bold text-slate-800 mb-4'>
              Contact Information
            </h2>
            <p className='text-slate-700 mb-6'>
              For questions regarding these terms, please contact us through our
              GitHub repository.
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
