import { hexCode } from './hex-code';

export const uiAvatars = (name: string, rounded: boolean = false, size?: number, fontSize?: number): string => {
  let link = `https://ui-avatars.com/api/?`;
  const nameArr = name ? name.split(' ') : [];

  if (nameArr.length > 1) {
    link += `name=${nameArr[0]}+${nameArr[1]}`;
  } else {
    link += `name=${name ? name.slice(0, 2) : ''}`;
  }
  link += `&rounded=${rounded}`;
  link += `&size=${size || 240}`;
  link += `&font-size=${fontSize || 0.5}`;
  link += `&color=${hexCode(name + hexCode(name || ''))}`;
  link += `&background=${hexCode(name || '')}`;

  return link;
};
