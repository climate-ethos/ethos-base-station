/**
 * Parse css length value to number value in px
 * @param height The css string (e.g. '75vh')
 * @returns The corresponding value in px (e.g. 700) or undefined
 */
export const parseCssLengthValue = (height: string | undefined) => {
  if (!height) {
    return undefined;
  }

  // Check the unit of measurement
  const isPx = height.endsWith('px');
  const isVh = height.endsWith('vh');
  const isVw = height.endsWith('vw');
  const isVmin = height.endsWith('vmin');
  const isVmax = height.endsWith('vmax');
  const isEm = height.endsWith('em');
  const isRem = height.endsWith('rem');
  const isCm = height.endsWith('cm');
  const isMm = height.endsWith('mm');
  const isIn = height.endsWith('in');
  const isPt = height.endsWith('pt');
  const isPc = height.endsWith('pc');
  const value = parseFloat(height);

  if (isPx) {
    return value;
  } else if (isVh) {
    return (value * window.innerHeight) / 100;
  } else if (isVw) {
    return (value * window.innerWidth) / 100;
  } else if (isVmin) {
    return (value * Math.min(window.innerWidth, window.innerHeight)) / 100;
  } else if (isVmax) {
    return (value * Math.max(window.innerWidth, window.innerHeight)) / 100;
  } else if (isEm) {
    const fontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return value * fontSize;
  } else if (isRem) {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return value * rootFontSize;
  } else if (isCm) {
    return value * 37.795275591; // 1cm is equivalent to 37.795275591px
  } else if (isMm) {
    return value * 3.7795275591; // 1mm is equivalent to 3.7795275591px
  } else if (isIn) {
    return value * 96; // 1in is equivalent to 96px
  } else if (isPt) {
    return value * 1.33333333333; // 1pt is equivalent to 1.33333333333px
  } else if (isPc) {
    return value * 16; // 1pc is equivalent to 16px
  }

  // Unable to parse
  return undefined;
};
