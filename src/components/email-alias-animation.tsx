"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Image from "next/image";

import { useCallback, useEffect, useState } from "react";

const aliases = [
  "netflix@cloakmail.co",
  "youtube@cloakmail.co",
  "shopping@cloakmail.co",
];
const mainEmail = "your-real@email.com";

export default function EmailAliasAnimation() {
  const [activeAlias, setActiveAlias] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);

  const getPath = useCallback((index: number) => {
    return `M72,${50 + index * 100} C180,${
      50 + index * 100
    } 180,150 250,150 C320,150 320,150 600,150`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlias((prev) => (prev + 1) % aliases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto h-[400px] relative">
      <svg
        className="w-full h-full absolute top-0 left-0"
        viewBox="0 0 500 300"
      >
        {aliases.map((_, index) => (
          <g key={`path-${index}`}>
            <path
              d={`M72,${50 + index * 100} C180,${
                50 + index * 100
              } 180,150 250,150`}
              fill="none"
              stroke={index === activeAlias ? "#6236FF" : "#DEDEDF"}
              strokeWidth="2"
              opacity={index === activeAlias ? 1 : 0.5}
            />
            <path
              d="M250,150 C320,150 400,150 480,150"
              fill="none"
              stroke="#6236FF"
              strokeWidth="2"
              opacity={index === activeAlias ? 1 : 0.5}
            />
          </g>
        ))}
      </svg>
      <div className="absolute top-0 bottom-0 flex flex-col justify-center space-y-24">
        {aliases.map((alias, index) => (
          <motion.div
            key={alias}
            className={`flex items-center space-x-4 ${
              index === activeAlias
                ? "text-[#6236FF] font-bold"
                : "text-gray-500"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className={`w-12 h-12 bg-white rounded-full flex items-center justify-center ${
                index === activeAlias
                  ? "border-2 border-[#6236FF]"
                  : "border-2 border-gray-500"
              }`}
            >
              <Mail
                size={24}
                className={
                  index === activeAlias ? "text-[#6236FF]" : "text-gray-500"
                }
              />
            </div>
            <span className="text-lg">{alias}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="absolute top-[calc(50%-60px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-32 h-32 bg-white border-2 border-[#6236FF] shadow-lg rounded-full flex flex-col gap-2 items-center justify-center">
          <Image
            src="/cloakmail.png"
            alt="EmailShield"
            width={80}
            height={80}
          />
        </div>
      </motion.div>
      <motion.div
        className="absolute right-[4%] top-[150px] -translate-y-1/2 flex flex-col items-center z-10"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.div
          className={`w-20 h-20 bg-white border-2 rounded-full flex items-center justify-center mb-2 ${
            isDelivered ? "border-[#6236FF]" : "border-black"
          }`}
          animate={{
            scale: isDelivered ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <Mail
            size={36}
            className={isDelivered ? "text-[#6236FF]" : "text-black"}
          />
        </motion.div>
        <span
          className={`text-lg font-bold ${
            isDelivered ? "text-[#6236FF]" : "text-black"
          }`}
        >
          {mainEmail}
        </span>
      </motion.div>
      <motion.div
        key={activeAlias}
        className="absolute"
        initial={{
          offsetDistance: "0%",
          opacity: 0,
          scale: 0,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
          scale: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          times: [0, 0.1, 0.9, 1],
        }}
        onAnimationComplete={() => setIsDelivered(true)}
        onAnimationStart={() => setIsDelivered(false)}
        style={{
          offsetPath: `path("${getPath(activeAlias)}")`,
          offsetRotate: "auto",
          top: "50px",
          left: "220px",
        }}
      >
        <div className="w-8 h-8 bg-white border-2 border-[#6236FF] rounded-full flex items-center justify-center">
          <Mail size={16} className="text-[#6236FF]" />
        </div>
      </motion.div>
    </div>
  );
}
