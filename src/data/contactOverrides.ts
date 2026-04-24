import rawContactOverrides from './contactOverrides.json';

export type ContactOverride = {
  name: string;
  email?: string;
  phone?: string;
  emailStatus?: string;
  phoneStatus?: string;
  source: 'Hasil_Email_HP' | 'Email_Dummy';
};

const contactOverrides = rawContactOverrides as ReadonlyArray<ContactOverride>;

export default contactOverrides;
