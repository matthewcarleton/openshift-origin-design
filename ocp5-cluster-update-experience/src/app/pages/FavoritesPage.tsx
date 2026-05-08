export default function FavoritesPage() {
  return (
    <div className="ocs-app-page-outer">
      <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[24px]">
        Favorites
      </h1>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[48px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
        <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px] text-center">
          No favorites yet. Add your frequently used resources here for quick access.
        </p>
      </div>
    </div>
  );
}