"use client";

import { motion } from "framer-motion";

export default function Transition({ children }: { children: React.ReactNode }) {
    return (
        <motion.main initial={{opacity: 1}} animate={{opacity: 0, display: "none"}} transition={{ease: "easeInOut"}} style={{transform: "none", willChange: "auto"}}>
            {children}
        </motion.main>
    );
}