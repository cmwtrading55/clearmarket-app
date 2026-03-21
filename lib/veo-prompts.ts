/**
 * VEO VIDEO STRATEGY & PROMPTS (CANNABIS PURPLE / AGRI-DEFI NOIR)
 * 
 * Engineered via Gemini to bridge the gap between high-end agriculture 
 * and crypto-native yield markets.
 */

export const VEO_STRATEGY = {
  theme: "Cannabis Purple (#7C3AED) on Near-Black (#0A0A0F)",
  lighting: "Cinematic, deep shadows, neon purple accents, ultraviolet pulses",
  vibe: "Agri-DeFi Noir, luxury, precision, digital yield",
};

export const VEO_PROMPTS = {
  HERO: {
    title: "The Digital Bloom",
    prompt: "Cinematic macro shot of a crystalline cannabis bud maturing under deep purple and indigo ultraviolet light. Translucent trichomes glowing like diamonds. Floating digital data nodes and Solana-purple light rays passing through the leaves. 4k, hyper-realistic, slow motion, dark atmospheric background.",
  },
  LAUNCHPAD_CARD: {
    title: "Yield Flow",
    prompt: "A close-up of a high-tech hydroponic system where the water is glowing with neon purple bioluminescence. Tiny digital 'tokens' (glowing violet spheres) are seen traveling through the nutrient solution along the roots of a cannabis plant. High-speed macro, sterile environment, dark shadows.",
  },
  GROWER_VERIFICATION: {
    title: "Proof of Quality",
    prompt: "A futuristic robotic arm with a purple laser scanner performing a 3D scan of a high-grade cannabis leaf in a dark lab. The scan reveals a digital wireframe of the plant's structure in neon violet. Scientific, precise, dark tech aesthetic.",
  },
  SETTLEMENT: {
    title: "Liquid Harvest",
    prompt: "A digital visualization of purple-tinted USDC liquid flowing into a glass 'vault' that looks like a high-end cannabis extract jar. The liquid turns into crystalline structures as it hits the bottom. Cinematic lighting, slow motion, 4k.",
  },
};

export const VEO_INTEGRATION_GUIDE = `
1. Use the prompts above in your Veo generation environment.
2. Export as MP4 (preferably < 5MB).
3. Place in /public/video/ with the names specified in components.
4. The VideoBackground component will handle the loop and cinematic playback rate.
`;
