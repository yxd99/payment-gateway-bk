import { DataSource, DataSourceOptions } from 'typeorm';

import { typeormConfig } from './typeorm';

const config: DataSourceOptions = typeormConfig() as DataSourceOptions;

const dataSource = new DataSource(config);

export default dataSource;
