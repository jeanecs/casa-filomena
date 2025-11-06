export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const initialPosts: Post[] = [
  {
    id: 1,
    title: "Welcome to Oceanside Villas",
    content: "We're delighted to have you stay with us. Please don't hesitate to contact our concierge team for any assistance during your visit.",
    author: "Resort Management",
    date: "2025-01-15",
    priority: "MEDIUM"
  },
  {
    id: 2,
    title: "Beach Safety Guidelines",
    content: "For your safety, please be aware of current ocean conditions. Life preservers are available at the beach house. Swimming is recommended during daylight hours only.",
    author: "Safety Team",
    date: "2025-01-14",
    priority: "HIGH"
  },
  {
    id: 3,
    title: "Daily Housekeeping Schedule",
    content: "Housekeeping services are available daily between 10 AM and 3 PM. Please contact reception to schedule your preferred time.",
    author: "Housekeeping",
    date: "2025-01-13",
    priority: "LOW"
  }
];

export const getPriorityColor = (priority: Post['priority']) => {
  switch (priority) {
    case 'HIGH': return 'bg-red-100 text-red-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};