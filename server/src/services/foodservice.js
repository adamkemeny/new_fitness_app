export const randomItem = (array, intolerances = [], diet) => {
  if (!array || array.length === 0) {
    throw new Error("The array does not exist!");
  }

  const suitableFoods = array.filter((food) => {
    const matchesDiet = food.type.includes(diet);

    const hasIntolerance = intolerances.some(
      (item) => food.intolerances?.includes(item)
    );

    return matchesDiet && !hasIntolerance;
  });

  if (suitableFoods.length === 0) {
    throw new Error("No suitable food found");
  }

  const index = Math.floor(
    Math.random() * suitableFoods.length
  );

  return suitableFoods[index];
};
