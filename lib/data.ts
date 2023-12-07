import React from "react";
import { TbWorldWww } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import autoguiImg from "@/public/autogui.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";

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
      "I'm now a full-stack developer working as a freelancer. My stack includes React, Next.js, TypeScript, Tailwind, Prisma and MongoDB. I'm open to full-time opportunities.",
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
    title: "rmtDev",
    description:
      "Job board for remote developer jobs. I was the front-end developer. It has features like filtering, sorting and pagination.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Redux"],
    imageUrl: rmtdevImg,
  },
  {
    title: "Word Analytics",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["React", "Next.js", "SQL", "Tailwind", "Framer"],
    imageUrl: wordanalyticsImg,
  },
  {
    title: "Word Analytics",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["React", "Next.js", "SQL", "Tailwind", "Framer"],
    imageUrl: wordanalyticsImg,
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
  "Solidity",
  "Ethereum",
  "Dart",
  "Flutter", 
] as const;
