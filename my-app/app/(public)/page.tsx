"use client"

import Image from "next/image"
import { motion } from "framer-motion";
export default function Home(){



    return(
        <section className="container mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
    
    {/* Left Side */}
    <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div>
      <h1 className="text-5xl font-bold leading-tight">
        The Digital Knowledge Hub for Research,
        Learning & Publishing
      </h1>

      <p className="mt-6 text-gray-600 max-w-lg">
        Discover, access and share quality academic
        materials created by scholars and lecturers.
      </p>

      <div className="flex gap-4 mt-8">
        <button className="bg-green-700 text-white px-6 py-3 rounded-lg">
          Browse Library
        </button>

        <button className="border border-green-700 px-6 py-3 rounded-lg">
          Become an Author
        </button>
      </div>
    </div>
    </motion.div>

    {/* Right Side */}
    <div>
    <div className="relative">
  <div className="absolute inset-0 bg-blue-500 rounded-full scale-125"></div>

  <Image
    src="/library.png"
    alt="Library"
    width={700}
    height={500}
    className="relative z-10"
  />
</div>
<div
  className="
    absolute
    top-10
    right-10
    w-40
    h-40
    bg-[radial-gradient(#d1d5db_1px,transparent_1px)]
    bg-[size:12px_12px]
  "
/>
    </div>

  </div>

        </section>
    )
}