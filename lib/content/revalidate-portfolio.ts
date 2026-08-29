/** Ping the portfolio site to bust Next.js caches after CMS writes. */
export async function revalidatePortfolio(): Promise<void> {
  const url = process.env.PORTFOLIO_REVALIDATE_URL?.replace(/\/$/, "");
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn("[revalidate-portfolio]", res.status, await res.text());
    }
  } catch (error) {
    console.warn("[revalidate-portfolio]", error);
  }
}
