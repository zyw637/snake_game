import { useEffect, useRef } from "react";

export const useInterval = (fn, delay, options) => {
  // 首先看看是否需要立即执行
  let immediate = options === null || options === void 0 ? void 0 : options.immediate;
  //借助 ref 实现 fn实时是最新的;
  const fnRef = useRef();
  fnRef.current = fn;

  // 接下来就需要 useEffect来实现 定时功能
  useEffect(() => {
    // 先判断 delay (当delay不为number 或者小于0时  直接return;)
    if (typeof delay !== 'number' || delay < 0) return;

    // 此时delay有值则看看 immediate是否为true;
    if (immediate) {
      let _a; // 此处定义 _a 可以将 fnRef.current 简写
      // @ts-ignore
      (_a = fnRef.current) === null || _a === void 0 ? void 0 : _a.call(fn) // 实行fn 并将this指针指向fn
    }
    // 设置定时器
    const timer = setInterval(() => {
      let _a;
      // @ts-ignore
      (_a = fnRef.current) === null || _a === void 0 ? void 0 : _a.call(fn)
    }, delay)

    return () => {
      clearInterval(timer) //当delay改变时 上一个useEffect就会关闭 关闭则会调用return 所以当 delay为undefined或null时 计时器将清除
    }

  }, [delay]) // 此处写delay主要是为了清除定时器

}
