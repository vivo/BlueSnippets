import * as tf from '@tensorflow/tfjs'
import { Logger } from 'sitka'
import * as fs from 'fs'
import { DoodleData } from './doodle-data.model'

export class Classifier {
	model: tf.Sequential
	private data: DoodleData
	private logger: Logger

	constructor(data: DoodleData) {
		this.logger = Logger.getLogger({ name: this.constructor.name })

		this.data = data
		this.model = tf.sequential()
		this.model.add(
			tf.layers.conv2d({
				inputShape: [data.IMAGE_WIDTH, data.IMAGE_HEIGHT, 1],
				kernelSize: 3,
				filters: 16,
				strides: 1,
				activation: 'relu',
				kernelInitializer: 'varianceScaling'
			})
		)
		this.model.add(
			tf.layers.maxPooling2d({
				poolSize: [2, 2],
				strides: [2, 2]
			})
		)
		this.model.add(
			tf.layers.conv2d({
				kernelSize: 3,
				filters: 32,
				strides: 1,
				activation: 'relu',
				kernelInitializer: 'varianceScaling'
			})
		)
		this.model.add(
			tf.layers.maxPooling2d({
				poolSize: [2, 2],
				strides: [2, 2]
			})
		)
		this.model.add(tf.layers.flatten())
		this.model.add(
			tf.layers.dense({
				units: this.data.totalClasses,
				kernelInitializer: 'varianceScaling',
				activation: 'softmax'
			})
		)

		const optimizer = tf.train.adam()
		this.model.compile({
			optimizer,
			loss: 'categoricalCrossentropy',
			metrics: ['accuracy']
		})
	}

	async train() {
		const trainingData = tf.data
			.generator(() => this.data.dataGenerator('train'))
			.shuffle(this.data.maxImageClass * this.data.totalClasses)
			.batch(64)

		const testData = tf.data
			.generator(() => this.data.dataGenerator('test'))
			.shuffle(this.data.maxImageClass * this.data.totalClasses)
			.batch(64)

		await this.model.fitDataset(trainingData, {
			epochs: 5,
			validationData: testData,
			callbacks: {
				onEpochEnd: async (epoch, logs) => {
					this.logger.debug(
						`Epoch: ${epoch} - acc: ${logs?.acc.toFixed(
							3
						)} - loss: ${logs?.loss.toFixed(3)}`
					)
				},
				onBatchBegin: async (epoch, logs) => {
					console.log('onBatchBegin' + epoch + JSON.stringify(logs))
				}
			}
		})
	}

	async save() {
		fs.mkdirSync('doodle-model', { recursive: true })
		fs.writeFileSync(
			'doodle-model/classes.json',
			JSON.stringify({ classes: this.data.classes })
		)
		await this.model.save('file://./doodle-model')
	}
}
