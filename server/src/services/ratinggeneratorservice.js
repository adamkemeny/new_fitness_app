export function ratingGenerator(user){
  let rating = 0;
  const availability = user.availability;
  let dayCount = 0;
  let listOfAvailableDays = [];
  let avg = 0;
  for (const [day, hours] of Object.entries(availability)) {
    if (hours.length > 0) {
      dayCount += 1;
      listOfAvailableDays += day;
      avg += hours.length;
    }
  }

  if(user.difficulty == "beginner"){
    rating += 1;
  }
  else if(user.difficulty == "semi-advanced"){
    rating += 2;
  }
  else if(user.difficulty == "advanced"){
    rating += 3;
  }
  else if(user.difficulty == "pro"){
    rating += 4;
  }


  if(user.lifestyle == "sitting"){
    rating += 0;
  }
  else if(user.lifestyle == "slightlyactive"){
    rating += 1;
  }
  else if(user.lifestyle == "moderatelyactive"){
    rating += 2;
  }
  else if(user.lifestyle == "veryactive"){
    rating += 1;
  }
  else if(user.lifestyle == "extremelyactive"){
    rating += 0;
  }


  if(user.goal == "lose"){
    rating += 0;
  }
  else if(user.goal == "upkeep"){
    rating += 1;
  }
  else if(user.goal == "bulk"){
    rating += 2;
  }

  avg /= dayCount;
  rating += avg + dayCount - 1 ;
  return rating;
}

