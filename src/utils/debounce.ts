import { clearLayoutTimeout, setLayoutTimeout } from "./layout-timeout";

/**
 * This function adds the functionality of delaying a
 * function execution based on a certain timeout.
 *
 * See, for reference: https://www.freecodecamp.org/news/javascript-debounce-example/
 *
 * @param functionToDelay - The function to be delayed
 * @param timeout - The timeout in milliseconds
 */
export default function debounce<
  TFunctionToDelay extends (...args: any) => any
>(timeout = 300) {
  let timer: ReturnType<typeof setLayoutTimeout> | undefined;
  return (functionToDelay: TFunctionToDelay) => {
    clearLayoutTimeout(timer);
    timer = setLayoutTimeout(functionToDelay, timeout);
  };
}
