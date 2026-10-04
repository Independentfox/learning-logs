import { CategoryCard } from "@/components/category-card";
import { categories } from "@/content/categories";
import { logs } from "@/content/logs";

export default function LearningJourney() {
  return (
    <section aria-labelledby="learning-title">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="learning-title" className="eyebrow">
          What I&apos;m learning
        </h2>
        <span className="eyebrow">
          {categories.length} topics · {logs.length} {logs.length === 1 ? "log" : "logs"}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category, i) => (
          <CategoryCard key={category.slug} category={category} index={i} />
        ))}
      </div>
    </section>
  );
}
