import React from "react";
import { TbWorldWww } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import autoguiImg from "@/public/autogui.png";
import companionAiImg from "@/public/companion-ai.png";
import weatherAppImg from "@/public/weather-app.png";
import djangoCRM from "@/public/django-crm.png"

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Enrolled in a bootcamp",
    location: "Dhaka",
    description:
      "I enrolled in a bootcamp about full stack web development which focused on beginner friendly concepts which lasted for 3 months",
    icon: React.createElement(TbWorldWww),
    date: "2019",
  },
  {
    title: "Bachelor in Computer Science and Engineering",
    location: "Dhaka",
    description:
      "I pursued my Bachelor's in Computer Science and Engineering Degree and learned about other languages and Frameworks such Flutter and Nextjs ",
    icon: React.createElement(LuGraduationCap),
    date: "2020 - 2023",
  },
  {
    title: "Freelance Full-Stack Developer",
    location: "Dhaka",
    description:
      "I'm now looking for gigs as a freelancer. My stack includes React, Next.js, TypeScript, Tailwind, Prisma and MongoDB. I'm open to full-time opportunities.",
    icon: React.createElement(FaReact),
    date: "2023 - present",
  },
] as const;

export const projectsData = [
  {
    title: "Autonomous Vehicle GUI",
    description:
      "A python based GUI build to communicate with and control autonomous vehicle using communication port of devices.",
    tags: ["Python", "PyQt5", "Folium", "OpenCV", "Serial"],
    imageUrl: autoguiImg,
  },
  {
    title: "Weather App",
    description:
      "A public web app for quick weather updates which has search facility. It includes multiple widgets such as Humidity, Pressure, Temperature etc.",
    tags: ["React", "Next.js", "React-leaflet", "Tailwind", "Lodash"],
    imageUrl: weatherAppImg,
  },
  {
    title: "Django CRM",
    description:
      "A customer relationship management project using Django framework which utilizes mysql as backend",
    tags: ["Django", "Mysql", "Bootstrap"],
    imageUrl: weatherAppImg,
  },
  {
    title: "Companion-AI",
    description:
      "An AI powered chatting system where you can create a companion and communicate with it about topics it knows",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Stripe", "OpenAI"],
    imageUrl: companionAiImg,
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Framer Motion",
  "Git",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Express",
  "MySQL",
  "Python",
  "Django",
  "PyQT",
  "Hyperledger Aries",
  "Hyperledger Fabric",
  "Solidity",
  "Ethereum",
  "Dart",
  "Flutter", 
] as const;
