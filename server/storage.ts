// This survey kiosk application uses frontend local storage
// No backend storage is required for the current implementation
export interface IStorage {
  // Add storage methods here if backend storage is needed in the future
}

export class MemStorage implements IStorage {
  constructor() {
    // No backend storage needed
  }
}

export const storage = new MemStorage();
