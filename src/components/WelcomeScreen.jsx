import React from 'react';
import Lottie from 'react-lottie';
import Particles from 'react-particles';
import { motion } from 'framer-motion';
import animationData from '../assets/coffee.json';

const WelcomeScreen = ({ theme, particlesInit, particlesOptions }) => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="flex items-center justify-center h-full relative z-10 pb-40 px-4">
        <motion.div
          className="text-center max-w-md drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Lottie 
            options={lottieOptions}
            height="min(300px, 50vw)"
            width="min(300px, 50vw)"
            style={{ marginBottom: '40px', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          />
          <motion.h1 
            className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            欢迎来到 Markola
          </motion.h1>
          <motion.p 
            className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 flex items-center justify-center gap-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            左侧选择文件编辑或新建文件
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default WelcomeScreen;