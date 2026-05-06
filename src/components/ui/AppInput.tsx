import React, { useEffect, useState } from "react";

type Props = {
  name: string;
  type?: "text" | "number" | "email" | "password";
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  className?: string;
};

const storageKey = (name: string) => `form:${name}`;

export function AppInput({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  // 🔥 estado interno con persistencia
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (typeof window === "undefined") return "";

    const saved = localStorage.getItem(storageKey(name));
    return saved ?? "";
  });

  // sincroniza si viene controlado desde afuera
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // guarda automáticamente
  useEffect(() => {
    localStorage.setItem(storageKey(name), internalValue);
  }, [internalValue, name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: any = e.target.value;

    // 🚨 FIX 1: evitar que números muestren 0
    if (type === "number") {
      if (val === "" || val === "0") {
        val = "";
      } else {
        val = Number(val);
      }
    }

    setInternalValue(val);

    if (onChange) onChange(val);
  };

  return (
    <input
      name={name}
      type={type}
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}