/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

const catchAsyncRefined = (fn: (...args: any[]) => Promise<void>) => {
  return (...args: unknown[]) => {
    const next = args[args.length - 1] as (err?: any) => void;
    Promise.resolve(fn(...args)).catch(next);
  };
};

export default catchAsyncRefined;
