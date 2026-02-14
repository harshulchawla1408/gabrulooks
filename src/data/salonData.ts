export interface Service {
  name: string;
  cashPrice: string;
  cardPrice: string;
  category: "men" | "women";
}

export const services: Service[] = [
  // Men's Services
  { name: "Haircut", cashPrice: "$30", cardPrice: "$35", category: "men" },
  { name: "Zero/Skin Fade", cashPrice: "$35", cardPrice: "$40", category: "men" },
  { name: "Haircut + Beard", cashPrice: "$50", cardPrice: "$60", category: "men" },
  { name: "Beard Trim", cashPrice: "$25", cardPrice: "$30", category: "men" },
  { name: "Beard Shape Up", cashPrice: "$20", cardPrice: "$25", category: "men" },
  { name: "Hair Color (Men)", cashPrice: "$40", cardPrice: "$45", category: "men" },
  { name: "Hair + Beard Color", cashPrice: "$60", cardPrice: "$70", category: "men" },
  { name: "Head Shave", cashPrice: "$20", cardPrice: "$25", category: "men" },
  { name: "Kids Haircut (Under 12)", cashPrice: "$25", cardPrice: "$30", category: "men" },
  { name: "Eyebrow Threading (Men)", cashPrice: "$10", cardPrice: "$12", category: "men" },
  { name: "Hair Wash + Style", cashPrice: "$20", cardPrice: "$25", category: "men" },
  { name: "Hair Straightening (Men)", cashPrice: "$80", cardPrice: "$90", category: "men" },

  // Women's Services
  { name: "Eyebrow Threading", cashPrice: "$10", cardPrice: "$12", category: "women" },
  { name: "Full Face Threading", cashPrice: "$35", cardPrice: "$40", category: "women" },
  { name: "Upper Lip Threading", cashPrice: "$8", cardPrice: "$10", category: "women" },
  { name: "Eyebrow Tinting", cashPrice: "$20", cardPrice: "$25", category: "women" },
  { name: "Eyelash Tinting", cashPrice: "$25", cardPrice: "$30", category: "women" },
  { name: "Brow Tint + Threading", cashPrice: "$25", cardPrice: "$30", category: "women" },
  { name: "Women's Haircut", cashPrice: "$50", cardPrice: "$60", category: "women" },
  { name: "Women's Hair Color", cashPrice: "$80", cardPrice: "$90", category: "women" },
  { name: "Highlights (Half Head)", cashPrice: "$180", cardPrice: "$200", category: "women" },
  { name: "Highlights (Full Head)", cashPrice: "$250", cardPrice: "$280", category: "women" },
  { name: "Balayage", cashPrice: "$200", cardPrice: "$230", category: "women" },
  { name: "Keratin Treatment", cashPrice: "$220", cardPrice: "$250", category: "women" },
  { name: "Nanoplastia", cashPrice: "$300", cardPrice: "$400", category: "women" },
  { name: "Blow Dry & Style", cashPrice: "$40", cardPrice: "$50", category: "women" },
];

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  { id: "1", name: "Premium Hair Pomade", price: "$32", category: "Styling", description: "Strong hold, matte finish pomade for classic and modern styles" },
  { id: "2", name: "Beard Oil – Sandalwood", price: "$28", category: "Beard Care", description: "Nourishing beard oil with natural sandalwood essence" },
  { id: "3", name: "Charcoal Shampoo", price: "$24", category: "Hair Care", description: "Deep cleansing activated charcoal shampoo for men" },
  { id: "4", name: "Styling Hair Wax", price: "$26", category: "Styling", description: "Flexible hold wax for textured, natural-looking styles" },
  { id: "5", name: "Beard Balm", price: "$22", category: "Beard Care", description: "Conditioning balm to tame and style your beard" },
  { id: "6", name: "Hair Growth Serum", price: "$45", category: "Hair Care", description: "Advanced formula to promote thicker, fuller hair" },
  { id: "7", name: "Sea Salt Spray", price: "$20", category: "Styling", description: "Textured beach waves with light hold" },
  { id: "8", name: "Aftershave Balm", price: "$18", category: "Skin Care", description: "Soothing post-shave balm to calm irritation" },
];

export interface Barber {
  name: string;
  specialty: string;
  experience: string;
}

export const barbers: Barber[] = [
  { name: "Raj Singh", specialty: "Skin Fades & Modern Cuts", experience: "8 years" },
  { name: "Arjun Patel", specialty: "Beard Sculpting & Grooming", experience: "6 years" },
  { name: "Vikram Sharma", specialty: "Hair Coloring & Styling", experience: "10 years" },
];

export interface Review {
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  { name: "James W.", rating: 5, text: "Best barbershop in Werribee! The guys at Gabru Looks know exactly what they're doing. My fade was absolutely perfect." },
  { name: "Priya M.", rating: 5, text: "Amazing threading service! So precise and gentle. The salon has a very premium feel. Highly recommend!" },
  { name: "Daniel K.", rating: 5, text: "Been coming here since they opened. Consistent quality every single time. The beard trim is next level." },
  { name: "Sarah L.", rating: 4, text: "Got my highlights done here and they turned out beautifully! Great attention to detail and very professional staff." },
  { name: "Amandeep S.", rating: 5, text: "The keratin treatment completely transformed my hair. The team really knows their craft. Worth every dollar!" },
];
