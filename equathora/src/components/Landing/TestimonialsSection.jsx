import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GuestAvatar from '../../assets/images/guestAvatar.png';


const TestimonialsSection = () => {

    const testimonials = [
        {
            quote: "The problem explanations are really clear and the hints help when I get stuck. It's been great for my algebra practice.",
            author: "Alessandro Rinaldi",
            role: "High School Student",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "I like how straightforward everything is. No unnecessary features, just solving problems and tracking my progress.",
            author: "Marco Olivieri",
            role: "College Freshman",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "Clean Interface and well-structured problems. Looking forward to seeing more content added as the platform grows.",
            author: "Sofia Gasparov",
            role: "Math Enthusiast",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "Great platform for practicing math problems. The interface is intuitive and the problems are challenging.",
            author: "Luca Bianchi",
            role: "Engineering Student",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "I've improved my problem-solving skills significantly. Highly recommend for anyone studying math.",
            author: "Giulia Rossi",
            role: "Graduate Student",
            avatar: GuestAvatar,
            rating: 5
        },
        {
            quote: "The step-by-step solutions are very helpful. It's like having a personal tutor.",
            author: "Matteo Verdi",
            role: "High School Teacher",
            avatar: GuestAvatar,
            rating: 5
        }
    ];

    return (
        <>
        </>
    );
};

export default TestimonialsSection;
