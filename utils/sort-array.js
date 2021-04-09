module.exports = (arr) => {
  const swap = (list, a, b) => ([list[a], list[b]] = [list[b], list[a]]);

  arr.forEach((item, i) => {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    swap(arr, i, min);
  });

  return arr;
};
