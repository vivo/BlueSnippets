import * as tf from "@tensorflow/tfjs";
import apiClient from "@/services/http";

export class DoodleClassifier {
  model;
  classes = [];

  constructor() {}

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel("assets/doodle-model/model.json");

      const response = await apiClient.get("assets/doodle-model/classes.json");
      if (response.data && response.data.classes) {
        this.classes = response.data.classes;
      } else {
        console.error("Failed to load or parse classes.json", response);
        throw new Error("Failed to load or parse classes.json");
      }
      console.log("Doodle Classifier Model and Classes loaded successfully");
    } catch (error) {
      console.error("Error loading Doodle Classifier model or classes:", error);
      throw error;
    }
  }

  async predict(data) {
    if (!this.model) {
      console.error("Model not loaded yet for prediction.");
      return undefined;
    }
    try {
      // TypeScript 'as Tensor' cast is removed as it's a type assertion
      const argMax = await this.model.predict(data).argMax(-1).data();
      return this.classes[argMax[0]];
    } catch (error) {
      console.error("Error during prediction:", error);
      return undefined;
    }
  }

  async predictTopN(data, n) {
    if (!this.model) {
      console.error("Model not loaded yet for prediction.");
      return undefined;
    }
    try {
      // TypeScript 'as Tensor' cast is removed
      const prediction = await this.model.predict(data).data();

      const predictionArray = Array.from(prediction);

      const indexedPredictions = predictionArray.map((probability, index) => ({
        probability,
        index,
      }));

      indexedPredictions.sort((a, b) => b.probability - a.probability);

      const topNPredictions = indexedPredictions.slice(0, n);

      return topNPredictions.map((p) => ({
        label: this.classes[p.index],
        accuracy: p.probability,
      }));
    } catch (error) {
      console.error("Error during predictTopN:", error);
      return undefined;
    }
  }
}
