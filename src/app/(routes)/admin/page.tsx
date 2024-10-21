export default function Page() {
  if (process.env.NODE_ENV !== "development") return;
  return <>Admin</>;
}
