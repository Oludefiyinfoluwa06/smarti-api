export type PackageType = "StudyLite" | "StudyPro";

export const PACKAGE_PRICES: Record<PackageType, number> = {
  StudyLite: Number(process.env.PACKAGE_PRICE_STUDYLITE),
  StudyPro: Number(process.env.PACKAGE_PRICE_STUDYPRO),
};
