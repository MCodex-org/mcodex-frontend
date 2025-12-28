import { useEffect, useMemo, useRef, useState } from "react";

// Tri-state multi-select using DaisyUI styles
// States per option: none | positive (checked) | negative (indeterminate)
// Props:
// - options: [{ id, label }]
// - positiveIds: number[] | string[]
// - negativeIds: number[] | string[]
// - onChange: ({ positiveIds, negativeIds }) => void
// - buttonLabel?: string
// - className?: string
const TriSelect = ({
  options = [],
  positiveIds = [],
  negativeIds = [],
  onChange,
  buttonLabel = "Select",
  className = ""
}) => {
  const [stateById, setStateById] = useState(() => {
    const initial = {};
    options.forEach((opt) => {
      if (positiveIds?.includes(opt.id)) initial[opt.id] = "positive";
      else if (negativeIds?.includes(opt.id)) initial[opt.id] = "negative";
      else initial[opt.id] = "none";
    });
    return initial;
  });

  // Update internal state if options/controlled arrays change
  useEffect(() => {
    setStateById((prev) => {
      const next = { ...prev };
      const seen = new Set();
      options.forEach((opt) => {
        seen.add(opt.id);
        if (positiveIds?.includes(opt.id)) next[opt.id] = "positive";
        else if (negativeIds?.includes(opt.id)) next[opt.id] = "negative";
        else next[opt.id] = "none";
      });
      // prune removed options
      Object.keys(next).forEach((id) => {
        if (!seen.has(id)) delete next[id];
      });
      return next;
    });
  }, [options, positiveIds, negativeIds]);

  const checkboxRefs = useRef({});

  // Ensure indeterminate visuals are applied
  useEffect(() => {
    Object.entries(stateById).forEach(([id, state]) => {
      const input = checkboxRefs.current[id];
      if (input) input.indeterminate = state === "negative";
    });
  }, [stateById]);

  const summary = useMemo(() => {
    const pos = Object.entries(stateById)
      .filter(([, v]) => v === "positive").length;
    const neg = Object.entries(stateById)
      .filter(([, v]) => v === "negative").length;
    if (!pos && !neg) return buttonLabel;
    return `${buttonLabel} (${pos} ✓, ${neg} -)`;
  }, [stateById, buttonLabel]);

  const emitChange = (next) => {
    const positive = [];
    const negative = [];
    Object.entries(next).forEach(([id, s]) => {
      if (s === "positive") positive.push(id);
      if (s === "negative") negative.push(id);
    });
    onChange && onChange({ positiveIds: positive, negativeIds: negative });
  };

  const toggleCheck = (id, checked) => {
    setStateById((prev) => {
      const next = { ...prev, [id]: checked ? "positive" : "none" };
      emitChange(next);
      return next;
    });
  };

  const setNegative = (id) => {
    setStateById((prev) => {
      const next = { ...prev, [id]: "negative" };
      emitChange(next);
      return next;
    });
  };

  return (
    <div className={`dropdown ${className}`}>
      <div tabIndex={0} role="button" className="btn w-full justify-between">
        <span className="truncate text-left">{summary}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-1 w-80 p-2 shadow max-h-64 overflow-auto">
        {options?.map((opt) => {
          const state = stateById[opt.id] ?? "none";
          return (
            <li key={opt.id} className="flex items-center">
              <label className="flex flex-1 items-center gap-2">
                <input
                  ref={(el) => (checkboxRefs.current[opt.id] = el)}
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={state === "positive"}
                  onChange={(e) => toggleCheck(opt.id, e.target.checked)}
                />
                <span className="truncate">{opt.label}</span>
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                title="Mark as negative (indeterminate)"
                onClick={() => setNegative(opt.id)}
              >
                -
              </button>
            </li>
          );
        })}
        {(!options || options.length === 0) && (
          <li className="opacity-60 px-2 py-1">No options</li>
        )}
      </ul>
    </div>
  );
};

export default TriSelect;


