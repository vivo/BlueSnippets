import { pipeline } from '@huggingface/transformers';
export async function depthEstimator(url) {
  const depth_estimator = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf');
  const output = await depth_estimator(url);
  const blob=await output.depth.toBlob()
  return URL.createObjectURL(blob)
}