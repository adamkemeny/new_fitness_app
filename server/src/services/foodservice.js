export const randomItem = (array, intolerances) => {
  if (!array || array.length === 0) {
    throw new Error("The array does not exist!");
  }
  if (!intolerances || intolerances.length === 0) {
    return array[Math.floor(Math.random() * array.length)];
  }

  let attempts = 0;
  while (attempts < 50) {
    const element = array[Math.floor(Math.random() * array.length)];
    let eheto = true;
    for (const i of intolerances) {
      if (element.intolerances?.includes(i)) {
        eheto = false;
        break;
      }
    }
    if (eheto) {
      return element;
    }
    attempts++;
  }
  return array[0];
};