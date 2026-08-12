export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-asphalt-900/15 dark:border-white/10">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-asphalt-900/5 dark:bg-white/5 flex items-center justify-center mb-4">
          <Icon size={26} className="text-asphalt-900/40 dark:text-mist-100/40" />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
