import { Logger } from 'sitka';
import { Classifier } from './model/classifier.model';
import { DoodleData } from './model/doodle-data.model';

const logger = Logger.getLogger({ name: 'index' });

async function main() {
  const data = new DoodleData({
    directoryData: 'src/data',
    maxImageClass: 2000
  });
  data.loadData();

  const model = new Classifier(data);
  await model.train();
  logger.debug('model is ready!');

  await model.save();
  logger.debug('model is saved!');
}

main();
