import rawDummyEmailOverrides from './dummyEmailOverrides.json';

export type DummyEmailOverride = {
  index: number;
  name: string;
  email: string;
  source: 'Email_Dummy';
};

const dummyEmailOverrides = rawDummyEmailOverrides as ReadonlyArray<DummyEmailOverride>;

export default dummyEmailOverrides;
