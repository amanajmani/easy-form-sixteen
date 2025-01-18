'use client'

import { Hero } from './components/Hero'
import React from 'react';
import FileUploadForm from './components/FileUploadForm'
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center p-2">

      <div className="flex w-full space-x-6 justify-between mb-6 p-1 flex-col md:flex-row">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={45}
            height={45}
            className="object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-1xl sm:text-2xl md:text-2xl">
              <span className="font-extrabold text-black">Easy</span>
              <span className="font-light text-gray-500">Sixteen</span>
            </h1>
            <p className="text-xs sm:text-xs md:text-xs font-serif text-gray-500 tracking-wide leading-relaxed">
              A visual journey of your Form 16
            </p>
          </div>
        </div>

        <div className="border-l border-gray-300 h-auto hidden md:block"></div>

      </div>
      <div className="w-full max-w-4xl mx-auto p-10">
        <Hero />
        <FileUploadForm />
      </div>
    </main>
  )
}
