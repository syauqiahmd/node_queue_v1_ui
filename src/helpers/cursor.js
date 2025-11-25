export const cursorHelper = (page) => {
  let cursor = 1
  if (page > 1) {
    cursor = ((page - 1) * 10) + 1 // Assuming each page contains 10 items
  }
  return cursor
}

