import React from "react";
import clsx from "clsx";

export const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </section>
);

export const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm",
      "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400",
      props.className
    )}
  />
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }> = ({ loading, children, className, ...rest }) => (
  <button
    {...rest}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium",
      "focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-300 disabled:text-gray-600",
      className
    )}
    disabled={loading || rest.disabled}
  >
    {loading ? <span className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin" /> : null}
    {children}
  </button>
);
