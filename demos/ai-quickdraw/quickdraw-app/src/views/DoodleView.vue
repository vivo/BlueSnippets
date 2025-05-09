<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center">
      <div class="col-24 col-md-10 col-lg-8 col-sm-11">
        <div class="d-flex justify-content-center flex-column mt-3">
          <canvas ref="canvasEl"></canvas>
          <button class="mt-2" @click="onClear">Clear</button>
        </div>
      </div>
      <div class="col-24 col-md-10 col-lg-6 col-sm-11">
        <div class="d-flex flex-column mt-3">
          <div
            class="mb-1 d-flex align-items-center justify-content-center font-weight-semibold"
            v-for="(pred, index) in predictions"
            :key="index"
          >
            <div class="mr-1">{{ pred.label }}</div>
            <div>{{ formatPercent(pred.accuracy) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fromEvent, merge, Subject } from "rxjs";
import {
  switchMap,
  takeUntil,
  pairwise,
  map,
  debounceTime,
} from "rxjs/operators";
import * as tf from "@tensorflow/tfjs";
import { DoodleClassifier } from "@/models/DoodleClassifier";

export default {
  name: "DoodleView",
  data() {
    return {
      canvas: null,
      cx: null,
      model: null,
      drawing$: new Subject(),
      predictions: [],
      resizeListener: null,
      mouseMoveUnsubscriber$: new Subject(),
      touchMoveUnsubscriber$: new Subject(),
    };
  },
  mounted() {
    this.model = new DoodleClassifier();
    this.model.loadModel().catch((err) => {
      console.error("Failed to load model in DoodleView:", err);
    });

    this.drawingSubscription = this.drawing$
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.onGuess();
      });

    this.$nextTick(() => {
      this.initCanvas();
      this.setupDrawingEvents();
    });

    this.resizeListener = () => this.initCanvas();
    window.addEventListener("resize", this.resizeListener);
  },
  beforeUnmount() {
    if (this.drawingSubscription) {
      this.drawingSubscription.unsubscribe();
    }
    this.mouseMoveUnsubscriber$.next();
    this.mouseMoveUnsubscriber$.complete();
    this.touchMoveUnsubscriber$.next();
    this.touchMoveUnsubscriber$.complete();
    window.removeEventListener("resize", this.resizeListener);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvasEl;
      if (!this.canvas) return;
      this.cx = this.canvas.getContext("2d");
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      this.cx.lineWidth = 16;
      this.cx.lineCap = "round";
      this.cx.strokeStyle = "black";
      this.cx.fillStyle = "#ffffff";
      this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    setupDrawingEvents() {
      if (!this.canvas) return;

      const mousedown$ = fromEvent(this.canvas, "mousedown");
      const mousemove$ = fromEvent(document, "mousemove"); // Listen on document for mousemove
      const mouseup$ = fromEvent(document, "mouseup"); // Listen on document for mouseup
      const mouseleave$ = fromEvent(this.canvas, "mouseleave");

      const touchstart$ = fromEvent(this.canvas, "touchstart");
      const touchmove$ = fromEvent(document, "touchmove"); // Listen on document for touchmove
      const touchend$ = fromEvent(document, "touchend"); // Listen on document for touchend

      const mouseDraw$ = mousedown$.pipe(
        switchMap((e) => {
          e.preventDefault();
          return mousemove$.pipe(
            takeUntil(mouseup$),
            takeUntil(mouseleave$),
            takeUntil(this.mouseMoveUnsubscriber$),
            pairwise(),
            map((events) =>
              events.map((event) => ({
                clientX: event.clientX,
                clientY: event.clientY,
              }))
            )
          );
        })
      );

      const touchDraw$ = touchstart$.pipe(
        switchMap((e) => {
          e.preventDefault();
          return touchmove$.pipe(
            takeUntil(touchend$),
            takeUntil(this.touchMoveUnsubscriber$),
            pairwise(),
            map((events) =>
              events.map((event) => ({
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
              }))
            )
          );
        })
      );

      this.drawSubscription = merge(mouseDraw$, touchDraw$).subscribe((res) => {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };

        this.cx.beginPath();
        this.cx.moveTo(prevPos.x, prevPos.y);
        this.cx.lineTo(currentPos.x, currentPos.y);
        this.cx.stroke();
        this.drawing$.next(null);
      });
    },
    async onGuess() {
      if (!this.model || !this.cx || !this.canvas) return;

      const imgData = this.cx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      tf.tidy(() => {
        const tensor = tf.browser.fromPixels(imgData, 1);
        const resized = tf.image
          .resizeBilinear(tensor, [28, 28])
          .reshape([1, 28, 28, 1]) // Reshape to [1, 28, 28, 1] for batch and single channel
          .toFloat();
        const normalized = tf.scalar(1.0).sub(resized.div(tf.scalar(255.0)));

        this.model
          .predictTopN(normalized, 5)
          .then((predictions) => {
            if (predictions) {
              this.predictions = predictions;
            }
          })
          .catch((err) => {
            console.error("Error during prediction:", err);
          });
      });
    },
    onClear() {
      this.predictions = [];
      if (this.cx && this.canvas) {
        this.cx.fillStyle = "#ffffff";
        this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    },
    formatPercent(value, decimals = 0) {
      if (isNaN(parseFloat(value))) {
        return value;
      }
      const val = parseFloat(value) * 100;
      return val.toFixed(decimals) + "%";
    },
  },
};
</script>

<style scoped lang="scss">
canvas {
  border: 1px solid #eee;
  height: 400px;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  touch-action: none;
  @media only screen and (max-width: 600px) {
    height: 350px;
  }
}
</style>
