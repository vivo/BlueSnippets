import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import * as path from 'path';

export class DoodleData {
  readonly IMAGE_SIZE = 784;  // 图片大小
  readonly IMAGE_WIDTH = 28;  // 图片宽度
  readonly IMAGE_HEIGHT = 28;  // 图片高度
  readonly TRAIN_TEST_RATIO = 8 / 10; // 训练集和测试集的比例

  directoryData: string;  // 数据目录
  maxImageClass: number;  // 最大图片类别
  paths: string[] = [];  // 图片路径
  classes: string[] = [];  // 图片类别
  get totalClasses() {
    return this.classes.length;
  }

  constructor(obj: { directoryData: string; maxImageClass: number }) {
    this.directoryData = obj.directoryData;
    this.maxImageClass = obj.maxImageClass;
  }

  /**
   * 加载数据
   */
  loadData() {
    this.paths = fs
      .readdirSync(this.directoryData)
      .filter((x) => x.endsWith('.npy'));

    if (!this.paths.length) {
      throw new Error('no .npy files found');
    }
    this.classes = this.paths.map((x) => x.replace('.npy', ''));
  }

  /**
   * 数据生成器
   * @param mode 模式：train 训练集，test 测试集
   * @returns 数据生成器
   */
  *dataGenerator(mode: 'train' | 'test') {
    const offset = 255;
    for (let i = 0; i < this.paths.length; i++) {
      let bytes = new Uint8Array(
        fs.readFileSync(
          path.join(this.directoryData, this.paths[i]),
          null
        ).buffer
      )
        .slice(80)
        .slice(0, this.maxImageClass * this.IMAGE_SIZE);

      const numImages = bytes.length / this.IMAGE_SIZE;

      if (mode === 'train') {
        bytes = bytes.slice(
          0,
          Math.floor(numImages * this.TRAIN_TEST_RATIO) * this.IMAGE_SIZE
        );
      } else if (mode === 'test') {
        bytes = bytes.slice(
          Math.floor(numImages * this.TRAIN_TEST_RATIO) * this.IMAGE_SIZE
        );
      }

      const label = this.classes[i];

      for (let j = 0; j < bytes.length; j = j + this.IMAGE_SIZE) {
        const singleImage = bytes.slice(j, j + this.IMAGE_SIZE);
        const image = tf
          .tensor(singleImage)
          .reshape([this.IMAGE_WIDTH, this.IMAGE_HEIGHT, 1])
          .toFloat();
        const xs = image.div(offset);
        const ys = tf.tensor(this.classes.map((x) => (x === label ? 1 : 0)));
        yield {
          xs,
          ys
        };
      }
    }
  }
}
