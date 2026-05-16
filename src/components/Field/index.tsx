import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import "~/components/Field/styles.css";

interface FieldBaseProps {
  label: string;
  row?: boolean;
}

interface FieldInputProps
  extends FieldBaseProps,
    InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface FieldTextareaProps
  extends FieldBaseProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

type FieldProps = FieldInputProps | FieldTextareaProps;

export default function Field(props: FieldProps) {
  const { label, as, row, ...rest } = props;

  if (as === "textarea") {
    const { className = "", ...textareaRest } =
      rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <label className={`field ${row ? "field-row" : ""}`}>
        <span>{label}</span>
        <textarea
          className={`field-textarea${className ? " " + className : ""}`}
          {...textareaRest}
        />
      </label>
    );
  }

  const { className = "", ...inputRest } =
    rest as InputHTMLAttributes<HTMLInputElement>;
  return (
    <label className={`field ${row ? "field-row" : ""}`}>
      <span>{label}</span>
      <input {...inputRest} className={className} />
    </label>
  );
}
