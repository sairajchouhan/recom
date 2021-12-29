export const cls = (...classes: any) => {
  return classes.filter(Boolean).join(' ')
}
