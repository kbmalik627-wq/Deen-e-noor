import { Hadith } from '../data/types';

export function formatHadithText(hadith: Hadith): string {
  let text = `📜 حدیث مبارکہ #${hadith.id} (${hadith.hadithNumber})\n`;
  if (hadith.arabic) {
    text += `\nقال رسول الله ﷺ:\n${hadith.arabic}\n`;
  }
  text += `\nاردو ترجمہ:\n${hadith.urdu}\n`;
  text += `\nراوی: ${hadith.narratorUrdu}\n`;
  text += `حوالہ: ${hadith.book} (${hadith.chapter})\n`;
  if (hadith.lesson) {
    text += `درسِ حدیث: ${hadith.lesson}\n`;
  }
  text += `\nمجموعہ: 500 مستند احادیث مبارکہ\nDeen e Haq (دینِ حق) | پیشکش: ڈیجیٹل ایمپائر #1 (Digital Empire #1)`;
  return text;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

export function shareViaWhatsApp(hadith: Hadith) {
  const text = formatHadithText(hadith);
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function shareViaTelegram(hadith: Hadith) {
  const text = formatHadithText(hadith);
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function shareViaTwitter(hadith: Hadith) {
  const text = `${hadith.urdu.slice(0, 180)}...\n\nحوالہ: ${hadith.book}\nDeen e Haq (دینِ حق) | ڈیجیٹل ایمپائر #1`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export async function shareNative(hadith: Hadith): Promise<boolean> {
  const text = formatHadithText(hadith);
  if (navigator.share) {
    try {
      await navigator.share({
        title: `حدیث مبارکہ - ${hadith.book}`,
        text: text,
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
