/**
 * This function exists to allow us to use setTimeout in a way that doesn't block the UI thread.
 *
 * Instead of using setTimeout, we use requestAnimationFrame to call the function recursively until the timeout is reached.
 *
 * This will enable us to render smooth animations while the timeout is running.
 */
export function setLayoutTimeout(
  callback: (...args: any) => any,
  timeout: number,
  startTime = Date.now(),
  timePassed = 0,
  hasStopped = { current: false }
) {
  if (timePassed > timeout) {
    callback();
    return;
  }

  requestAnimationFrame(() => {
    if (hasStopped.current) return;
    setLayoutTimeout(
      callback,
      timeout,
      startTime,
      Date.now() - startTime,
      hasStopped
    );
  });

  return () => {
    hasStopped.current = true;
  };
}

export function clearLayoutTimeout(
  timeout: ReturnType<typeof setLayoutTimeout>
) {
  if (timeout) timeout();
}
