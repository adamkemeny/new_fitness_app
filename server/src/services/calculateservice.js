export const calculate = (data) => {
    const age = Number(data.age);
    const weight = Number(data.weight);
    const height = Number(data.height);
    const gender = data.gender;
    const goal = data.goal;
    const intolerances = data.intolerances;
    const lifestyle = data.lifestyle;
    let score;
    const bmr = 10*weight + 6.25*height - 5*age + (gender === "male" ? 5 : -161 );

    switch (lifestyle){
      case "sitting":
        score = 1.2;
        break;

      case "slightlyactive":
        score = 1.375;
        break;

      case "moderatelyactive":
        score = 1.55;
        break;

      case "veryactive":
        score = 1.725;
        break;
      case "extremelyactive":
        score = 1.9;
        break;

      default:
        score = 1.2;
        break;
    }

    let calories = goal === "lose" ? (bmr*score)*0.8 : goal === "bulk" ? (bmr*score)*1.2 : bmr*score;
    const protein1 = goal === "bulk" ? weight * 2 : goal === "lose" ? weight * 1.6 : weight * 1.4;
    const fat1 = weight * 0.8;
    const remainingCalories = calories - (protein1 * 4 + fat1 * 9);
    const carbs1 = remainingCalories / 4;
    calories = Math.floor(calories);

     const macros = {
      protein: Math.floor(protein1),
      fat: Math.floor(fat1),
      carbs: Math.floor(carbs1)
    }

    return {macros,calories};

}