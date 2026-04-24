import rawPrimaryContactOverrides from './primaryContactOverrides.json';

export type PrimaryContactOverride = {
  name: string;
  email?: string | null;
  phone?: string | null;
  emailStatus?: string | null;
  phoneStatus?: string | null;
  source: 'Hasil_Email_HP';
};

const primaryContactOverrides = rawPrimaryContactOverrides as ReadonlyArray<PrimaryContactOverride>;

export default primaryContactOverrides;
