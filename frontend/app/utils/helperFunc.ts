export const debounce = (fn: Function, delay = 500) => {
  let timer;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};
