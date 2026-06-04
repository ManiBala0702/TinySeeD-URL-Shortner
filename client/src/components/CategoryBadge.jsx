const CATEGORY_STYLES = {
  social: { label: "Social", classes: "bg-[#7c6ff7]/10 text-[#7c6ff7] border-[#7c6ff7]/20" },
  search: { label: "Search", classes: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20" },
  news: { label: "News", classes: "bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20" },
  tech: { label: "Tech", classes: "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/20" },
  shopping: { label: "Shopping", classes: "bg-[#f472b6]/10 text-[#f472b6] border-[#f472b6]/20" },
  video: { label: "Video", classes: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20" },
  other: { label: "Other", classes: "bg-[#1e2d45] text-[#8b9cba] border-[#1e2d45]" },
};

export default function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category?.toLowerCase()] || CATEGORY_STYLES.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.classes}`}>
      {style.label}
    </span>
  );
}
