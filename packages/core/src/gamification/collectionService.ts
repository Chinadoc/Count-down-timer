import { Illustration, CollectedIllustration, IllustrationWithCollectionStatus } from './illustrationTypes';
import { ILLUSTRATIONS, TOTAL_PULL_WEIGHT } from './illustrationDefinitions';
import { IStorageService } from './storageInterface';

const USER_COLLECTION_KEY = 'userIllustrationCollection_v1';

export class CollectionService {
  constructor(private storageService: IStorageService) {}

  /**
   * Retrieve the user's current illustration collection
   */
  async getUserCollection(): Promise<CollectedIllustration[]> {
    return (await this.storageService.getItem<CollectedIllustration[]>(USER_COLLECTION_KEY)) || [];
  }

  /**
   * Save the user's illustration collection
   */
  private async saveUserCollection(collection: CollectedIllustration[]): Promise<void> {
    await this.storageService.setItem(USER_COLLECTION_KEY, collection);
  }

  /**
   * Perform a weighted random selection to pull an illustration
   */
  private performPull(): Illustration | undefined {
    if (TOTAL_PULL_WEIGHT === 0) return undefined; // No items or all weights are 0

    const randomPoint = Math.random() * TOTAL_PULL_WEIGHT;
    let currentWeight = 0;

    for (const illustration of ILLUSTRATIONS) {
      currentWeight += illustration.pullWeight;
      if (randomPoint <= currentWeight) {
        return illustration;
      }
    }
    return undefined; // Should ideally not be reached if weights are positive
  }

  /**
   * Attempt to pull a new illustration and save it to the user's collection
   * Returns the pulled illustration, or null if unsuccessful
   */
  async attemptPullAndSave(): Promise<Illustration | null> {
    try {
      const pulledIllustration = this.performPull();
      if (!pulledIllustration) {
        return null; // No illustration pulled (e.g., empty list, error)
      }

      const currentCollection = await this.getUserCollection();
      const alreadyCollected = currentCollection.find(ci => ci.illustrationId === pulledIllustration.id);

      if (alreadyCollected) {
        // User already has this illustration, but we still return it
        // In a more advanced system, this could give "duplicate currency"
        return pulledIllustration;
      }

      // Add the new illustration to the user's collection
      const newEntry: CollectedIllustration = {
        illustrationId: pulledIllustration.id,
        collectedAt: new Date().toISOString(),
        isNew: true,
      };
      currentCollection.push(newEntry);
      await this.saveUserCollection(currentCollection);
      return pulledIllustration;
    } catch (error) {
      console.error('Error pulling illustration:', error);
      return null;
    }
  }

  /**
   * Mark an illustration as seen (no longer "new")
   */
  async markAsSeen(illustrationId: string): Promise<void> {
    try {
      const collection = await this.getUserCollection();
      const item = collection.find(i => i.illustrationId === illustrationId);
      if (item && item.isNew) {
        item.isNew = false;
        await this.saveUserCollection(collection);
      }
    } catch (error) {
      console.error('Error marking illustration as seen:', error);
    }
  }

  /**
   * Get the full details of all illustrations, including collection status
   */
  async getFullCollectionDetails(): Promise<IllustrationWithCollectionStatus[]> {
    try {
      const collected = await this.getUserCollection();
      const collectedMap = new Map(collected.map(c => [
        c.illustrationId, 
        { collectedAt: c.collectedAt, isNew: c.isNew }
      ]));

      return ILLUSTRATIONS.map(illu => ({
        illustration: illu,
        collectedAt: collectedMap.get(illu.id)?.collectedAt || null,
        isNew: collectedMap.get(illu.id)?.isNew,
      }));
    } catch (error) {
      console.error('Error getting collection details:', error);
      return [];
    }
  }

  /**
   * Get detailed information about collected illustrations only
   */
  async getCollectedIllustrations(): Promise<IllustrationWithCollectionStatus[]> {
    const allDetails = await this.getFullCollectionDetails();
    return allDetails.filter(item => item.collectedAt !== null);
  }
}
