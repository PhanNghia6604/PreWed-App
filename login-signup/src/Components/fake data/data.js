import { Favorite, Event, EmojiPeople, School, Chat, Checklist , EventAvailable, PeopleAlt, AddLocationAltOutlined, PhoneIphone, EmailOutlined, Facebook, Twitter, Instagram, YouTube } from "@mui/icons-material"

export const navlink = [
  {
    url: "/",
    text: "Home",
  },
  {
    url: "/about",
    text: "About",
  },
  {
    url: "/services",
    text: "Services",
  },
  {
    url: "/lists",
    text: "List of consultants",
  },
  {
    url: "/quiz",
    text: "Do Quiz",
  },
  {
    url: "/blog",
    text: "Blog",
  },
  {
    url: "/contact",
    text: "Contact",
  },
]
export const home = [
  {
    text: "HELLO WE'RE",
    name: "Premarital Counselors Before Marriage",
    post: "WEBSITE HELP PREPARE FOR MARRIAGE",
    design: "IN-DEPTH CONSULTATION FROM PSYCHOLOGISTS AND MARRIAGE AND FAMILY EXPERTS",
    desc: "The Marrige is built with the standard of supporting your goals in the most comprehensive way, from next communication skills, family financial management, to psychological advice and secrets to maintaining long-term happiness. We bring you:",
  },
]
export const about = [
  {
    desc: "Welcome to WedWise, your trusted companion on the journey to a happy and lasting marriage. We understand that marriage is not just a significant event but the beginning of a new chapter filled with love, growth, and meaningful challenges.",
    desc1: "With the support of experienced experts, we provide valuable advice, pre-marital skill courses, and detailed wedding planning guides to help you confidently step into your new life together.",
    cover: "./images/wedding.png",
  },
]

export const services = [
  {
    id: 1,
    icon: <Favorite />,
    title: "Relationship Counseling",
    desc: "Providing expert advice to help couples strengthen their emotional connection and resolve conflicts effectively.",
  },
  {
    id: 2,
    icon: <Event />,
    title: "Wedding Planning Guidance",
    desc: "Step-by-step support in planning your dream wedding, from venue selection to managing event details seamlessly.",
  },
  {
    id: 3,
    icon: <EmojiPeople />,
    title: "Pre-marital Workshops",
    desc: "Interactive workshops covering essential topics like communication, financial management, and shared responsibilities.",
  },
  {
    id: 4,
    icon: <School />,
    title: "Life Skills Coaching",
    desc: "Develop key life skills for a successful marriage, including problem-solving, empathy, and stress management.",
  },
  {
    id: 5,
    icon: <Chat />,
    title: "Expert Consultations",
    desc: "One-on-one sessions with relationship experts to address specific concerns and provide personalized advice.",
  },
  {
    id: 6,
    icon: <Checklist />,
    title: "Marriage Preparation Checklist",
    desc: "Comprehensive checklists to ensure you cover all important aspects before saying 'I do'.",
  },
];
export const project = [
  {
    id: 1,
    icon: <Favorite />,
    num: "40",
    title: "HAPPY COUPLES",
  },
  {
    id: 2,
    icon: <EventAvailable />,
    num: "75",
    title: "SUCCESSFUL EVENTS",
  },
  {
    id: 3,
    icon: <PeopleAlt />,
    num: "320",
    title: "CONSULTATIONS PROVIDED",
  },
  {
    id: 4,
    icon: <School />,
    num: "50",
    title: "WORKSHOPS ORGANIZED",
  },
];
export const portfolio = [
  {
    id: 1,
    cover: "../images/port/port1.jpg",
    name: "Brand",
    category: "marketing",
    title: "Brex Logo",
  },
  {
    id: 2,
    cover: "../images/port/port2.jpg",
    name: "Brand",
    category: "design",
    title: "Brex Logo",
  },
  {
    id: 3,
    cover: "../images/port/port3.jpg",
    name: "Brand",
    category: "development",
    title: "Brex Logo",
  },
  {
    id: 4,
    cover: "../images/port/port4.jpg",
    name: "Brand",
    category: "marketing",
    title: "Brex Logo",
  },
  {
    id: 5,
    cover: "../images/port/port5.jpg",
    name: "Brand",
    category: "design",
    title: "Brex Logo",
  },
  {
    id: 6,
    cover: "../images/port/port6.jpg",
    name: "Brand",
    category: "development",
    title: "Brex Logo",
  },
]
export const testimonials = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitordapibus dictum.Fusce faucibus ligula scelerisque, eleifend turpis in",
    image: "./images/testimonials/team-1.png",
    name: "Alamin Musa",
    post: "Front End Developer",
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitordapibus dictum.Fusce faucibus ligula scelerisque, eleifend turpis in",
    image: "./images/testimonials/team-2.png",
    name: "Alex Ander",
    post: "Back End Developer",
  },
  {
    id: 3,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitordapibus dictum.Fusce faucibus ligula scelerisque, eleifend turpis in",
    image: "./images/testimonials/team-3.png",
    name: "GorkCoder",
    post: "React Developer",
  },
]
export const blog = [
  {
    id: 1,
    title: "Master These Awesome",
    date: "Jun 27, 2022",
    author: "Dorian Gray",
    desc: "Lorem Ipsum has been standard. Lorem Ipsum is simply text of the printing and typesetting industry. Lorem Ipsum has been",
    cover: "./images/blog/b1.png",
  },
  {
    id: 2,
    title: "Best Design Items to Appeal",
    date: "Jun 27, 2022",
    author: "Dorian Gray",
    desc: "Lorem Ipsum has been standard. Lorem Ipsum is simply text of the printing and typesetting industry. Lorem Ipsum has been",
    cover: "./images/blog/b2.png",
  },
  {
    id: 3,
    title: "The 20 Best Lightroom Presets",
    date: "Jun 27, 2022",
    author: "Dorian Gray",
    desc: "Lorem Ipsum has been standard. Lorem Ipsum is simply text of the printing and typesetting industry. Lorem Ipsum has been",
    cover: "./images/blog/b3.png",
  },
]
export const contact = [
  {
    icon: <AddLocationAltOutlined />,
    text1: "2651 Main Street, Suit 124",
    text2: "Seattle, WA, 98101",
  },
  {
    icon: <PhoneIphone />,
    text1: "0123456789",
    text2: "0345627891",
  },
  {
    icon: <EmailOutlined />,
    text1: "hello@thetheme.io",
    text2: "inf0@brex-theme.io",
  },
]
export const social = [
  {
    icon: <Facebook />,
  },
  {
    icon: <Twitter />,
  },
  {
    icon: <Instagram />,
  },
  {
    icon: <YouTube />,
  },
]