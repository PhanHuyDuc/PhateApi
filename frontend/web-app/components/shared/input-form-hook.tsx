import { useController, UseControllerProps } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {
  label: string;
  type?: string;
  showlabel?: boolean;
} & UseControllerProps;
export default function InputForm(props: Props) {
  const { field, fieldState } = useController({ ...props });
  return (
    <div className="mb-3 block">
      {props.showlabel && (
        <div>
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}
      <Input
        {...props}
        {...field}
        value={field.value || ""}
        type={props.type || ""}
        placeholder={props.label}
        color={
          fieldState?.error ? "failure" : !fieldState.isDirty ? "" : "success"
        }
      />
    </div>
  );
}
