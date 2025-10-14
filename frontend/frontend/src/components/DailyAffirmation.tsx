const affirmations = [
  "I am enough, as I am, right now.",
  "I choose peace over worry in this moment.",
  "My breath connects me to the present.",
  "I am worthy of love and kindness.",
  "Every challenge is an opportunity to grow.",
  "I trust in my ability to handle whatever comes my way.",
  "I am grateful for this moment of calm.",
  "My inner strength guides me through difficulties.",
  "I deserve happiness and peace.",
  "I am exactly where I need to be.",
  "I choose to focus on what I can control.",
  "My worth is not determined by my productivity.",
  "I am learning and growing every day.",
  "I give myself permission to rest and recharge.",
  "I am connected to something greater than myself.",
  "My feelings are valid and temporary.",
  "I choose compassion for myself and others.",
  "I am resilient and capable of healing.",
  "Today offers new possibilities.",
  "I trust the process of life.",
  "I am worthy of taking up space.",
  "My journey is unique and valuable.",
  "I choose hope over fear.",
  "I am grounded in this present moment.",
  "My sensitivity is a strength, not a weakness.",
  "I am allowed to change and evolve.",
  "I trust my intuition to guide me.",
  "I am doing my best with what I have.",
  "Peace begins within me.",
  "I am grateful for my body and mind.",
  "I choose love over judgment."
];

export function DailyAffirmation() {
  // Get today's date and use it to select an affirmation
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const affirmationIndex = dayOfYear % affirmations.length;
  const todaysAffirmation = affirmations[affirmationIndex];

  return (
    <div className="text-center space-y-3">
      <h3 className="text-lg font-semibold text-foreground">
        Affirmation of the Day
      </h3>
      <p className="text-foreground text-base leading-relaxed px-4">
        "{todaysAffirmation}"
      </p>
    </div>
  );
}