import { HadithComment } from './types';

export const INITIAL_COMMENTS: Record<number, HadithComment[]> = {
  1: [
    {
      id: 'c1-1',
      hadithId: 1,
      userName: 'محمد احمد',
      text: 'ماشاءاللہ! تمام بخاری شریف کی پہلی حدیث نیت کے اخلاص پر ہے، بہت خوبصورت ترجمہ ہے۔',
      type: 'general',
      timestamp: 'دو دن پہلے'
    },
    {
      id: 'c1-2',
      hadithId: 1,
      userName: 'ایڈمن (Digital Empire #1)',
      text: 'تمام احادیث مبارکہ کی تصدیق صحیح بخاری و مسلم سے کر لی گئی ہے، اگر کسی بھائی کو کوئی شک یا غلطی محسوس ہو تو ضرور نشاندہی فرمائیں۔',
      type: 'general',
      timestamp: 'کل'
    }
  ],
  2: [
    {
      id: 'c2-1',
      hadithId: 2,
      userName: 'عبدالرحمٰن',
      text: 'ارکانِ اسلام کی تفصیلی حدیث، ماشاءاللہ فونٹ کا انداز بہت دلکش ہے۔',
      type: 'general',
      timestamp: 'تین دن پہلے'
    }
  ],
  3: [
    {
      id: 'c3-1',
      hadithId: 3,
      userName: 'حافظ بلال',
      text: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے محفوظ رہیں۔ یہ معاشرتی امن کا بنیادی اصول ہے۔',
      type: 'general',
      timestamp: 'ایک دن پہلے'
    }
  ]
};

export const INITIAL_LIKES: Record<number, number> = {
  1: 42,
  2: 38,
  3: 29,
  4: 25,
  5: 31,
  6: 19,
  7: 45,
  8: 34,
  9: 27,
  10: 50,
  11: 22,
  12: 36,
  13: 40,
  14: 48,
  15: 33,
};
