const DB_NAME = "WasteSegAI";
const STORE_NAME = "uploadedImage";
const IMAGE_KEY = "currentImage";

interface StoredImage {
  blob: Blob;
  name: string;
  type: string;
  lastModified: number;
}

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const saveImage = async (
  file: File
): Promise<void> => {
  const db = await openDatabase();

  const storedImage: StoredImage = {
    blob: file,
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    transaction.objectStore(STORE_NAME).put(
      storedImage,
      IMAGE_KEY
    );

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const loadImage = async (): Promise<File | null> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const request = transaction
      .objectStore(STORE_NAME)
      .get(IMAGE_KEY);

    request.onsuccess = () => {
      const stored =
        request.result as StoredImage | undefined;

      db.close();

      if (!stored) {
        resolve(null);
        return;
      }

      const file = new File(
        [stored.blob],
        stored.name,
        {
          type: stored.type,
          lastModified: stored.lastModified,
        }
      );

      resolve(file);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const clearImage = async (): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    transaction.objectStore(STORE_NAME).delete(
      IMAGE_KEY
    );

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};