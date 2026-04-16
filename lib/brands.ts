export interface Brand {
  slug: string;
  name: string;
  popular?: boolean;
  hasLogo?: boolean; // if true, /public/logos/<slug>.svg exists
  models: string[]; // headline models for landing-page copy and internal links
  avgPrice?: string; // rough anchor, used in marketing copy only
}

export const BRANDS: Brand[] = [
  { slug: "vw", name: "VW", popular: true, hasLogo: true, models: ["Golf", "Polo", "Passat", "Tiguan", "T-Roc", "ID.3", "ID.4"], avgPrice: "€ 14.500" },
  { slug: "bmw", name: "BMW", popular: true, hasLogo: true, models: ["1er", "3er", "5er", "X1", "X3", "X5"], avgPrice: "€ 22.800" },
  { slug: "audi", name: "Audi", popular: true, hasLogo: true, models: ["A3", "A4", "A6", "Q3", "Q5", "Q7"], avgPrice: "€ 21.400" },
  { slug: "mercedes-benz", name: "Mercedes-Benz", popular: true, hasLogo: true, models: ["A-Klasse", "C-Klasse", "E-Klasse", "GLA", "GLC"], avgPrice: "€ 24.100" },
  { slug: "skoda", name: "Škoda", popular: true, hasLogo: true, models: ["Fabia", "Octavia", "Superb", "Kodiaq", "Karoq"], avgPrice: "€ 13.200" },
  { slug: "opel", name: "Opel", hasLogo: true, models: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland"], avgPrice: "€ 9.800" },
  { slug: "ford", name: "Ford", hasLogo: true, models: ["Fiesta", "Focus", "Kuga", "Puma", "Mondeo"], avgPrice: "€ 11.700" },
  { slug: "seat", name: "Seat", models: ["Ibiza", "Leon", "Arona", "Ateca"], avgPrice: "€ 11.900" },
  { slug: "renault", name: "Renault", models: ["Clio", "Megane", "Captur", "Kadjar", "ZOE"], avgPrice: "€ 10.200" },
  { slug: "peugeot", name: "Peugeot", models: ["208", "308", "2008", "3008", "5008"], avgPrice: "€ 11.400" },
  { slug: "hyundai", name: "Hyundai", hasLogo: true, models: ["i10", "i20", "i30", "Tucson", "Kona", "Ioniq 5"], avgPrice: "€ 13.600" },
  { slug: "kia", name: "Kia", hasLogo: true, models: ["Picanto", "Ceed", "Sportage", "Niro", "EV6"], avgPrice: "€ 13.200" },
  { slug: "toyota", name: "Toyota", models: ["Yaris", "Corolla", "C-HR", "RAV4", "Aygo"], avgPrice: "€ 14.800" },
  { slug: "mazda", name: "Mazda", hasLogo: true, models: ["Mazda2", "Mazda3", "CX-3", "CX-5", "CX-30"], avgPrice: "€ 15.100" },
  { slug: "volvo", name: "Volvo", hasLogo: true, models: ["V40", "V60", "V90", "XC40", "XC60", "XC90"], avgPrice: "€ 26.500" },
  { slug: "tesla", name: "Tesla", hasLogo: true, models: ["Model 3", "Model Y", "Model S", "Model X"], avgPrice: "€ 38.900" },
  { slug: "fiat", name: "Fiat", hasLogo: true, models: ["500", "Panda", "Tipo", "500X"], avgPrice: "€ 8.400" },
  { slug: "dacia", name: "Dacia", hasLogo: true, models: ["Sandero", "Duster", "Spring", "Jogger"], avgPrice: "€ 8.900" },
];

export const BRAND_SLUGS = BRANDS.map((b) => b.slug);

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
}
