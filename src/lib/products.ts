export type Product = {
  name: string;
  type: "pickle" | "powder";
  color: string;
  fill: string;
  notes: string;
  ingredients: string[];
  description: string;
  flavour: string;
};

export const products: Product[] = [
  { name: "Raw Mango Pickle", type: "pickle", color: "#b84318", fill: "#d84c12", notes: "Bright, tangy and boldly spiced, with the familiar bite of raw mango.", ingredients: ["Raw mango", "Salt", "Traditional spices", "Oil"], description: "A classic mango pickle with a lively sour edge and a warming spice finish.", flavour: "Tangy • Robust • Spiced" },
  { name: "Mango Hindi", type: "pickle", color: "#c64b17", fill: "#e17a1b", notes: "A richly seasoned mango preparation with a rounded, aromatic flavour.", ingredients: ["Mango", "Salt", "Traditional spice blend", "Oil"], description: "A distinctive mango favourite inspired by traditional regional preparations.", flavour: "Tangy • Aromatic • Full-bodied" },
  { name: "Amla Pickle", type: "pickle", color: "#63802b", fill: "#a7a83c", notes: "Amla's signature tartness meets earthy spices for a lively, layered taste.", ingredients: ["Amla (Indian gooseberry)", "Salt", "Traditional spices", "Oil"], description: "A vibrant gooseberry pickle that balances a sharp tang with deep seasoning.", flavour: "Tart • Earthy • Spiced" },
  { name: "Amla Hindi", type: "pickle", color: "#718234", fill: "#9b9b3b", notes: "A bold, traditional amla flavour with a fragrant spice profile.", ingredients: ["Amla", "Salt", "Traditional spice blend", "Oil"], description: "A regional-style amla preparation for those who enjoy a distinctive, tangy bite.", flavour: "Tangy • Herbal • Warm" },
  { name: "Mixed Fruit Hindi", type: "pickle", color: "#b74c21", fill: "#d96d21", notes: "A playful sweet-sour balance, with fruit notes meeting warming spices.", ingredients: ["Mixed fruits", "Salt", "Traditional spices", "Oil"], description: "A colourful medley of fruit-inspired flavour with sweet, sour and spicy character.", flavour: "Sweet-sour • Fruity • Aromatic" },
  { name: "Green Chilli Pickle", type: "pickle", color: "#376d28", fill: "#438c30", notes: "Fresh green chilli character with a lively heat and savoury spice.", ingredients: ["Green chillies", "Salt", "Traditional spices", "Oil"], description: "A punchy accompaniment for anyone who loves a little extra heat on the plate.", flavour: "Fiery • Sharp • Savoury" },
  { name: "Andhra Pickle", type: "pickle", color: "#a92818", fill: "#bd3018", notes: "A bold, chilli-forward profile with a lingering, robust spice finish.", ingredients: ["Traditional pickle vegetable/fruit", "Chilli", "Salt", "Spice blend", "Oil"], description: "Inspired by the assertive, spice-loving character of Andhra-style pickles.", flavour: "Hot • Bold • Deeply spiced" },
  { name: "Dry Appi Midi Pickle", type: "pickle", color: "#6e762c", fill: "#9b9a3d", notes: "A heritage-style pickle with a distinctive, savoury, concentrated flavour.", ingredients: ["Appi midi mango", "Salt", "Traditional spices", "Oil"], description: "A special regional variety celebrating the distinctive character of appi midi mango.", flavour: "Savoury • Tart • Traditional" },
  { name: "Bitter Gourd Pickle", type: "pickle", color: "#52732a", fill: "#8b8c31", notes: "A pleasantly bitter edge balanced by seasoning and a savoury finish.", ingredients: ["Bitter gourd", "Salt", "Traditional spices", "Oil"], description: "A distinctive pickle for lovers of complex, savoury flavours and a gentle bitter note.", flavour: "Bitter-savoury • Spiced • Bold" },
  { name: "Sweet Mango Pickle", type: "pickle", color: "#bc601e", fill: "#e8a32d", notes: "A mellow sweet-tangy mango taste with warm, fragrant seasoning.", ingredients: ["Mango", "Sweetener", "Salt", "Traditional spices"], description: "A softer, sweeter mango profile that brings a comforting balance to everyday meals.", flavour: "Sweet • Tangy • Warm" },
  { name: "Lemon Pickle", type: "pickle", color: "#b0a52c", fill: "#d5c83c", notes: "Citrusy brightness with a savoury, seasoned depth.", ingredients: ["Lemon", "Salt", "Traditional spices", "Oil"], description: "A zesty, classic accompaniment with a bright citrus aroma and lingering spice.", flavour: "Citrusy • Tangy • Savoury" },
  { name: "Garlic Chutney Powder", type: "powder", color: "#8c3a23", fill: "#a94e2a", notes: "A punchy garlic aroma with a roasted, savoury and gently spicy finish.", ingredients: ["Garlic", "Chilli", "Salt", "Traditional spices"], description: "A bold, versatile dry chutney powder that adds savoury depth to everyday meals.", flavour: "Garlicky • Roasted • Spicy" },
  { name: "Hing Chutney Powder", type: "powder", color: "#8b5a2b", fill: "#bb8540", notes: "Aromatic hing character with earthy, savoury spice notes.", ingredients: ["Hing (asafoetida)", "Chilli", "Salt", "Traditional spices"], description: "A fragrant chutney powder built around the distinctive aroma of asafoetida.", flavour: "Aromatic • Earthy • Savoury" },
];

export const heroProduct: Product = {
  name: "Raw Mango Pickle",
  type: "pickle",
  color: "#b84318",
  fill: "#d84c12",
  notes: "",
  ingredients: [],
  description: "",
  flavour: "",
};

export const WHATSAPP_URL = "https://wa.me/917760397902";
export const INSTAGRAM_URL = "https://www.instagram.com/indira_pachhis_vasari?obrf=MWYzZ3pzZGlzd2Zycw==";
export const LOCATION_URL = "https://maps.app.goo.gl/VVjJuRGBx2piGJav7?g_st=ic";
