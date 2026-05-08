import { Star } from "@/lib/pfIcons";
import { useFavorites } from "../contexts/FavoritesContext";

interface FavoriteButtonProps {
  name: string;
  path: string;
  type?: 'page' | 'resource';
}

export default function FavoriteButton({ name, path, type = 'page' }: FavoriteButtonProps) {
  const { favorites, addFavorite, removeFavorite, isFavorite, maxFavorites } = useFavorites();
  const favorited = isFavorite(path);

  const handleToggle = () => {
    if (favorited) {
      // Find and remove
      const fav = favorites.find(f => f.path === path);
      if (fav) {
        removeFavorite(fav.id);
      }
    } else {
      // Add
      const success = addFavorite(name, path, type);
      if (!success) {
        alert(`You can only have ${maxFavorites} favorites. Please remove one to add another.`);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-[8px] rounded-[8px] transition-all ${
        favorited
          ? "bg-[#0066cc]/10 dark:bg-[#4dabf7]/10 hover:bg-[#0066cc]/20 dark:hover:bg-[#4dabf7]/20"
          : "hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]"
      }`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={`size-[20px] transition-all ${
          favorited
            ? "fill-[#0066cc] text-[#0066cc] dark:fill-[#4dabf7] dark:text-[#4dabf7]"
            : "text-[#4d4d4d] dark:text-[#b0b0b0]"
        }`}
      />
    </button>
  );
}