export interface TestimonialItem {
  name: string;
  position: string;
  text: string;
  initials: string;
  color: string;
}

export interface ContactInfoItem {
  type: 'email' | 'phone' | 'location';
  title: string;
  value: string;
  href?: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Sarah Johnson",
    position: "CEO @ TechVentures",
    text: "Meskatul Masabhi Shanto delivered our platform on time and exceeded all expectations. The code quality was exceptional and the UI was stunning. A true professional.",
    initials: "SJ",
    color: "from-blue-400 to-indigo-500"
  },
  {
    name: "Michael Chen",
    position: "CTO @ StartupHub",
    text: "Working with Meskatul Masabhi Shanto was a game-changer. His ability to balance technical excellence with great design is rare and invaluable. He elevated our entire product.",
    initials: "MC",
    color: "from-emerald-400 to-teal-500"
  },
  {
    name: "Emily Rodriguez",
    position: "Product Manager @ DesignCo",
    text: "Meskatul Masabhi Shanto transformed our outdated system into a modern, performant application. Our user engagement increased by 150% within the first month.",
    initials: "ER",
    color: "from-rose-400 to-red-500"
  },
  {
    name: "David Kim",
    position: "Founder @ AppWorks",
    text: "Meskatul Masabhi Shanto's attention to detail and passion for great UX set him apart. He doesn't just write code; he builds experiences. Would hire again in a heartbeat.",
    initials: "DK",
    color: "from-amber-400 to-orange-500"
  },
  {
    name: "Lisa Wang",
    position: "VP Engineering @ DataFlow",
    text: "Exceptional technical skills paired with strong design sense. Meskatul Masabhi Shanto is the full package. He mentored our junior devs while delivering critical features.",
    initials: "LW",
    color: "from-purple-400 to-pink-500"
  }
];

export const CONTACT_INFO: ContactInfoItem[] = [
  {
    type: 'email',
    title: "Email",
    value: "mmshanto25@gmail.com",
    href: "mailto:mmshanto25@gmail.com"
  },
  {
    type: 'phone',
    title: "Phone",
    value: "+8801925878752",
    href: "tel:+8801925878752"
  },
  {
    type: 'location',
    title: "Location",
    value: "Dhaka, Bangladesh"
  }
];

export const CONNECT_HEADING = {
  title: "Let's Work Together",
  subtitle: "Ready to bring your ideas to life? Whether you have a project in mind or just want to chat about tech, I'm always open to discussing new opportunities.",
  socialsHeading: "Connect with me",
  formTitle: "Send a Message",
  availabilityText: "Available for remote work"
};
