import { pipeline } from '@xenova/transformers';

// Generate embedding vector
export async function getEmbedding(text: string): Promise<number[]> {
  // Load sentence embedding pipeline
  const embedder = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  );

  const result = await embedder(text, { pooling: 'mean', normalize: true });

  return Array.from(result.data);
}
