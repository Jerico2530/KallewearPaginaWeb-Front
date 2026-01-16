import React from "react";

const InfoItem = ({ icon, label, value, full = false }) => {
  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-xl
        border border-gray-200 dark:border-gray-700
        bg-gray-50 dark:bg-gray-800
        hover:shadow-sm transition-all
        ${full ? "sm:col-span-2" : ""}
      `}
    >
      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
        {icon}
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {value || "-"}
        </span>
      </div>
    </div>
  );
};

export default InfoItem;
