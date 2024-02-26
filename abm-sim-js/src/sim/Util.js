import {pow} from "mathjs"

const v = 2
export function calculatePowerLawVolume(buying, x, moment) {
  const alpha = 1 + ((moment.p_k) * (buying ? 1 : -1)) / (v)
  return x / pow(1 - Math.random(), 1 / (alpha + 1))
} 

export function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) { 
 
      // Generate random number 
      var j = Math.floor(Math.random() * (i + 1));
                 
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
     
  return array;
}
