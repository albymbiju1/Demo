function isInvalidInput(str) {
    const regex = /\d+e\d+/i; // Check for scientific notation
    return str.match(regex) || str.trim() === '' || Number(str) < 0; // Add checks for empty and negative numbers
  }
  
  function getCaloriesFromInputs(list) {
    let calories = 0;
  
    for (const item of list) {
      const currVal = cleanInputString(item.value);
      const invalidInputMatch = isInvalidInput(currVal);
  
      if (invalidInputMatch) {
        alert(`Invalid Input: ${currVal}`);
        isError = true;
        return null; // Return null if there's an invalid input
      }
      calories += Number(currVal);
    }
    return calories;
  }
  
  function calculateCalories(e) {
    e.preventDefault();
    isError = false;
  
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  
    // Check for any null values due to errors
    if (isError || [breakfastCalories, lunchCalories, dinnerCalories, snacksCalories, exerciseCalories, budgetCalories].includes(null)) {
      return; // Exit if there's an error or any input is null
    }
  
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;
  
    output.classList.remove('hide');
  }
  /* Ended */