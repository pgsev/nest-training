import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';

const basisFileName = 'dev.yml';
const envPathFileName = `${process.env.NODE_ENV || 'dev'}.yml`;

function readYamlFile(fileName: string) {
  // 获取文件路径
  const filePath = path.join(__dirname, '../../../../config', fileName);
  const file = fs.readFileSync(filePath, 'utf8');
  return yaml.load(file);
}

export default () => {
  // 通过lodash中的merge方法合并
  return _.merge(readYamlFile(basisFileName), readYamlFile(envPathFileName));
};
