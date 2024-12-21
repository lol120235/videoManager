import * as tf from "@tensorflow/tfjs";

export function cosineSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  const dotProduct = tf.dot(embedding1, embedding2).dataSync()[0];
  const norm1 = tf.norm(embedding1).dataSync()[0];
  const norm2 = tf.norm(embedding2).dataSync()[0];
  return dotProduct / (norm1 * norm2);
}
