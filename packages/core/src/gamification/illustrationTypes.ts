export interface Illustration {
  id: string;
  name: string;
  imagePath: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  pullWeight: number;
  description?: string;
  artist?: string;
}

export interface CollectedIllustration {
  illustrationId: string;
  collectedAt: string; // ISO Date string
  isNew?: boolean; // For UI highlighting
}

export interface IllustrationWithCollectionStatus {
  illustration: Illustration;
  collectedAt: string | null;
  isNew?: boolean;
}
