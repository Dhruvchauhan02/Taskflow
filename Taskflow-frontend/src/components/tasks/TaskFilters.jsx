import { Filter, Search } from "lucide-react"
import {
  SORT_OPTIONS,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "../../utils/taskConfig"
import SelectField, {
  premiumFieldClass,
  selectOptionClass,
} from "../ui/SelectField"

const fieldClass =
  premiumFieldClass

function TaskFilters({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  allTags,
}) {
  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  return (
    <section className="mb-6 rounded-[1.35rem] bg-white/[0.042] p-4 shadow-xl shadow-black/10 ring-1 ring-white/[0.07] backdrop-blur-xl sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_145px_145px_150px_150px]">
        <label className="relative block">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search title, notes, tags..."
            value={filters.searchTerm}
            onChange={(event) => updateFilter("searchTerm", event.target.value)}
            className={`${fieldClass} pl-11`}
          />
        </label>

        <SelectField
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
        >
          <option value="All" className={selectOptionClass}>All Status</option>
          {TASK_STATUSES.map((item) => (
            <option key={item} value={item} className={selectOptionClass}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          value={filters.priority}
          onChange={(event) => updateFilter("priority", event.target.value)}
        >
          <option value="All" className={selectOptionClass}>All Priority</option>
          {TASK_PRIORITIES.map((item) => (
            <option key={item} value={item} className={selectOptionClass}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
        >
          <option value="All" className={selectOptionClass}>All Category</option>
          {TASK_CATEGORIES.map((item) => (
            <option key={item} value={item} className={selectOptionClass}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value} className={selectOptionClass}>
              {item.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <input
          type="text"
          list="task-tags"
          placeholder="Filter by tag..."
          value={filters.tagFilter}
          onChange={(event) => updateFilter("tagFilter", event.target.value)}
          className={fieldClass}
        />
        <datalist id="task-tags">
          {allTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>

        <label className="inline-flex h-11 items-center gap-2 rounded-[1rem] bg-white/[0.055] px-3.5 text-sm text-slate-300 ring-1 ring-white/[0.07]">
          <input
            type="checkbox"
            checked={filters.overdueOnly}
            onChange={(event) => updateFilter("overdueOnly", event.target.checked)}
            className="accent-white"
          />
          Overdue only
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600">
        <Filter size={14} />
        Filters, sorting, tags, and search work together.
      </div>
    </section>
  )
}

export default TaskFilters
