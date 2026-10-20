export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface TimelineEntry {
  year: string;
  role: string;
  company: string;
}

export const OVERVIEW_DATA = {
  name: "Meskatul Masabhi Shanto",
  firstName: "Meskatul Masa",
  lastName: "bhi Shanto",
  typingRoles: [
    "Full Stack Developer",
    "UI/UX Designer",
    "React Expert",
    "TypeScript Wizard"
  ],
  status: "Available for Work",
  bioHeadline: "Hello, I'm",
  tagline: "I'm a passionate developer and designer obsessed with building exceptional digital experiences. I bridge the gap between elegant engineering and pixel-perfect design.",
  aboutDescription1: "I'm a multidisciplinary developer and designer based in San Francisco. I believe in creating software that is not only robust under the hood but also delightful to interact with.",
  aboutDescription2: "My journey began with a curiosity about how the web works, which quickly turned into a passion for building it. Over the years, I've honed my skills in frontend and backend engineering, while developing a keen eye for aesthetics and user experience.",
  aboutDescription3: "When I'm not writing code or pushing pixels, you can find me exploring new coffee shops, hiking trails, or reading about the latest tech trends.",
  stats: [
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 50, suffix: "+", label: "Projects Completed" },
    { value: 30, suffix: "+", label: "Happy Clients" },
    { value: 10, suffix: "+", label: "Awards Won" }
  ] as StatItem[],
  timeline: [
    { year: "2023", role: "Senior Frontend Developer", company: "TechCorp" },
    { year: "2021", role: "Full Stack Developer", company: "StartupXYZ" },
    { year: "2019", role: "UI/UX Designer", company: "DesignStudio" },
    { year: "2018", role: "B.S. Computer Science", company: "MIT" }
  ] as TimelineEntry[],
  resumeUrl: "/my_CV%20update.pdf",
  resumeFileName: "my_CV update.pdf",
  email: "mmshanto25@gmail.com"
};
